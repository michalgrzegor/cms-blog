import ManagerFunctions from './manager-functions';
import {blogPostReq} from '../../auth/fetch';
import {createLoader, removeLoader} from '../../UI/loader';
import showSnackBar from '../../UI/snackbar';

const mf = new ManagerFunctions();

const renderPostsManager = postsList => {
  if (postsList.length > 0) {
    mf.renderLegend('post', postsList, 'posts');
    mf.renderTable();
  }
  removeLoader();
};

const initPostsManager = () => {
  createLoader(document.body);
  blogPostReq()
    .makeGetAllBlogPosts()
    .then(response => response.json())
    .then(posts => renderPostsManager(posts))
    .catch(err => {
      showSnackBar('something went wrong, try again');
      removeLoader();
    });
};

export default initPostsManager;
