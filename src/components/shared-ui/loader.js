export const createLoader = parrent => {
  const loader = document.createElement('div');
  loader.id = 'loader';
  parrent.appendChild(loader);
};

export const removeLoader = () => {
  const loader = document.querySelector('#loader');
  loader.remove();
};