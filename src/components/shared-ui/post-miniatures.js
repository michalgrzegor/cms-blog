import {createLoader, removeLoader} from './loader';
import {blogPostsMainPageReq, searchBlogPostsReq} from '../auth/fetch';
import imageLoader from './image-loader';
import showSnackBar from './snackbar';

export default class PostsMiniatures {
  constructor() {
    this.postMiniaturesArray = [];
    this.paginationNumber = undefined;
    this.pageNumber = 1;
    this.isSearchMode = false;
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
    postTemplate.querySelector('.miniature').href = `./blog-post?id=${postMin.id}`;
    imageLoader(
      postMin.author_avatar_url || `https://api.adorable.io/avatars/40/${postMin.email}.png`,
      postTemplate.querySelector('.miniature__author')
    );
    imageLoader(
      postMin.main_image_url || 'https://picsum.photos/900',
      postTemplate.querySelector('.miniature__img')
    );
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
    Array.from(document.querySelectorAll('.miniature__page'))[this.pageNumber - 1].classList.add(
      'font--weight-bold'
    );
  }

  generateArrays(postMins) {
    const postMiniaturesArray = [];
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
      this.pageNumber = Number(target.textContent);
      if (
        this.pageNumber === this.paginationNumber * 2 ||
        this.pageNumber === this.paginationNumber * 2 - 1
      ) {
        this.renderPostsMin(this.postMiniaturesArray[Number(target.textContent) - 1]);
      } else {
        document.querySelector('.miniature__pages').remove();
        if (!this.isSearchMode) this.initPostsMiniatures(Math.ceil(this.pageNumber / 2));
        if (this.isSearchMode)
          this.getSearchRequest(this.query, Math.ceil(this.pageNumber / 2), this.pageNumber);
      }
    }
  }

  generatePages(number) {
    if (document.querySelector('.miniature__pages'))
      document.querySelector('.miniature__pages').remove();
    const container = document.querySelector('.container');
    const pagesContainer = document.createElement('div');
    pagesContainer.classList.add('miniature__pages');
    const arrayOfPages = [...Array(Math.ceil(number / 10)).keys()];
    arrayOfPages.forEach(page => pagesContainer.appendChild(this.cratePage(page)));
    pagesContainer.addEventListener('click', e => this.changePage(e.target));
    container.appendChild(pagesContainer);
  }

  async getSearchRequest(query, number, pageNumber) {
    this.query = query;
    this.isSearchMode = query !== '';
    this.paginationNumber = number;
    this.pageNumber = pageNumber;
    if (this.isSearchMode) {
      document.querySelector('.container').innerHTML = '';
      createLoader(document.querySelector('.container'));
      const postMins = await searchBlogPostsReq()
        .searchBlogPosts({
          search: query,
          page: number,
        })
        .then(r => r.json());
      if (postMins.blog_posts.length > 0) {
        this.postMiniaturesArray = this.generateArrays(postMins);
        this.generatePages(postMins.blog_posts_count);
        this.renderPostsMin(this.postMiniaturesArray[0]);
      }
      removeLoader();
    }
    if (!this.isSearchMode) {
      this.pageNumber = 1;
      this.initPostsMiniatures(1);
    }
  }

  searchPosts() {
    const input = document.querySelector('.blog__search input');
    let timer = null;
    input.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = setTimeout(() => {
        this.getSearchRequest(input.value, 1, 1);
      }, 1000);
    });
  }

  async initPostsMiniatures(number) {
    createLoader(document.body);
    this.paginationNumber = number;
    const postMins = await blogPostsMainPageReq()
      .getBlogPostsMainPageByNumber(number)
      .then(r => r.json())
      .catch(err => {
        showSnackBar('something went wrong, try again');
        removeLoader();
      });
    if (postMins.blog_posts.length > 0) {
      this.postMiniaturesArray = this.generateArrays(postMins);
      this.generatePages(postMins.blog_posts_count);
      this.renderPostsMin(this.postMiniaturesArray[0]);
    }
    removeLoader();
  }
}
