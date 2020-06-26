import Quill from 'quill';
import {options, quillbtn} from './quill-options';
import '../../style/components_style/editor.scss';
import 'quill/dist/quill.snow.css';
import {handleRedirect, logout} from '../auth/pkce';
import navOpen from '../UI/nav';
import {generateToken, TOKEN_HANDLER} from '../auth/fetch';

const onLoad = () => {
  window.addEventListener('load', () => {
    TOKEN_HANDLER.setIsExpired();
    handleRedirect();
  });
};
onLoad();
navOpen();
const tokenButton = () => {
  const button = document.querySelector('.token');
  button.addEventListener('click', () => generateToken());
};
tokenButton();
const logoutButton = () => {
  const button = document.querySelector('.logout');
  button.addEventListener('click', () => logout());
};
logoutButton();

const editor = new Quill('#editor', options);
quillbtn(editor);
