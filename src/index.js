import './style/style.scss';
import Navigation from './components/UI/nav';
import PostMiniatures from './components/UI/post-miniature';

const nav = new Navigation();
nav.openNav();
const postMiniatures = new PostMiniatures();
postMiniatures.renderPostsMin();
// import Icon from './assets/****'; adding images from assets
