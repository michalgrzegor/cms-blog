import {TOKEN_HANDLER} from './fetch';
import showSnackBar from '../UI/snackbar';

const URL = 'https://fierce-anchorage-12434.herokuapp.com/';

const CONFIG = {
  client_id: 'fecp3e5pAkjOarXF5nsWAoPe1_qr-s2E81chKuSGP0o',
  redirect_uri: 'http://localhost:8080/admin-panel.html',
  authorization_endpoint: 'oauth/authorize',
  token_endpoint: 'oauth/token',
  requested_scopes: 'openid',
  client_secret: 'V0URuNE4mYtY8LqdJ5NN7siTngfEpEs_bvLlXbcZrdk',
};

const generateRandomString = () => {
  const array = new Uint32Array(28);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => `0${dec.toString(16)}`.substr(-2)).join('');
};

const sha256 = plain => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64urlencode = str => {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

const pkceChallengeFromVerifier = async v => {
  const hashed = await sha256(v);
  return base64urlencode(hashed);
};

export const login = async () => {
  // Create and store a random "state" value
  const state = generateRandomString();
  localStorage.setItem('pkce_state', state);

  // Create and store a new PKCE code_verifier (the plaintext random secret)
  const codeVerifier = generateRandomString();
  localStorage.setItem('pkce_code_verifier', codeVerifier);

  // Hash and base64-urlencode the secret to use as the challenge
  const codeChallenge = await pkceChallengeFromVerifier(codeVerifier);

  // Build the authorization URL
  const url = `${URL}${
    CONFIG.authorization_endpoint
  }?response_type=code&client_id=${encodeURIComponent(CONFIG.client_id)}&state=${encodeURIComponent(
    state
  )}&redirect_uri=${encodeURIComponent(CONFIG.redirect_uri)}&code_challenge=${encodeURIComponent(
    codeChallenge
  )}&code_challenge_method=S256`;

  // Redirect to the authorization server
  window.location.href = url;
};

const parseQueryString = string => {
  if (string === '') {
    return {};
  }
  const segments = string.split('&').map(s => s.split('='));
  console.log(segments);
  let queryString = {};
  segments.forEach(s => {
    queryString = {
      ...queryString,
      ...{
        [s[0]]: s[1],
      },
    };
  });
  return queryString;
};

export const errorHandling = (response, message = null) => {
  const text = !message ? response.body : message;
  if (!response.ok) showSnackBar(text);
  return response;
};

const handleToken = body => {
  body.then(res => {
    console.log(res);
    TOKEN_HANDLER.setTokens(res);
  });
  window.history.replaceState({}, null, '/admin-panel.html');
};

// Make a POST request and parse the response as JSON
const sendPostRequestForAccesToken = async query => {
  console.log(`wysyła po tokena`);
  const params = {
    grant_type: 'authorization_code',
    code: query.code,
    client_id: CONFIG.client_id,
    redirect_uri: CONFIG.redirect_uri,
    code_verifier: localStorage.getItem('pkce_code_verifier'),
    client_secret: CONFIG.client_secret,
  };
  fetch(`${URL}${CONFIG.token_endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
    .then(r => errorHandling(r, 'something went wrong, try again'))
    .then(response => {
      const res = response.json();
      console.log(res);
      if (response.status === 200) handleToken(res);
    })
    .catch(error => errorHandling(error, 'something went wrong, try again'));
};

const handleSuccess = query => {
  if (localStorage.getItem('pkce_state') !== query.state) {
    showSnackBar('Invalid state');
  } else {
    sendPostRequestForAccesToken(query);
  }
  localStorage.removeItem('pkce_state');
  localStorage.removeItem('pkce_code_verifier');
};

export const handleRedirect = () =>
  new Promise((resolve, reject) => {
    const query = parseQueryString(window.location.search.substring(1));
    if (query.code) {
      resolve(handleSuccess(query));
    }
    if (!window.location.search.substring(1)) resolve();
    if (query.error) reject(showSnackBar(query.error));
  });

// Refresh Token

export const makeRefreshTokenPost = async () => {
  const params = {
    grant_type: 'refresh_token',
    client_id: CONFIG.client_id,
    redirect_uri: CONFIG.redirect_uri,
    client_secret: CONFIG.client_secret,
    refresh_token: localStorage.getItem('refresh_token'),
  };
  console.log(params);
  return fetch(`${URL}${CONFIG.token_endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
};

const handleLogout = response => {
  if (response.status === 200) {
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('refresh_token_created_at');
    localStorage.removeItem('refresh_token_expired_time');
    window.location.href = 'http://localhost:8080/index.html';
  }
  return response;
};

export const logout = async () => {
  fetch(
    `${URL}oauth/revoke?client_id=${CONFIG.client_id}&client_secret=${
      CONFIG.client_secret
    }&token=${TOKEN_HANDLER.getToken()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  )
    .then(r => errorHandling(r, 'something went wrong, try again'))
    .then(response => handleLogout(response))
    .then(response => console.log(response))
    .catch(error => errorHandling(error, 'something went wrong, try again'));
};
