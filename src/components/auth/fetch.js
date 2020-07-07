import {createLoader, removeLoader} from '../UI/loader';
import TokenHandler from './token';
import {login} from './pkce';

const URL = 'https://fierce-anchorage-12434.herokuapp.com/';

export const TOKEN_HANDLER = new TokenHandler(null);

const makeRequest = async (request, data) => {
  console.log(request);
  if (TOKEN_HANDLER.getIsToken() && !TOKEN_HANDLER.getIsExpired()) {
    return request(data);
  }
  if (TOKEN_HANDLER.getIsRefresh()) {
    return TOKEN_HANDLER.refreshToken()
      .then(res => console.log(res))
      .then(() => request(data));
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
    .then(data => console.log(data))
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
  })
    .then(response => response.json())
    .then(data => console.log(data));
};

const getToken = async () => {
  console.log(TOKEN_HANDLER.getToken());
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
  console.log(postData);
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
  return fetch(`${URL}quill_blog_posts/:${postId}`, {
    method: 'GET',
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
  return fetch(`${URL}quill_blog_posts/:${postId}`, {
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
    makePostBlogPost: function (postData) {
      return makeRequest(postBlogPost, {postData: postData});
    },
    makeGetBlogPost: function (postId) {
      return makeRequest(getBlogPost, {postId: postId});
    },
    makeGetAllBlogPosts: function () {
      return makeRequest(getAllBlogPosts, null);
    },
    makeUpdateBlogPost: function (postId, postData) {
      return makeRequest(updateBlogPost, {postId: postId, postData: postData});
    },
  };
};
