import * as validation from './validation';
import sendForm from './send-form';
import {login} from './pkce';

const switchAction = event => {
  if (event.target.type === 'button') renderForm(event.target.getAttribute('switchTo'));
};

const switchForm = () => {
  const switchContainer = document.querySelector('.form__switchbtn');
  switchContainer.addEventListener('click', e => switchAction(e));
};

const renderForm = formName => {
  if (formName === 'form__login') {
    console.log(formName);
    login();
  } else {
    const container = document.querySelector('.auth__form');
    container.innerHTML = '';
    const template = document.querySelector(`#${formName}`).content.cloneNode(true);
    const inputs = template.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        validation.validate(input.value, input.type, input.id);
      });
      input.addEventListener('focus', () => {
        console.log(`focus`);
        validation.removeError(input.id);
      });
    });
    container.appendChild(template);
    sendForm();
    switchForm();
  }
};

export default renderForm;
