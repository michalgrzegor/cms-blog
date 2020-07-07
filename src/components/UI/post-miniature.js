import posts from './jsons/posts.json';
import {createLoader, removeLoader} from './loader';

export default class PostsMiniatures {
  constructor() {
    this.postMiniaturesArray = [];
  }

  async getPostMiniaturesList() {
    return new Promise((resolve, reject) => {
      resolve(posts);
      reject(new Error(`spartoliło się`));
    });
  }

  getPostTemplate() {
    const template = document.querySelector('#miniature__template');
    return template.content.cloneNode(true);
  }

  generateMiniature(postMin) {
    const postTemplate = this.getPostTemplate();
    const title = postTemplate.querySelector('.miniature__title');
    title.textContent = postMin.title;
    const author = postTemplate.querySelector('.author__name');
    author.textContent = postMin.author;
    const date = postTemplate.querySelector('.post__date');
    date.textContent = postMin.date;
    const intro = postTemplate.querySelector('.miniature__opening');
    intro.textContent = postMin.intro;
    const comments = postTemplate.querySelector('.post__comments');
    comments.textContent = postMin.comments;
    postTemplate.querySelector('.miniature').setAttribute('postId', postMin.id);
    return postTemplate;
  }

  renderPostsMin(postsMins) {
    const container = document.querySelector('.container');
    container.querySelectorAll('a').forEach(a => a.remove());
    postsMins.forEach(postMin =>
      container.insertBefore(
        this.generateMiniature(postMin),
        container.querySelector('.miniature__pages')
      )
    );
  }

  generateArrays(postMins) {
    const postMiniaturesArray = [];
    const ite = Math.ceil(postMins.posts.length / 10);
    for (let i = 0; i < ite; i += 1) {
      const ar = postMins.posts.slice(i * 10, i * 10 + 10);
      postMiniaturesArray.push(ar);
    }
    return postMiniaturesArray;
  }

  cratePage(number) {
    const paragraph = document.createElement('p');
    paragraph.classList.add('miniature__page');
    paragraph.textContent = number + 1;
    return paragraph;
  }

  changePage(target) {
    if (target.classList.contains('miniature__page')) {
      document
        .querySelectorAll('.miniature__page')
        .forEach(p => p.classList.remove('font--weight-bold'));
      target.classList.add('font--weight-bold');
      this.renderPostsMin(this.postMiniaturesArray[Number(target.innerText) - 1]);
    }
  }

  generatePages() {
    const container = document.querySelector('.container');
    const pagesContainer = document.createElement('div');
    pagesContainer.classList.add('miniature__pages');
    const arrayOfPages = this.postMiniaturesArray.map(a => this.postMiniaturesArray.indexOf(a));
    arrayOfPages.forEach(page => pagesContainer.appendChild(this.cratePage(page)));
    pagesContainer.addEventListener('click', e => this.changePage(e.target));
    pagesContainer.querySelectorAll('p')[0].classList.add('font--weight-bold');
    container.appendChild(pagesContainer);
  }

  getSearchRequest(query) {
    document.querySelector('.container').innerHTML = '';
    createLoader(document.querySelector('.container'));
    console.log(query);
  }

  searchPosts() {
    const input = document.querySelector('.blog__search input');
    let timer = null;
    input.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = setTimeout(() => {
        this.getSearchRequest(input.value);
      }, 1000);
    });
  }

  async initPostsMiniatures() {
    const postMins = await posts;
    this.postMiniaturesArray = this.generateArrays(postMins);
    this.renderPostsMin(this.postMiniaturesArray[0]);
    this.generatePages();
    this.searchPosts();
  }
}
