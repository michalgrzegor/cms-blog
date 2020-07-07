import './style/style.scss';
import PostsMiniatures from './components/UI/post-miniature';
import {TOKEN_HANDLER} from './components/auth/fetch';
import NavigationBar from './components/navigation-bar/navigation';

window.customElements.define('navigation-bar', NavigationBar);
// import Icon from './assets/****'; adding images from assets
const onLoad = () => {
  window.addEventListener('load', () => {
    TOKEN_HANDLER.setIsExpired();
  });
};

const PM = new PostsMiniatures();
PM.initPostsMiniatures();

onLoad();
