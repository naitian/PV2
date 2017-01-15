/* exported Terminal */
/* globals Typer */
class Terminal {
    constructor(elem) {
        this.elem = elem;
        this.buffer = null;
        this.files = null;

        this.pwd = '/';
        this.commands = new Map();

        this.init = this.init.bind(this);
        this.loadFiles = this.loadFiles.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.enter = this.enter.bind(this);
        this.tab = this.tab.bind(this);
        this.process = this.process.bind(this);
        this.register = this.register.bind(this);
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

    init() {
        this.elem.innerHTML = '';
        this.elem.classList.add('terminal');

        this.buffer = document.createElement('div');
        this.buffer.id = 'display';
        this.buffer.className = 'buffer';
        this.typer = new Typer(this.buffer, {prepend: ''});

        this.elem.appendChild(this.buffer);

        this.input = document.createElement('div');
        this.input.id = 'input';
        this.input.className = 'buffer';
        this.input.contentEditable = true;
        this.input.onblur = () => {
            this.input.focus();
        };
        this.input.addEventListener('keydown', this.handleKeyDown);
        this.elem.appendChild(this.input);
        this.input.focus();

        this.typer.addText('Hi! I\'m Naitian. \'exit\' to go back.');
        // this.typer.type();

    }

    handleKeyDown (e) {
        if (this.typer.typing)
            e.preventDefault();
        if (e.keyCode === 39 || e.keyCode === 37 || e.keyCode === 9 || e.keyCode === 13) {
            e.preventDefault();
        }

        if (e.keyCode === 13) {
            this.enter();
        } else if (e.keyCode === 9) {
            this.tab();
        }
    }

    enter () {
        let message = this.input.innerText;
        this.print('$ ' + message);
        this.input.innerText = '';

        this.process(message);
    }

    tab () {

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
    }

    ls () {
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
            return;
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
        if (path[0] !== '/') {
            path = path.replace(/^\/+|\/+$/g, '');
            path = this.pwd + path + '/';
            return path;
        } else {
            return '/';
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
