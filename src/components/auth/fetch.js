import {createLoader, removeLoader} from '../shared-ui/loader';
import {renderError} from './validation';
import TokenHandler from './token';
import {login} from './pkce';

const URL = 'https://fierce-anchorage-12434.herokuapp.com/';

export const TOKEN_HANDLER = new TokenHandler(null);

const checkError = response => {
  if (response.status >= 200 && response.status <= 299) {
    return response.json();
  }
  throw Error(`moj error: ${response.statusText}`);
};

const makeRequest = async (request, data) => {
  if (TOKEN_HANDLER.getIsToken() && !TOKEN_HANDLER.getIsExpired()) {
    return request(data);
  }
  if (TOKEN_HANDLER.getIsRefresh()) {
    return TOKEN_HANDLER.refreshToken().then(() => request(data));
  }
  return login();
};

export const signup = () => {
  const formData = {
    email: document.querySelector('#user_email_signup').value,
    password: document.querySelector('#user_password_signup').value,
    username: document.querySelector('#user_name_signup').value,
    token: document.querySelector('#user_token_signup').value,
  };
  createLoader(document.body);
  fetch(`${URL}registrations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then(response => response.json())
    .then(data => {
      if (data.details === 'Registration token needed.')
        renderError('wrong token', 'user_token_signup');
      if (data.message === 'Registration was successful.') login();
    })
    .then(() => removeLoader());
};

export const reset = () => {
  const formData = {
    email: document.querySelector('#user_email_reset').value,
  };
  fetch(`${URL}reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  }).then(response => response.json());
};

const getToken = async () => {
  return fetch(`${URL}registration_tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
  });
};

export const generateToken = async () => makeRequest(getToken, null);

// make, edit, delete, get blog post request

const postBlogPost = ({postData}) => {
  return fetch(`${URL}quill_blog_posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
    body: JSON.stringify(postData),
  });
};

const getBlogPost = ({postId}) => {
  return fetch(`${URL}quill_blog_posts/${postId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
  });
};

const deleteBlogPost = ({postId}) => {
  return fetch(`${URL}quill_blog_posts/${postId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
  });
};

const getAllBlogPosts = () => {
  return fetch(`${URL}quill_blog_posts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
  });
};

const updateBlogPost = ({postId, postData}) => {
  return fetch(`${URL}quill_blog_posts/${postId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
    body: JSON.stringify(postData),
  });
};

export const blogPostReq = () => {
  return {
    postBlogPost: function (postData) {
      return makeRequest(postBlogPost, {
        postData: postData,
      });
    },
    getBlogPost: function (postId) {
      return makeRequest(getBlogPost, {
        postId: postId,
      });
    },
    deleteBlogPost: function (postId) {
      return makeRequest(deleteBlogPost, {
        postId: postId,
      });
    },
    getAllBlogPosts: function () {
      return makeRequest(getAllBlogPosts, null);
    },
    updateBlogPost: function (postId, postData) {
      return makeRequest(updateBlogPost, {
        postId: postId,
        postData: postData,
      });
    },
  };
};

// get, update information about users

const getUsers = () => {
  return fetch(`${URL}user_profiles`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getUser = () => {
  return fetch(`${URL}user_profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
  });
};

const updateUser = ({userData}) => {
  return fetch(`${URL}user_profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
    body: JSON.stringify(userData),
  });
};

const changeEmailPassword = ({newEmailPassword}) => {
  return fetch(`${URL}registration`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
    body: JSON.stringify(newEmailPassword),
  });
};

export const usersReq = () => {
  return {
    getUsers: function () {
      return getUsers();
    },
    getUser: function () {
      return makeRequest(getUser, null);
    },
    updateUser: function (userData) {
      return makeRequest(updateUser, {
        userData: userData,
      });
    },
    changeEmailPassword: function (newEmailPassword) {
      return makeRequest(changeEmailPassword, {
        newEmailPassword: newEmailPassword,
      });
    },
  };
};

// get blog posts main page / pagination

const getBlogPostsMainPage = () => {
  return fetch(`${URL}blog_posts`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getBlogPostMainPage = ({id}) => {
  return fetch(`${URL}blog_posts/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const getBlogPostsMainPageByNumber = ({pageNumb}) => {
  return fetch(`${URL}blog_posts?page=${pageNumb}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const blogPostsMainPageReq = () => {
  return {
    getBlogPostsMainPage: function () {
      return getBlogPostsMainPage();
    },
    getBlogPostMainPage: function (id) {
      return getBlogPostMainPage({
        id: id,
      });
    },
    getBlogPostsMainPageByNumber: function (pageNumb) {
      return getBlogPostsMainPageByNumber({
        pageNumb: pageNumb,
      });
    },
  };
};

// search blog posts

const searchBlogPosts = ({searchData}) => {
  return fetch(`${URL}blog_post_searches`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchData),
  });
};

export const searchBlogPostsReq = () => {
  return {
    searchBlogPosts: function (searchData) {
      return searchBlogPosts({
        searchData: searchData,
      });
    },
  };
};
