window.onload = () => {
    let elem = document.querySelector('.grid');
    console.log(elem);
    let msnry = new Masonry( elem, {
        itemSelector: '.grid-item',
        columnWidth: '.grid-sizer',
        percentPosition: true

    });
}

