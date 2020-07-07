import '../../style/shared/blog-post.scss';
import responseJson from '../admin-panel/jsons/lorem.json';
import NavigationBar from '../navigation-bar/navigation';
import {TOKEN_HANDLER} from '../auth/fetch';
import createBlogPost from './blog-ui';

window.customElements.define('navigation-bar', NavigationBar);

const postBodyRequest = async () => {
  return new Promise((resolve, reject) => {
    resolve(responseJson);
    reject(new Error(`spartoliło się`));
  });
};

const onLoad = () => {
  window.addEventListener('load', () => {
    TOKEN_HANDLER.setIsExpired();
  });
};

postBodyRequest().then(res => createBlogPost(res));

onLoad();
