/* globals Terminal */
'use strict';
window.onload = () => {
    const flip = document.querySelector('#flip');
    flip.addEventListener('click', () => {
      // activateShell();
      window.location.hash = '#terminal';
      window.location.reload(true)
    });

    if (window.location.hash === '#terminal') {
      activateShell();
    }
};

window.onhashchange = () => {
  window.location.reload(true)
}

let activateShell = () => {

  const body = document.getElementsByTagName('body')[0];
  const term = new Terminal(body);
  flip.style.borderLeft = '200vw solid #92a8da';
  flip.style.borderBottom = '200vh solid #272727';

  flip.addEventListener('transitionend', term.init);

}
