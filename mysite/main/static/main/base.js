const NavSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        for (var i = 0; i < navLinks.length; i++) {
            navLinks[i].style.animation = "navLinksFade 1s ease forwards " + 0.2 * i / navLinks.length + "s";
        }
    });
}
NavSlide();








