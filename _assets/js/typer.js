/* exported Typer */
class Typer {
    constructor (el, options) {
        options = options || {};
        this.el = el;
        this.time = options.time || 100;
        this.prepend = options.prepend || '$ ';
        this.message = [];
        this.typing = false;

        this.type = this.type.bind(this);
        this.recur = this.recur.bind(this);
        this.put = this.put.bind(this);
        this.addText = this.addText.bind(this);
        this.addHtml = this.addHtml.bind(this);
        this.newLine = this.newLine.bind(this);

        this.el.innerHTML = this.prepend;
    }

    addText (text) {
        this.message = this.message.concat(text.split(''));
    }

    addHtml (html) {
        this.message.push(html);
    }

    newLine () {
        this.message.push('<br/><br/>');
    }

    type (callback) {
        this.typing = true;
        window.setTimeout(this.recur, this.time, callback);
    }

    put (message) {
        message = message || this.message;
        this.el.innerHTML += message;
    }

    recur (callback) {
        this.el.innerHTML += this.message.shift();
        if (this.message.length > 0)
            window.setTimeout(this.recur.bind(this), this.time, callback);
        else {
            this.typing = false;
            if (callback) {
                callback();
            }
        }
    }
}

