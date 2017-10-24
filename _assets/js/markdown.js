window.onload = () => {
  document.querySelectorAll('img').forEach((val) => {
    val.addEventListener('click', addLightBox);
  });
}

let addLightBox = (e) => {
  console.log(e)
  let overlay = document.createElement('div');
  overlay.className = 'lb-overlay';
  overlay.addEventListener('click', removeLightBox);

  let img = document.createElement('img');
  img.className = 'lb-img';
  img.src = e.target.src;

  overlay.appendChild(img);
  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
}

let removeLightBox = (e) => {
  console.log('remove', e);
  document.querySelector('.lb-overlay').remove();
  // e.target.remove();
  e.stopPropagation();
  document.body.style.overflow = '';
}
