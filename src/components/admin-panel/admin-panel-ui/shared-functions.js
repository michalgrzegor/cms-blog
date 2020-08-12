import {createLoader, removeLoader} from '../../shared-ui/loader';
import {blogPostReq} from '../../auth/fetch';
import {loadDataToEditor} from './text-editor';
import {changeToEditor} from '../admin-navigation';
import showSnackBar from '../../shared-ui/snackbar';
import OpenDialog from '../../shared-ui/dialog';

export default class ManagerFunctions extends OpenDialog {
  constructor() {
    super();
    this.entryList = [];
    this.list = [];
    this.renderedList = [];
    this.pageNumber = 1;
    this.pagesNumber = null;
    this.mngType = null;
    this.arrayName = null;
  }

  removeTable() {
    document.querySelector(`.${this.mngType}__table`).remove();
  }

  addPostsBtnEvents(template) {
    Array.from(template.querySelectorAll('.btn--edit')).forEach(btn => {
      btn.addEventListener('click', () => {
        createLoader(document.body);
        blogPostReq()
          .getBlogPost(btn.getAttribute('post-id'))
          .then(r => r.json())
          .then(changeToEditor)
          .then(loadDataToEditor)
          .then(() => removeLoader())
          .catch(err => {
            showSnackBar('something went wrong, try again');
            removeLoader();
          });
      });
    });
    Array.from(template.querySelectorAll('.btn--delete')).forEach(btn => {
      btn.addEventListener('click', () => {
        createLoader(document.body);
        const accept = () => {
          blogPostReq()
            .deleteBlogPost(btn.getAttribute('post-id'))
            .then(() => blogPostReq().getAllBlogPosts())
            .then(response => response.json())
            .then(response => this.setLists(response, this.mngType, this.arrayName))
            .then(() => this.removeTable())
            .then(() => this.renderTable())
            .then(() => removeLoader())
            .catch(err => {
              showSnackBar('something went wrong, try again');
              removeLoader();
            });
        };
        const decline = () => {
          removeLoader();
        };
        this.createDialog(accept, decline, 'Delete this blog post?');
      });
    });
  }

  sortCallback(a, b, sortVariable) {
    if (a[sortVariable].toLowerCase() < b[sortVariable].toLowerCase()) {
      return -1;
    }
    if (a[sortVariable].toLowerCase() > b[sortVariable].toLowerCase()) {
      return 1;
    }
    return 0;
  }

  setSortAttr(elements, element, value) {
    elements.forEach(el => {
      el.setAttribute('sortOrder', 0);
      el.classList.remove('text-bold');
    });
    element.setAttribute('sortOrder', value);
    element.classList.add('text-bold');
  }

  sort(elements, element, sortOrder, sortVariable) {
    if (sortOrder === 0) {
      this.list = this.list.sort((a, b) => this.sortCallback(a, b, sortVariable));
      this.renderedList = [...this.list.slice(0, 10)];
      this.setSortAttr(elements, element, 1);
    }
    if (sortOrder === 1) {
      this.list = this.list.sort((a, b) => this.sortCallback(a, b, sortVariable)).reverse();
      this.renderedList = [...this.list.slice(0, 10)];
      this.setSortAttr(elements, element, 0);
    }
    document.querySelector(`.${this.mngType}__table`).remove();
    this.renderTable();
  }

  getTemplate() {
    const template = document.querySelector(`#${this.mngType}__template`);
    const templateClone = template.content.cloneNode(true);
    return templateClone;
  }

  addSortEvents(legendTemplate) {
    let sortArray = [];
    if (this.mngType === 'user')
      sortArray = sortArray.concat([
        legendTemplate.querySelector(`.user__author`),
        legendTemplate.querySelector(`.user__date`),
        legendTemplate.querySelector(`.user__email`),
      ]);
    if (this.mngType === 'post')
      sortArray = sortArray.concat([
        legendTemplate.querySelector(`.post__title`),
        legendTemplate.querySelector(`.post__author`),
        legendTemplate.querySelector(`.post__date`),
      ]);
    sortArray.forEach(el =>
      el.addEventListener('click', () =>
        this.sort(sortArray, el, Number(el.getAttribute('sortOrder')), el.getAttribute('sort'))
      )
    );
  }

  search(value) {
    const key = this.mngType === 'post' ? 'title' : 'username';
    const newList = this.entryList.filter(el =>
      el[key].toLowerCase().includes(value.toLowerCase())
    );
    this.setLists(newList, this.mngType, this.arrayName);
    document.querySelector(`.${this.mngType}__table`).remove();
    this.renderTable();
  }

