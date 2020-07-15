import users from '../jsons/users.json';
import * as mf from './manager-functions';
import {generateToken} from '../../auth/fetch';

const getUsersList = async () => {
  return new Promise((resolve, reject) => {
    resolve(users);
    reject(new Error(`spartoliło się`));
  });
};

const displayToken = async () => {
  const token = await generateToken().then(r => r.json());
  const container = document.querySelector('.admin__container');
  const btns = document.querySelector('.editor__buttons');
  const paragraph = document.createElement('p');
  paragraph.classList.add('token__display');
  paragraph.innerHTML = `
  token required to register a new author: ${token.token}`;
  container.insertBefore(paragraph, btns);
};

const renderTokenButton = mngType => {
  const template = mf.getTemplate(mngType);
  const container = document.querySelector('.admin__container');
  const btns = template.querySelector('.editor__buttons');
  template.querySelector('.editor__button').addEventListener('click', () => displayToken());
  container.appendChild(btns);
};

const addBtnEvents = () => {
  Array.from(document.querySelectorAll('.user__btn')).forEach(btn =>
    btn.addEventListener('click', () => {
      console.log(btn.getAttribute('user-id'));
    })
  );
};

const addSortEvent = () => {
  Array.from(document.querySelectorAll('p[sort]')).forEach(p =>
    p.addEventListener('click', () => addBtnEvents())
  );
};

const renderUsersManager = usersList => {
  mf.renderLegend('user', users, 'users');
  mf.renderTable(usersList.users, 'user');
  renderTokenButton('user');
  addBtnEvents();
  addSortEvent();
};

const initUsersManager = () => {
  getUsersList().then(p => renderUsersManager(p));
};

export default initUsersManager;
