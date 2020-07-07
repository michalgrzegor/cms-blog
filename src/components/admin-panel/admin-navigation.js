import initPostsManager from './admin-opt/post-manager';
import initUsersManager from './admin-opt/users-manager';
import initMyAccount from './admin-opt/account-manager';
import initEditor from './admin-opt/quill-options';

const changeActiveClass = (nodesArray, number) => {
  nodesArray.forEach(node => node.classList.remove('bg--color-active'));
  nodesArray[number].classList.add('bg--color-active');
};

const removeCategories = () => {
  document.querySelector('.admin__container').innerHTML = '';
};

const changeCategories = () => {
  const categories = Array.from(document.querySelectorAll('.admin__categories h3'));
  categories.forEach(cat => {
    cat.addEventListener('click', () => {
      const numb = categories.indexOf(cat);
      changeActiveClass(categories, numb);
      removeCategories();
      if (numb === 0) initEditor();
      if (numb === 1) initPostsManager();
      if (numb === 2) initUsersManager();
      if (numb === 3) initMyAccount();
    });
  });
};

const initAdminNav = () => {
  changeCategories();
};

export default initAdminNav;
