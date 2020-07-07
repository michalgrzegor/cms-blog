import authors from './about.json';

const getAuthorsList = async () => {
  return new Promise((resolve, reject) => {
    resolve(authors);
    reject(new Error(`spartoliło się`));
  });
};

const getTemplate = () => {
  const temp = document.querySelector('#card__template');
  return temp.content.cloneNode(true);
};

const renderCard = author => {
  const container = document.querySelector('.about__container');
  const template = getTemplate();
  template.querySelector('.author__name').textContent = author.name;
  template.querySelector('.author__email').textContent = author.email;
  template.querySelector('.about__bio').textContent = author.about;
  container.appendChild(template);
};

const renderCards = response => {
  response.authors.forEach(author => renderCard(author));
};

const initAbout = () => {
  getAuthorsList().then(r => renderCards(r));
};

export default initAbout;
