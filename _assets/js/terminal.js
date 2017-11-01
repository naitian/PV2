/* exported Terminal */
/* globals Typer */
class Terminal {
  constructor(elem) {
    this.elem = elem;
    this.buffer = null;
    this.files = null;

    this.pwd = '/';
    this.history = [];
    this.historyIndex = 0;
    this.historyMode = false;
    this.historySave = '';
    this.commands = new Map();

    this.init = this.init.bind(this);
    this.loadFiles = this.loadFiles.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.enter = this.enter.bind(this);
    this.tab = this.tab.bind(this);
    this.historyUp = this.historyUp.bind(this);
    this.historyDown = this.historyDown.bind(this);
    this.process = this.process.bind(this);
    this.register = this.register.bind(this);

    this.tab.calledTimes = 0
    this.tab.completions = []

    this.ls = this.ls.bind(this);
    this.help = this.help.bind(this);
    this.cd = this.cd.bind(this);
    this.cat = this.cat.bind(this);
    this.isdir = this.isdir.bind(this);
    this.exists = this.exists.bind(this);

    this.loadFiles('terminal.json');

    this.register('exit', () => {
      window.location = 'https://naitian.org';
    });
    this.register('clear', () => {
      this.buffer.innerHTML = '<br>';
    });
    this.register('pwd', () => {
      this.print(this.pwd);
    });
    this.register('help', this.help);
    this.register('ls', this.ls);
    this.register('cd', this.cd);
    this.register('cat', this.cat);
  }

  init () {
    this.elem.innerHTML = '';
    this.elem.classList.add('terminal');

    this.wrap = document.createElement('div');
    this.wrap.id = 'term-wrap';
    this.elem.appendChild(this.wrap);

    this.buffer = document.createElement('div');
    this.buffer.id = 'display';
    this.buffer.className = 'buffer';
    this.typer = new Typer(this.buffer, {prepend: ''});

    this.wrap.appendChild(this.buffer);

    this.input = document.createElement('div');
    this.input.id = 'input';
    this.input.className = 'buffer';
    this.input.contentEditable = true;
    this.input.onblur = () => {
      this.input.focus();
    };
    this.input.addEventListener('keydown', this.handleKeyDown);
    this.wrap.appendChild(this.input);
    this.input.focus();

    this.typer.addText('Hi! I\'m Naitian. \'help\' to do more stuff.');
    this.typer.type();

  }

  handleKeyDown (e) {
    if (this.typer.typing) {
      e.preventDefault();
      return;
    }

    if (e.keyCode === 39 ||
      e.keyCode === 37 ||
      e.keyCode === 9 ||
      e.keyCode === 13 ||
      e.keyCode === 38 ||
      e.keyCode === 40) {
      e.preventDefault();
    }

    if (e.keyCode === 13) {
      this.enter();
    } else if (e.keyCode === 9) {
      this.tab();
    } else if (e.keyCode === 40) {
      this.historyDown();
    } else if (e.keyCode === 38) {
      this.historyUp();
    } else {
      this.tab.calledTimes = 0;
    }
  }

  historyDown () {
    if (this.history.length === 0)
      return;
    this.historyIndex--;
    if (this.historyIndex >= 0) {
      this.input.innerText = this.history[this.historyIndex];
      this.placeCaretAtEnd(this.input);
    }
    if (this.historyIndex < 0) {
      console.log('hi');
      this.historyIndex = 0;
      this.historyMode = false;
      this.input.innerText = this.historySave;
      this.placeCaretAtEnd(this.input);
    }
  }

  historyUp () {
    if (this.history.length === 0)
      return;
    if (this.historyIndex === 0 && !this.historyMode)
      this.historySave = this.input.innerText;
    if (this.historyMode)
      this.historyIndex++;
    this.historyMode = true;
    if (this.historyIndex >= this.history.length)
      this.historyIndex = this.history.length - 1;
    this.input.innerText = this.history[this.historyIndex];
    this.placeCaretAtEnd(this.input);
  }

  enter () {
    let message = this.input.innerText;
    this.history.unshift(message);
    this.print('$ ' + message);
    this.input.innerText = '';

    this.process(message);
  }

  tab () {
    let current = this.input.innerText;
    let space_delim = current.split(' ');
    let partial = space_delim[space_delim.length - 1];

    if (this.tab.calledTimes === 0) {
      let results = []
      for (let entry of this.commands.entries()){
        if (entry[0].indexOf(partial) === 0)
          results.push(entry[0])
      }
      let set = new Set();
      for (let file in this.files) {
        if (file.indexOf(this.pwd) === 0 && file !== this.pwd) {
          let paths = file.replace(this.pwd, '').split('/');
          if (this.isdir(this.pwd + paths[0] + '/'))
            set.add(paths);
          else
            set.add(paths);
        }
      }

      let visited = new Set();
      for (let path of set) {
        let full = '';
        for (let sub of path) {
          full += sub;
          full += (sub.indexOf('/') === -1) ? '/' : '';
          if (visited.has(full)) {
            break;
          }
          if (full.indexOf(partial) === 0) {
            visited.add(full)
            results.push(full)
            break;
          }
        }
      }
      this.tab.completions = results
    }
    if (this.tab.completions.length !== 0) {
      this.input.innerText = space_delim.slice(0, space_delim.length - 1).join(' ')
      this.input.innerText += this.input.innerText !== '' ? ' ':''
      this.input.innerText += this.tab.completions[this.tab.calledTimes % this.tab.completions.length]
    }
    this.tab.calledTimes++;
    this.placeCaretAtEnd(this.input)
  }

