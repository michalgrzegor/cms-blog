import {usersReq} from '../../auth/fetch';
import {createLoader, removeLoader} from '../../shared-ui/loader';
import {logout} from '../../auth/pkce';
import imageLoader from '../../shared-ui/image-loader';
import showSnackBar from '../../shared-ui/snackbar';
import * as validation from '../../auth/validation';

const checkError = response => {
  if (response.status >= 200 && response.status <= 299) {
    return response;
  }
  throw Error(`moj error: ${response.statusText}`);
};

const getTemplate = () => {
  const template = document.querySelector(`#account__template`);
  const templateClone = template.content.cloneNode(true);
  return templateClone;
};

const toggleProfileElements = () => {
  document.querySelector('.account__data').classList.toggle('hide');
  document.querySelector('.btn-edit').classList.toggle('hide');
  document.querySelector('.account__edit').classList.toggle('hide');
  document.querySelector('.btn-save').classList.toggle('hide');
  document.querySelector('.btn-change').classList.toggle('hide');
  document.querySelector('.btn-cancel').classList.toggle('hide');
  document.querySelector('.btn-logout').classList.toggle('hide');
};

const editAccount = () => {
  toggleProfileElements();
  document.querySelector('.input__name').value = document.querySelector(
    '.account__name span'
  ).textContent;
  document.querySelector('.input__about').value = document.querySelector(
    '.account__about span'
  ).textContent;
};

const toggleChangeEmailPasswordElements = () => {
  document.querySelector('.account__data').classList.toggle('hide');
  document.querySelector('.btn-edit').classList.toggle('hide');
  document.querySelector('.account__change').classList.toggle('hide');
  document.querySelector('.btn-save-change').classList.toggle('hide');
  document.querySelector('.btn-change').classList.toggle('hide');
  document.querySelector('.btn-cancel-change').classList.toggle('hide');
  document.querySelector('.btn-logout').classList.toggle('hide');
};

const changeEmailPassword = () => {
  toggleChangeEmailPasswordElements();
  document.querySelector('.input__email').value = document.querySelector(
    '.account__email span'
  ).textContent;
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
    .updateUser({
      username: document.querySelector('.input__name').value,
      about: about,
      avatar: {
        data: base64Img,
      },
    })
    .then(r => r.json())
    .then(r => renderMyAccount(r))
    .catch(err => {
      showSnackBar('something went wrong, try again');
      removeLoader();
    });
};

const saveEmailPassCanges = () => {
  const newPass = document.querySelector('#input__newpass');
  const inputArray = [
    document.querySelector('#input__email'),
    document.querySelector('#input__oldpass'),
  ];
  let isFormValid = true;
  inputArray.forEach(input => {
    if (!validation.isValid(input.value, input.type)) isFormValid = false;
  });
  if (newPass.value.length > 0) {
    if (!validation.isValid(newPass.value, newPass.type)) isFormValid = false;
  }
  if (isFormValid) {
    createLoader(document.body);
    usersReq()
      .changeEmailPassword({
        email: document.querySelector('.input__email').value,
        password: document.querySelector('.input__newpass').value,
        old_password: document.querySelector('.input__oldpass').value,
      })
      .then(r => {
        removeLoader();
        if (r.status === 200) r.json().then(re => renderMyAccount(re));
        if (r.status !== 200) r.json().then(re => showSnackBar(re.details));
      });
  } else {
    inputArray.forEach(input => validation.validate(input.value, input.type, input.id));
    if (newPass.value.length > 0) validation.validate(newPass.value, newPass.type, newPass.id);
  }
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
      document.querySelector('.account__edit img').src = outputImage.toDataURL();
      document.querySelector('.account__data img').src = outputImage.toDataURL();
    };
  });
  reader.readAsDataURL(document.querySelector('.input__avatar').files[0]);
};

const addEvents = template => {
  template.querySelector('.btn-edit').addEventListener('click', () => editAccount());
  template.querySelector('.btn-change').addEventListener('click', () => changeEmailPassword());
  template.querySelector('.btn-save').addEventListener('click', () => saveAccount());
  template.querySelector('.btn-save-change').addEventListener('click', () => saveEmailPassCanges());
  template.querySelector('.input__avatar').addEventListener('change', () => resizeAndCropImg());
  template
    .querySelector('.btn-file')
    .addEventListener('click', () => document.querySelector('.input__avatar').click());
  [template.querySelector('#input__email'), template.querySelector('#input__oldpass')].forEach(
    input => {
      input.addEventListener('blur', () => {
        validation.validate(input.value, input.type, input.id);
      });
    }
  );
  template.querySelector('#input__newpass').addEventListener('blur', function () {
    if (this.value.length > 0) validation.validate(this.value, this.type, this.id);
  });
  template.querySelector('.btn-cancel').addEventListener('click', () => toggleProfileElements());
  template
    .querySelector('.btn-cancel-change')
    .addEventListener('click', () => toggleChangeEmailPasswordElements());
  template.querySelector('.btn-logout').addEventListener('click', () => logout());
};

const renderMyAccount = json => {
  const container = document.querySelector('.admin__container');
  container.textContent = '';
  const template = getTemplate();
  template.querySelector('.account__name span').textContent = json.username;
  template.querySelector('.account__email span').textContent = json.email;
  template.querySelector('.account__about span').textContent =
    json.about || 'write a few sentences about yourself';
  addEvents(template);
  imageLoader(
    json.avatar_url || `https://api.adorable.io/avatars/128/${json.email}`,
    template.querySelector('.account__edit')
  );
  imageLoader(
    json.avatar_url || `https://api.adorable.io/avatars/128/${json.email}`,
    template.querySelector('.account__data')
  );
  container.appendChild(template);
  removeLoader();
};

const initMyAccount = () => {
  createLoader(document.body);
  usersReq()
    .getUser()
    .then(checkError)
    .then(r => r.json())
    .then(r => renderMyAccount(r))
    .catch(err => {
      showSnackBar('something went wrong, try again');
      removeLoader();
    });
};

export default initMyAccount;