  addSearchEvent(searchTemplate) {
    const input = searchTemplate.querySelector(`.${this.mngType}__search input`);
    let timer = null;
    input.addEventListener('input', () => {
      window.clearTimeout(timer);
      timer = setTimeout(() => {
        this.search(input.value);
      }, 1000);
    });
  }

  setLists(listArray, mngType, arrayName) {
    this.list = listArray;
    this.renderedList = [...listArray.slice(0, 10)];
    this.pageNumber = 1;
    this.pagesNumber = Math.ceil(listArray.length / 10);
    this.mngType = mngType;
    this.arrayName = arrayName;
  }

  renderLegend(mngType, json, arrayName) {
    this.setLists(json, mngType, arrayName);
    this.entryList = json;
    const container = document.querySelector('.admin__container');
    const templateClone = this.getTemplate();
    const search = templateClone.querySelector(`.${this.mngType}__search`);
    const legend = templateClone.querySelector(`.${this.mngType}__legend`);
    this.addSortEvents(legend);
    this.addSearchEvent(search);
    container.appendChild(search);
    container.appendChild(legend);
  }

  tableContainer() {
    if (document.querySelector(`.${this.mngType}__table`)) {
      return document.querySelector(`.${this.mngType}__table`);
    }
    const usersListContainer = document.createElement('div');
    usersListContainer.classList.add(`${this.mngType}__table`);
    return usersListContainer;
  }

  truncate(str) {
    return `${str.substring(0, 34)}...`;
  }

  changePage(number) {
    this.pageNumber = number + 1;
    this.renderedList = [...this.list.slice(10 * number, 10 * number + 10)];
    this.removeTable();
    this.renderTable();
  }

  removePagesContainer() {
    const pagesContainer = document.querySelector('.pages__container');
    if (pagesContainer) pagesContainer.remove();
  }

  renderPages() {
    this.removePagesContainer();
    const arrayOfPages = [...Array(this.pagesNumber).keys()];
    const pagesContainer = document.createElement('div');
    pagesContainer.classList.add('pages__container');
    arrayOfPages.forEach((page, index) => {
      const p = document.createElement('p');
      p.textContent = page + 1;
      p.setAttribute('data-index', index);
      if (this.pageNumber === index + 1) p.classList.add('text--bold');
      pagesContainer.appendChild(p);
    });
    pagesContainer.addEventListener('click', event => {
      if (event.target.matches('p')) this.changePage(Number(event.target.dataset.index));
    });
    document
      .querySelector('.admin__container')
      .insertBefore(pagesContainer, document.querySelector('.editor__buttons'));
  }

  renderTable() {
    const container = document.querySelector('.admin__container');
    const tableRowsContainer = this.tableContainer();

    this.renderedList.forEach(element => {
      const tempClone = this.getTemplate();
      const row = tempClone.querySelector(`.${this.mngType}__row`);
      row.setAttribute(`${this.mngType}-id`, element.id);
      if (this.mngType === 'user') {
        row.querySelector(`.user__number`).textContent =
          this.renderedList.indexOf(element) + 1 + this.pageNumber * 10 - 10;
        row.querySelector(`.user__author`).textContent = element.username;
        row.querySelector(`.user__date`).textContent = new Date(
          element.created_at
        ).toLocaleDateString();
        row.querySelector(`.user__email`).textContent = element.email;
      }
      if (this.mngType === 'post') {
        row.querySelector(`.post__number`).textContent =
          this.renderedList.indexOf(element) + 1 + this.pageNumber * 10 - 10;
        row.querySelector(`.post__title`).textContent =
          element.title.length > 35 ? this.truncate(element.title) : element.title;
        row.querySelector(`.post__author`).textContent = element.author;
        row.querySelector(`.post__date`).textContent = new Date(
          element.last_update_date
        ).toLocaleDateString();
      }
      Array.from(tempClone.querySelectorAll(`.${this.mngType}__btn`)).forEach(btn =>
        btn.setAttribute(`${this.mngType}-id`, element.id)
      );
      tableRowsContainer.appendChild(row);
    });
    if (this.mngType === 'post') this.addPostsBtnEvents(tableRowsContainer);
    container.insertBefore(tableRowsContainer, document.querySelector('.editor__buttons'));
    this.renderPages();
  }
}
