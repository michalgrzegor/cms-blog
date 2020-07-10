import {usersReq} from '../../auth/fetch';
import {createLoader, removeLoader} from '../../UI/loader';

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
  document.querySelector('.input__name').value = document.querySelector(
    '.account__name span'
  ).innerText;
  document.querySelector('.input__email').value = document.querySelector(
    '.account__email span'
  ).innerText;
  document.querySelector('.input__about').value = document.querySelector(
    '.account__about span'
  ).innerText;
};

const saveAccount = () => {
  let base64Img = null;
  let about = null;
  if (document.querySelector('.account__edit img').src.slice(0, 4) === 'data')
    base64Img = document.querySelector('.account__edit img').src;
  if (document.querySelector('.input__about').value !== 'write a few sentences about yourself')
    about = document.querySelector('.input__about').value;
  createLoader(document.body);
  usersReq()
    .makeUpdateUser({
      username: document.querySelector('.input__name').value,
      about: about,
      avatar: {
        data: base64Img,
      },
    })
    .then(r => r.json())
    .then(r => renderMyAccount(r))
    .catch(err => {
      removeLoader();
      console.log(err);
    });
};

const resizeAndCropImg = () => {
  const reader = new FileReader();
  reader.addEventListener('load', () => {
    const image = new Image();
    image.src = reader.result;
    image.onload = () => {
      const inputWidth = image.naturalWidth;
      const inputHeight = image.naturalHeight;
      const imageAspectRatio = inputWidth / inputHeight;
      let outputWidth = inputWidth;
      let outputHeight = inputHeight;
      if (imageAspectRatio > 1) {
        outputWidth = inputHeight;
      } else if (imageAspectRatio < 1) {
        outputHeight = inputWidth;
      }
      const outputX = (inputWidth - outputWidth) * 0.5;
      const outputY = (inputHeight - outputHeight) * 0.5;
      const outputImage = document.createElement('canvas');
      outputImage.width = 128;
      outputImage.height = 128;
      const ctx = outputImage.getContext('2d');
      ctx.drawImage(image, outputX, outputY, outputWidth, outputHeight, 0, 0, 128, 128);
      console.log(outputImage.toDataURL());
      document.querySelector('.account__edit img').src = outputImage.toDataURL();
      document.querySelector('.account__data img').src = outputImage.toDataURL();
    };
  });
  reader.readAsDataURL(document.querySelector('.input__avatar').files[0]);
};

const addEvents = template => {
  template.querySelector('.btn-edit').addEventListener('click', () => editAccount());
  template.querySelector('.btn-save').addEventListener('click', () => saveAccount());
  template.querySelector('.input__avatar').addEventListener('change', () => resizeAndCropImg());
  template
    .querySelector('.btn-file')
    .addEventListener('click', () => document.querySelector('.input__avatar').click());
};

const renderMyAccount = json => {
  console.log(json);
  const container = document.querySelector('.admin__container');
  container.innerText = '';
  const template = getTemplate();
  template.querySelector('.account__name span').innerText = json.username;
  template.querySelector('.account__email span').innerText = json.email;
  template.querySelector('.account__about span').innerText =
    json.about || 'write a few sentences about yourself';
  template.querySelector('.account__edit img').src =
    json.avatar_url || `https://api.adorable.io/avatars/128/${json.email}`;
  template.querySelector('.account__data img').src =
    json.avatar_url || `https://api.adorable.io/avatars/128/${json.email}`;
  addEvents(template);
  container.appendChild(template);
  removeLoader();
};

const initMyAccount = () => {
  createLoader(document.body);
  usersReq()
    .makeGetUser()
    .then(r => r.json())
    .then(r => renderMyAccount(r));
};

export default initMyAccount;
