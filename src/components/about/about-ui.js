import {usersReq} from '../auth/fetch';
import imageLoader from '../shared-ui/image-loader';
import {createLoader, removeLoader} from '../shared-ui/loader';

const getTemplate = () => {
  const temp = document.querySelector('#card__template');
  return temp.content.cloneNode(true);
};

const renderCard = author => {
  const container = document.querySelector('.about__container');
  const template = getTemplate();
  template.querySelector('.author__name').textContent = author.username;
  template.querySelector('.author__email').textContent = author.email;
  template.querySelector('.about__bio').textContent = author.about;
  imageLoader(
    author.avatar_url || `https://api.adorable.io/avatars/128/${author.email}`,
    template.querySelector('.about__author')
  );
  container.appendChild(template);
};

const renderCards = response => {
  response.forEach(author => renderCard(author));
};

const initAbout = () => {
  createLoader(document.body);
  usersReq()
    .makeGetUsers()
    .then(r => r.json())
    .then(r => renderCards(r))
    .then(() => removeLoader());
};

export default initAbout;
