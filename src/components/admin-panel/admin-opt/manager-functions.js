import {createLoader, removeLoader} from '../../UI/loader';
import {blogPostReq} from '../../auth/fetch';
import {loadDataToEditor} from './quill-options';
import {changeToEditor} from '../admin-navigation';
import showSnackBar from '../../UI/snackbar';

export default class ManagerFunctions {
  constructor() {
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
          .makeGetBlogPost(btn.getAttribute('post-id'))
          .then(r => r.json())
          .then(r => changeToEditor(r))
          .then(r => loadDataToEditor(r))
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
        blogPostReq()
          .makeDeleteBlogPost(btn.getAttribute('post-id'))
          .then(() => blogPostReq().makeGetAllBlogPosts())
          .then(response => response.json())
          .then(response => this.setLists(response, this.mngType, this.arrayName))
          .then(() => this.removeTable())
          .then(() => this.renderTable())
          .then(() => removeLoader())
          .catch(err => {
            showSnackBar('something went wrong, try again');
            removeLoader();
          });
      });
    });
  }

  addUsersBtnEvents(template) {
    Array.from(template.querySelectorAll('.user__btn')).forEach(btn =>
      btn.addEventListener('click', () => {
        console.log(btn.getAttribute('user-id'));
      })
    );
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
      el.setAttribute('sorted', 0);
      el.classList.remove('text-bold');
    });
    element.setAttribute('sorted', value);
    element.classList.add('text-bold');
  }

  sort(elements, element, isSorted, sortVariable) {
    if (isSorted === 0) {
      this.list = this.list.sort((a, b) => this.sortCallback(a, b, sortVariable));
      this.renderedList = [...this.list.slice(0, 10)];
      this.setSortAttr(elements, element, 1);
    }
    if (isSorted === 1) {
      this.list = this.list.sort((a, b) => this.sortCallback(a, b, sortVariable)).reverse();
      this.renderedList = [...this.list.slice(0, 10)];
      this.setSortAttr(elements, element, 2);
    }
    if (isSorted === 2) {
      this.list = this.list.sort((a, b) => this.sortCallback(a, b, sortVariable));
      this.renderedList = [...this.list.slice(0, 10)];
      this.setSortAttr(elements, element, 1);
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
        legendTemplate.querySelector(`.${this.mngType}__author`),
        legendTemplate.querySelector(`.${this.mngType}__date`),
      ]);
    if (this.mngType === 'post')
      sortArray = sortArray.concat([
        legendTemplate.querySelector(`.${this.mngType}__title`),
        legendTemplate.querySelector(`.${this.mngType}__author`),
        legendTemplate.querySelector(`.${this.mngType}__date`),
      ]);
    sortArray.forEach(el =>
      el.addEventListener('click', () =>
        this.sort(sortArray, el, Number(el.getAttribute('sorted')), el.getAttribute('sort'))
      )
    );
  }

  search(value) {
    const key = this.mngType === 'post' ? 'title' : 'username';
    const newList = [
      ...this.entryList.filter(el => el[key].toLowerCase().includes(value.toLowerCase())),
    ];
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
    console.log(listArray);
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
    console.log(this.mngType);
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
    console.log(number);
    this.pageNumber = number + 1;
    this.renderedList = [...this.list.slice(10 * number, 10 * number + 10)];
    this.removeTable();
    this.renderTable();
  }

  renderPages() {
    if (document.querySelector('.pages__container'))
      document.querySelector('.pages__container').remove();
    const arrayOfPages = [...Array(this.pagesNumber).keys()];
    console.log(arrayOfPages);
    const pagesContainer = document.createElement('div');
    pagesContainer.classList.add('pages__container');
    arrayOfPages.forEach((page, index) => {
      const p = document.createElement('p');
      p.innerText = page + 1;
      p.addEventListener('click', () => this.changePage(index));
      if (this.pageNumber === index + 1) p.classList.add('text--bold');
      pagesContainer.appendChild(p);
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
        row.querySelector(`.${this.mngType}__number`).innerText =
          this.renderedList.indexOf(element) + 1 + this.pageNumber * 10 - 10;
        row.querySelector(`.${this.mngType}__author`).innerText = element.username;
        row.querySelector(`.${this.mngType}__date`).innerText = new Date(
          element.last_update_date
        ).toLocaleDateString();
      }
      if (this.mngType === 'post') {
        row.querySelector(`.${this.mngType}__number`).innerText =
          this.renderedList.indexOf(element) + 1 + this.pageNumber * 10 - 10;
        row.querySelector(`.${this.mngType}__title`).innerText =
          element.title.length > 35 ? this.truncate(element.title) : element.title;
        row.querySelector(`.${this.mngType}__author`).innerText = element.author;
        row.querySelector(`.${this.mngType}__date`).innerText = new Date(
          element.last_update_date
        ).toLocaleDateString();
      }
      Array.from(tempClone.querySelectorAll(`.${this.mngType}__btn`)).forEach(btn =>
        btn.setAttribute(`${this.mngType}-id`, element.id)
      );
      tableRowsContainer.appendChild(row);
    });
    this.mngType === 'post'
      ? this.addPostsBtnEvents(tableRowsContainer)
      : this.addUsersBtnEvents(tableRowsContainer);
    container.insertBefore(tableRowsContainer, document.querySelector('.editor__buttons'));
    // container.insertBefore(this.renderPages(), document.querySelector('.editor__buttons'));
    this.renderPages();
  }
}
