import '../../style/components_style/auth.scss';
import renderForm from './auth-view';
import {generateToken} from './fetch';

renderForm('form__signup');

// tokenButton will be moved to admin panel
const tokenButton = () => {
  const button = document.querySelector('.token');
  button.addEventListener('click', () => generateToken());
};
tokenButton();
