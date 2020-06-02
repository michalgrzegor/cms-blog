class Navigation {
  constructor() {
    this.open = false;
  }

  openNav() {
    const navBurger = document.querySelector('.nav__burger');
    const nav = document.querySelector('nav');
    navBurger.addEventListener('click', () => {
      navBurger.classList.toggle('nav__burger--close');
      nav.classList.toggle('nav--close');
    });
  }
}

export default Navigation;
