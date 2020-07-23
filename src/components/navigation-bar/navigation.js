import navigationBody from './navigation-html';
import {TOKEN_HANDLER} from '../auth/fetch';

const navigationTemplate = () => {
  const temp = document.createElement('template');
  temp.innerHTML = navigationBody;
  return temp;
};

class NavigationBar extends HTMLElement {
  constructor() {
    super();
    this.shadow_root = this.attachShadow({
      mode: 'open',
    });
    this.shadow_root.appendChild(navigationTemplate().content.cloneNode(true));
    this.toggleNavigation(this.shadow_root);
    this.isAdminFunction = false;
    this.setAdminFunction(this.shadow_root);
  }

  toggleNavigation(temp) {
    const navBurger = temp.querySelector('.nav__burger');
    const nav = temp.querySelector('nav');
    const bg = temp.querySelector('.nav__background');
    [navBurger, bg].forEach(el =>
      el.addEventListener('click', ev => {
        ev.preventDefault();
        navBurger.classList.toggle('nav__burger--close');
        nav.classList.toggle('nav--close');
        bg.classList.toggle('nav__background--close');
        this.setAdminFunction(this.shadow_root);
      })
    );
  }

  toggleAdminFunctions(temp) {
    if (!this.isAdminFunction) {
      const functionsContainer = temp.querySelector('.nav__menu');
      const listEl = document.createElement('li');
      const linkEl = document.createElement('a');
      listEl.classList.add('menu__element', 'menu__element--admin');
      linkEl.href = './admin-panel';
      linkEl.innerHTML = 'ADMIN';
      listEl.appendChild(linkEl);
      functionsContainer.appendChild(listEl);
      this.isAdminFunction = true;
    }
  }

  deleteAdminFunction(temp) {
    const adminFunction = temp.querySelector('.menu__element--admin');
    if (this.isAdminFunction) adminFunction.remove();
    this.isAdminFunction = false;
  }

  setAdminFunction(temp) {
    if (TOKEN_HANDLER.getIsToken()) {
      this.toggleAdminFunctions(temp);
    } else {
      this.deleteAdminFunction(temp);
    }
  }
}
export default NavigationBar;