  process (message) {
    if (message === '')
      return;
    let argv = message.match(/"[^"]+"|'[^']+'|\S+/g);
    const cmd = argv[0];
    if (this.commands.has(cmd)) {
      argv.shift();
      this.commands.get(cmd)(argv);
    } else {
      this.error('CommandNotFound', {'cmd': cmd});
    }
  }

  register(cmd, func) {
    this.commands.set(cmd, func);
  }

  error (err, args) {
    console.log(err);
    console.log(args);
    switch (err) {
      case 'CommandNotFound':
        let error = `-bash: ${args.cmd}: command not found`;
        this.print(error);
        break;
      default:
        this.print('error: ' + err);
    }
  }

  print (message) {
    if (this.buffer.innerHTML === '<br>')
      this.buffer.innerHTML += message;
    else
      this.buffer.innerHTML += '<br>' + message;
    this.buffer.scrollTop = this.buffer.scrollHeight;
    this.wrap.scrollTop = this.wrap.scrollHeight;
  }

  placeCaretAtEnd (el) {
    // http://jsfiddle.net/Gaqfs/9/
    el.focus();
    if (typeof window.getSelection !== 'undefined' &&
      typeof document.createRange !== 'undefined') {
      var range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    } else if (typeof document.body.createTextRange !== 'undefined') {
      var textRange = document.body.createTextRange();
      textRange.moveToElementText(el);
      textRange.collapse(false);
      textRange.select();
    }
  }

  ls (args) {
    let old = this.pwd;
    let target;
    if (args.length === 0) {
      console.log(this.pwd)
      target = ['.'];
    } else {
      target = args;
      console.log(target)
    }
    if (this.cd(target) !== true)
      return
    console.log(this.pwd)
    let set = new Set();
    for (let file in this.files) {
      if (file.indexOf(this.pwd) === 0 && file !== this.pwd) {
        let paths = file.replace(this.pwd, '').split('/');
        if (this.isdir(this.pwd + paths[0] + '/'))
          set.add('<b style="color: #A5C0FF">' + paths[0] + '<b>');
        else
          set.add(paths[0]);
      }
    }
    set.forEach((val) => {
      this.print(val);
    });
    this.pwd = old;
  }

  help () {
    this.print('Here is a list of commands');
    this.commands.forEach((func, cmd) => {
      this.print(' - ' + cmd);
    });
  }

  cd (args) {
    let target;
    if (args.length === 0) {
      target = '/';
    } else {
      target = this.normalizePath(args[0]);
    }

    if (!this.exists(target))
      return this.error('NoSuchFile', {'file': target, 'cmd': 'cd'});
    if (this.isdir(target)) {
      this.pwd = target;
      return true;
    } else {
      return this.error('NotADir', {'file': target, 'cmd': 'cd'});
    }
  }

  cat (args) {
    if (args.length === 0) {
      return this.print('Missing filename');
    }
    let target = this.normalizePath(args[0]);
    if (!this.exists(target)) {
      return this.error('NoSuchFile', {'file': target, 'cmd': 'cat'});
    }
    if (this.isdir(target)) {
      return this.error('IsADir', {'file': target, 'cmd': 'cat'});
    }
    this.print(this.files[target].content);
    return;
  }

  normalizePath (path) {
    /*
     *  Should return the absolute path with leading /
     *  given a path relative to pwd
     *
     *    /blog/ -> /blog
     *    /blog/2016 -> /blog/2016
     *    /blog/2016/ -> /blog/2016
     *    blog/2016 -> /blog/2016
     *
     *    If pwd = /blog/
     *    /blog -> /blog/blog
     *    2016/ -> /blog/2016
     *
     *  Also interprets . and ..
     *
     *    Given pwd = /blog/
     *    . -> blog
     *    .. -> /
     *
     *  TODO: implement . and .. embedded in other paths.
     * */
    if (path === '.') {
      return this.pwd;
    }
    if (path === '..') {
      let parts = this.pwd.split('/');
      parts = parts.slice(1, parts.length - 2);
      if (parts.length === 0) {
        return '/';
      }
      return '/' + parts.join('/') + '/';
    }
    if (path.length > 1) {
      path = path.replace(/^\/+|\/+$/g, '');
      path = this.pwd + path + '/';
      return path;
    } else if (path.length === 1 && path[0] === '/'){
      return '/';
    } else {
      return path;
    }
  }

  isdir (path) {
    if (path === '/')
      return true;
    for (let file in this.files) {
      if (file.indexOf(path) === 0 && !file.endsWith(path)) {
        return true;
      }
    }
    return false;
  }

  exists (path) {
    for (let file in this.files) {
      if (file.indexOf(path) === 0)
        return true;
    }
    return false;
  }

  loadFiles (filename) {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', filename);

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        this.files = JSON.parse(xhr.response);
      }
    };

    xhr.send();
  }
}
