import {createLoader, removeLoader} from './loader';
import {blogPostsMainPageReq} from '../auth/fetch';
import imageLoader from './image-loader';

export default class PostsMiniatures {
  constructor() {
    this.postMiniaturesArray = [];
    this.paginationNumber = undefined;
    this.pageNumber = 1;
  }

  getPostTemplate() {
    const template = document.querySelector('#miniature__template');
    return template.content.cloneNode(true);
  }

  generateMiniature(postMin) {
    const postTemplate = this.getPostTemplate();
    postTemplate.querySelector('.miniature__title').textContent = postMin.title;
    postTemplate.querySelector('.author__name').textContent = postMin.author;
    postTemplate.querySelector('.post__date').textContent = postMin.date;
    postTemplate.querySelector('.miniature__opening').textContent = postMin.introduction;
    postTemplate.querySelector('.post__comments').textContent = postMin.comments;
    postTemplate.querySelector('.miniature').setAttribute('postId', postMin.id);
    imageLoader(
      postMin.author_avatar_url || `https://api.adorable.io/avatars/40/${postMin.email}.png`,
      postTemplate.querySelector('.miniature__author')
    );
    imageLoader('https://picsum.photos/900', postTemplate.querySelector('.miniature__img'));
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
    console.log(postMins);
    const ite = Math.ceil(postMins.blog_posts.length / 10);
    for (let i = 0; i < ite; i += 1) {
      const ar = postMins.blog_posts.slice(i * 10, i * 10 + 10);
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
      this.pageNumber = Number(target.innerText);
      if (
        this.pageNumber === this.paginationNumber * 2 ||
        this.pageNumber === this.paginationNumber * 2 - 1
      ) {
        this.renderPostsMin(this.postMiniaturesArray[Number(target.innerText) - 1]);
      } else {
        document.querySelector('.miniature__pages').remove();
        this.initPostsMiniatures(Math.ceil(this.pageNumber / 2));
      }
    }
  }

  generatePages(number) {
    const container = document.querySelector('.container');
    const pagesContainer = document.createElement('div');
    pagesContainer.classList.add('miniature__pages');
    const arrayOfPages = [...Array(Math.ceil(number / 10)).keys()];
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

  async initPostsMiniatures(number) {
    createLoader(document.body);
    this.paginationNumber = number;
    const postMins = await blogPostsMainPageReq()
      .makeGetBlogPostsMainPageByNumber(number)
      .then(r => r.json())
      .catch(err => {
        console.log(err);
        removeLoader();
      });
    this.postMiniaturesArray = this.generateArrays(postMins);
    this.renderPostsMin(this.postMiniaturesArray[0]);
    this.generatePages(postMins.blog_posts_count);
    this.searchPosts();
    removeLoader();
  }
}
