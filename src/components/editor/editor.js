import '../../style/components_style/editor.scss';
import EditorJS from '@editorjs/editorjs';
import options from './editor-options';
import {fireBtn, fireLoadBtn} from './editor-func';
import {handleRedirect, logout, makeRefreshTokenPost} from '../auth/pkce';
import navOpen from '../UI/nav';
import {generateToken, TOKEN_HANDLER} from '../auth/fetch';

const onLoad = () => {
  window.addEventListener('load', () => {
    TOKEN_HANDLER.setIsExpired();
    if (!TOKEN_HANDLER.getIsExpired()) makeRefreshTokenPost();
    handleRedirect();
  });
};
const editor = new EditorJS(options);
fireBtn(editor);
fireLoadBtn(editor);
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
