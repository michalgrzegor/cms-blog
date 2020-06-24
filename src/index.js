import './style/style.scss';
import openNav from './components/UI/nav';
import PostMiniatures from './components/UI/post-miniature';
import {TOKEN_HANDLER} from './components/auth/fetch';
import {makeRefreshTokenPost} from './components/auth/pkce';

openNav();
const postMiniatures = new PostMiniatures();
postMiniatures.renderPostsMin();
// import Icon from './assets/****'; adding images from assets
const onLoad = () => {
  window.addEventListener('load', () => {
    TOKEN_HANDLER.setIsExpired();
    if (!TOKEN_HANDLER.getIsExpired()) makeRefreshTokenPost();
  });
};
onLoad();
