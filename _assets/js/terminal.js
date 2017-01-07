/* exported Terminal */
/* globals Typer */
class Terminal {
    constructor(elem, options) {
        options = options || {cols: 80, rows: 25};
        this.charDimensions = this.getCharDimensions();
        this.elem = elem;
        this.buffer = null;

        this.visible = {start: 0, end: 0};
        
        this.files = null;

        this.init = this.init.bind(this);
        this.loadFiles = this.loadFiles.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);

        this.loadFiles('terminal.json');
    }

    init() {
        this.elem.innerHTML = '';
        this.elem.classList.add('terminal');

        this.buffer = document.createElement('div');
        this.buffer.id = 'buffer';
        this.typer = new Typer(this.buffer);

        this.elem.appendChild(this.buffer);

        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.tabIndex = -1;
        this.input.onblur = () => {
           this.input.focus(); 
        };
        this.elem.appendChild(this.input);
        this.input.focus();

        console.log('asdg');
        this.input.addEventListener('keyup', this.handleKeyDown);


        this.typer.addText('Hi! I\'m Naitian. \'exit\' to go back.');
        this.typer.newLine();
        this.typer.type();

    }

    getCharDimensions () {
        const span = document.createElement('span');
        span.innerHTML = '1234567890';
        document.getElementsByTagName('body')[0].appendChild(span);
        let charSize = {
            width: span.getBoundingClientRect().width / 10,
            height: span.getBoundingClientRect().height
        };
        
        document.getElementsByTagName('body')[0].removeChild(span);
        return charSize;
    }

    handleKeyDown () {
        console.log('hi');
        this.buffer.innerText += this.input.value;
        this.input.value = '';
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
