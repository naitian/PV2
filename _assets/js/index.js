'use strict';
window.onload = () => {
    const flip = document.querySelector('#flip');
    flip.addEventListener('click', (e) => {
        const body = document.getElementsByTagName('body')[0];
        const term = new Terminal(body);
        flip.style.borderLeft = '200vw solid #fff0af';
        flip.style.borderBottom = '200vh solid #272727';

        flip.addEventListener('transitionend', term.init);
    })
}
