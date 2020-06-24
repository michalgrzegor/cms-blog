import {createLoader, removeLoader} from '../UI/loader';
import TokenHandler from './token';
import {login} from './pkce';

const URL = 'https://fierce-anchorage-12434.herokuapp.com/';

export const TOKEN_HANDLER = new TokenHandler(null);

const makeRequest = async request => {
  console.log(request);
  if (TOKEN_HANDLER.getIsToken() && !TOKEN_HANDLER.getIsExpired()) {
    request();
  } else if (TOKEN_HANDLER.getIsRefresh()) {
    TOKEN_HANDLER.refreshToken()
      .then(res => console.log(res))
      .then(() => request());
  } else {
    login();
  }
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

const getToken = () => {
  console.log(TOKEN_HANDLER.getToken());
  fetch(`${URL}registration_tokens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN_HANDLER.getToken()}`,
    },
  })
    .then(response => response.json())
    .then(data => console.log(data));
};

export const generateToken = () => {
  makeRequest(getToken);
};
