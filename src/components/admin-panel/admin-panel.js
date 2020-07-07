import '../../style/components_style/admin-panel.scss';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import {handleRedirect} from '../auth/pkce';
import {TOKEN_HANDLER} from '../auth/fetch';
import NavigationBar from '../navigation-bar/navigation';
import initEditor from './admin-opt/quill-options';
import initAdminNav from './admin-navigation';

window.customElements.define('navigation-bar', NavigationBar);
const onLoad = () => {
  window.addEventListener('load', () => {
    handleRedirect();
    initEditor();
    TOKEN_HANDLER.setIsExpired();
  });
};
onLoad();
initAdminNav();
