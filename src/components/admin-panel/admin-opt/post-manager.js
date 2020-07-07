import posts from '../jsons/posts.json';
import * as mf from './manager-functions';

const getPostsList = async () => {
  return new Promise((resolve, reject) => {
    resolve(posts);
    reject(new Error(`spartoliło się`));
  });
};

const renderPostsManager = postsList => {
  mf.renderLegend('post', posts, 'posts');
  mf.renderTable(postsList.posts, 'post');
};

const initPostsManager = () => {
  getPostsList().then(p => renderPostsManager(p));
};

export default initPostsManager;
