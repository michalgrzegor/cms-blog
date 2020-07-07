import * as _mf from './manager-functions';
import {blogPostReq} from '../../auth/fetch';

const addBtnEvents = () => {
  document.querySelector('.admin__container').addEventListener('click', () => console.log(`event`));
};

const renderPostsManager = postsList => {
  _mf.renderLegend('post', postsList.posts, 'posts');
  _mf.renderTable(postsList.posts, 'post');
  addBtnEvents();
};

const initPostsManager = () => {
  blogPostReq()
    .makeGetAllBlogPosts()
    .then(response => response.json())
    .then(posts => renderPostsManager(posts));
};

export default initPostsManager;
