class Terminal {
    constructor(elem, options) {
        options = options || {cols: 805, rows: 25};
        this.elem = elem;
        this.bufW = options.cols;
        this.bufH = options.rows;

        this.buffer = [];
        this.visible = {start: 0, end: 0};

        this.init = this.init.bind(this);
    }

    init() {
        this.elem.innerHTML = '';
        this.elem.classList.add('terminal');

        this.buffer = document.createElement('div');
        this.buffer.id = 'buffer';
        this.typer = new Typer(this.buffer);

        this.elem.appendChild(this.buffer);

        this.typer.addText('Hi! I\'m Naitian. \'exit\' to go back.');
        this.typer.type();

    }
}
