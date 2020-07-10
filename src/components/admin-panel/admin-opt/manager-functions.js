const sortCallback = (a, b, sortVariable) => {
  if (a[sortVariable].toLowerCase() < b[sortVariable].toLowerCase()) {
    return -1;
  }
  if (a[sortVariable].toLowerCase() > b[sortVariable].toLowerCase()) {
    return 1;
  }
  return 0;
};

const setSortAttr = (elements, element, value) => {
  elements.forEach(el => {
    el.setAttribute('sorted', 0);
    el.classList.remove('text-bold');
  });
  element.setAttribute('sorted', value);
  element.classList.add('text-bold');
};

const sort = (elements, element, isSorted, sortVariable, postsArray, arrayName, mngType) => {
  let newArray = [];
  if (isSorted === 0) {
    newArray = postsArray.sort((a, b) => sortCallback(a, b, sortVariable));
    setSortAttr(elements, element, 1);
  }
  if (isSorted === 1) {
    newArray = postsArray.sort((a, b) => sortCallback(a, b, sortVariable)).reverse();
    setSortAttr(elements, element, 2);
  }
  if (isSorted === 2) {
    newArray = postsArray.sort((a, b) => sortCallback(a, b, sortVariable));
    setSortAttr(elements, element, 1);
  }
  document.querySelector(`.${mngType}__table`).remove();
  renderTable(newArray, mngType);
};

export const getTemplate = mngType => {
  const template = document.querySelector(`#${mngType}__template`);
  const templateClone = template.content.cloneNode(true);
  return templateClone;
};

const addSortEvents = (legendTemplate, mngType, json, arrayName) => {
  let sortArray = [];
  if (mngType === 'user')
    sortArray = sortArray.concat([
      legendTemplate.querySelector(`.${mngType}__author`),
      legendTemplate.querySelector(`.${mngType}__date`),
    ]);
  if (mngType === 'post')
    sortArray = sortArray.concat([
      legendTemplate.querySelector(`.${mngType}__title`),
      legendTemplate.querySelector(`.${mngType}__author`),
      legendTemplate.querySelector(`.${mngType}__date`),
    ]);
  sortArray.forEach(el =>
    el.addEventListener('click', () =>
      sort(
        sortArray,
        el,
        Number(el.getAttribute('sorted')),
        el.getAttribute('sort'),
        json,
        arrayName,
        mngType
      )
    )
  );
};

export const renderLegend = (mngType, json, arrayName) => {
  const container = document.querySelector('.admin__container');
  const templateClone = getTemplate(mngType);
  const legend = templateClone.querySelector(`.${mngType}__legend`);
  addSortEvents(legend, mngType, json, arrayName);
  container.appendChild(legend);
};

const tableContainer = mngType => {
  if (document.querySelector(`.${mngType}__table`)) {
    return document.querySelector(`.${mngType}__table`);
  }
  const usersListContainer = document.createElement('div');
  usersListContainer.classList.add(`${mngType}__table`);
  return usersListContainer;
};

export const renderTable = (jsonArray, mngType) => {
  const container = document.querySelector('.admin__container');
  const tableRowsContainer = tableContainer(mngType);

  jsonArray.forEach(element => {
    const tempClone = getTemplate(mngType);
    const row = tempClone.querySelector(`.${mngType}__row`);
    row.setAttribute(`${mngType}-id`, element.id);
    if (mngType === 'user') {
      row.querySelector(`.${mngType}__number`).innerText = jsonArray.indexOf(element) + 1;
      row.querySelector(`.${mngType}__author`).innerText = element.name;
      row.querySelector(`.${mngType}__date`).innerText = new Date(
        element.last_update_date
      ).toLocaleDateString();
    }
    if (mngType === 'post') {
      row.querySelector(`.${mngType}__number`).innerText = jsonArray.indexOf(element) + 1;
      row.querySelector(`.${mngType}__title`).innerText = element.title;
      row.querySelector(`.${mngType}__author`).innerText = element.author;
      row.querySelector(`.${mngType}__date`).innerText = new Date(
        element.last_update_date
      ).toLocaleDateString();
    }
    Array.from(tempClone.querySelectorAll(`.${mngType}__btn`)).forEach(btn =>
      btn.setAttribute(`${mngType}-id`, element.id)
    );
    tableRowsContainer.appendChild(row);
  });
  container.insertBefore(tableRowsContainer, document.querySelector('.editor__buttons'));
};
