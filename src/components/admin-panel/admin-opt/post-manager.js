import * as _mf from './manager-functions';
import {blogPostReq} from '../../auth/fetch';
import {createLoader, removeLoader} from '../../UI/loader';
import {changeToEditor} from '../admin-navigation';
import {loadDataToEditor} from './quill-options';

const removeTable = () => {
  document.querySelector('main').innerHTML = '';
};

const addBtnEvents = () => {
  Array.from(document.querySelectorAll('.btn--edit')).forEach(btn => {
    btn.addEventListener('click', () => {
      blogPostReq()
        .makeGetBlogPost(btn.getAttribute('post-id'))
        .then(r => r.json())
        .then(r => changeToEditor(r))
        .then(r => loadDataToEditor(r));
    });
  });
  Array.from(document.querySelectorAll('.btn--delete')).forEach(btn => {
    btn.addEventListener('click', () => {
      blogPostReq()
        .makeDeleteBlogPost(btn.getAttribute('post-id'))
        .then(r => r.json())
        .then(r => console.log(r))
        .then(() => removeTable())
        .then(() => initPostsManager());
    });
  });
};

const renderPostsManager = postsList => {
  console.log(postsList);
  _mf.renderLegend('post', postsList, 'posts');
  _mf.renderTable(postsList, 'post');
  addBtnEvents();
  removeLoader();
};

const initPostsManager = () => {
  createLoader(document.body);
  blogPostReq()
    .makeGetAllBlogPosts()
    .then(response => response.json())
    .then(posts => renderPostsManager(posts));
};

export default initPostsManager;
