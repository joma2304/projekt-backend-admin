const header = document.getElementById("header");
let lastScrollTop = 0;

window.addEventListener("scroll", function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > lastScrollTop) {
        // Scrollar nedåt
        header.classList.add("transparent");
    } else {
        // Scrollar uppåt
        header.classList.remove("transparent");
    }

    lastScrollTop = currentScroll;
});
