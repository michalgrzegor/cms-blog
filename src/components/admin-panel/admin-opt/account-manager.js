import userJson from '../jsons/account.json';

const getTemplate = () => {
  const template = document.querySelector(`#account__template`);
  const templateClone = template.content.cloneNode(true);
  return templateClone;
};

const toggleElements = () => {
  document.querySelector('.account__data').classList.toggle('hide');
  document.querySelector('.btn-edit').classList.toggle('hide');
  document.querySelector('.account__edit').classList.toggle('hide');
  document.querySelector('.btn-save').classList.toggle('hide');
};

const editAccount = () => {
  toggleElements();
  document.querySelector('.input__name').value = document.querySelector('.account__name').innerText;
  document.querySelector('.input__email').value = document.querySelector(
    '.account__email'
  ).innerText;
};

const saveAccount = () => {
  toggleElements();
  document.querySelector('.account__name').innerText = document.querySelector('.input__name').value;
  document.querySelector('.account__email').innerText = document.querySelector(
    '.input__email'
  ).value;
};

const addEvents = template => {
  template.querySelector('.btn-edit').addEventListener('click', () => editAccount());
  template.querySelector('.btn-save').addEventListener('click', () => saveAccount());
};

const renderMyAccount = json => {
  const container = document.querySelector('.admin__container');
  const template = getTemplate();
  template.querySelector('.account__name').innerText = `name: ${json.name}`;
  template.querySelector('.account__email').innerText = `email: ${json.email}`;
  addEvents(template);
  container.appendChild(template);
};

const initMyAccount = () => {
  renderMyAccount(userJson);
};

export default initMyAccount;
