document.querySelectorAll('.section-link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.getElementById(this.getAttribute('data-target'));
        const headerHeight = document.querySelector('.header').offsetHeight;
        const offsetTop = target.offsetTop - headerHeight;

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    });
});
