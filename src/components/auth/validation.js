export const renderError = (message, id) => {
  const paragraph = document.createElement('p');
  paragraph.classList.add('error', `error_${id}`);
  const container = document.querySelector(`#${id}`).parentNode;
  paragraph.innerHTML = message;
  container.appendChild(paragraph);
};

export const removeError = id => {
  const paragraph = document.querySelector(`.error_${id}`);
  if (paragraph) paragraph.remove();
};

export const validateEmail = email => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const validate = (value, type, id) => {
  if (type === 'text' && value === '') {
    removeError(id);
    renderError('This field is required', id);
  } else if (type === 'password' && value.length < 6) {
    removeError(id);
    renderError('Password is too short', id);
  } else if (type === 'email' && (value === '' || !validateEmail(value))) {
    removeError(id);
    renderError('Please enter a valid email address', id);
  } else {
    removeError(id);
  }
};

export const isValid = (value, type) => {
  return !(
    (type === 'text' && value === '') ||
    (type === 'password' && value.length < 6) ||
    (type === 'email' && (value === '' || !validateEmail(value)))
  );
};
