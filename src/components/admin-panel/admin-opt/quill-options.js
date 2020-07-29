import Quill from 'quill';
import {createBlogPost} from '../../blog-post/blog-ui';
import {blogPostReq} from '../../auth/fetch';
import {createLoader, removeLoader} from '../../UI/loader';
import showSnackBar from '../../UI/snackbar';

let editor;

const options = {
  modules: {
    toolbar: [
      [
        {
          header: [1, 2, false],
        },
      ],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block'],
    ],
  },
  placeholder: 'Blog body',
  theme: 'snow',
};

const collectData = () => {
  const data = {
    author: 'your name',
    last_update_date: new Date(),
    title: '',
    introduction: '',
    data: {
      editor: 'Quill',
      ops: [],
    },
  };
  data.title = document.querySelector('#editor__title').value;
  data.introduction = document.querySelector('.editor__textarea').value;
  data.data.ops = editor.getContents().ops;
  return data;
};

const openPreview = () => {
  const bgContainer = document.createElement('div');
  bgContainer.classList.add('preview__container');
  bgContainer.addEventListener('click', () => bgContainer.remove());
  const previewArticle = document.createElement('div');
  previewArticle.classList.add('article');
  bgContainer.appendChild(previewArticle);
  document.body.appendChild(bgContainer);
  const data = collectData(editor);
  createBlogPost(data);
};

const previewButton = () => {
  const previeBtn = document.querySelectorAll('.editor__button')[2];
  previeBtn.addEventListener('click', () => openPreview(editor));
};

const redirectToBlogPost = response => {
  window.location.href = `https://musing-ramanujan-8002a4.netlify.app/blog-post?id=${response.id}`;
};

const sendPost = () => {
  const data = {
    title: document.querySelector('#editor__title').value,
    introduction: document.querySelector('.editor__textarea').value,
    data: {
      editor: 'Quill',
      ops: editor.getContents().ops,
    },
  };
  console.log(data);
  createLoader(document.body);
  blogPostReq()
    .makePostBlogPost(data)
    .then(r => {
      const response = r.json();
      console.log(response);
      return response;
    })
    .then(r => redirectToBlogPost(r))
    .catch(err => {
      showSnackBar('something went wrong, try again');
      removeLoader();
    });
};

const submitButton = () => {
  const submitBtn = document.querySelectorAll('.editor__button')[1];
  submitBtn.addEventListener('click', () => sendPost(editor));
};

const sendUpdate = id => {
  const data = {
    title: document.querySelector('#editor__title').value,
    introduction: document.querySelector('.editor__textarea').value,
    data: {
      editor: 'Quill',
      ops: editor.getContents().ops,
    },
  };
  console.log(data);
  createLoader(document.body);
  blogPostReq()
    .makeUpdateBlogPost(id, data)
    .then(r => {
      console.log(r);
      const response = r.json();
      console.log(response);
      return response;
    })
    .then(r => redirectToBlogPost(r))
    .catch(err => {
      showSnackBar('something went wrong, try again');
      removeLoader();
    });
};

const updateButton = id => {
  const submitBtn = document.querySelectorAll('.editor__button')[0];
  submitBtn.addEventListener('click', () => sendUpdate(id));
};

const createError = message => {
  const paragraph = document.createElement('p');
  paragraph.classList.add('text--color-error', 'error');
  const editorContainer = document.querySelectorAll('.editor__flex');
  paragraph.innerHTML = message;
  editorContainer[0].appendChild(paragraph);
};

const validateIntroduction = () => {
  document.querySelector('.editor__textarea').addEventListener('input', () => {
    if (
      document.querySelector('.error') ||
      (document.querySelector('.error') &&
        document.querySelector('.editor__textarea').value.length < 201)
    )
      document.querySelector('.error').remove();
    if (document.querySelector('.editor__textarea').value.length > 201)
      createError('Introduction is too long. The maximum number of characters is 200.');
    // if (quillEditor.getLength === 1) createError('you forgot about the introduction');
  });
};

const changeButton = id => {
  document.querySelectorAll('.editor__button')[0].classList.toggle('btn--hidden');
  document.querySelectorAll('.editor__button')[1].classList.toggle('btn--hidden');
  updateButton(id);
};

export const loadDataToEditor = responseData => {
  console.log(responseData);
  changeButton(responseData.id);
  document.querySelector('#editor__title').value = responseData.title;
  document.querySelector('.editor__textarea').value = responseData.introduction;
  editor.setContents(responseData.data);
};

const renderEditor = () => {
  const container = document.querySelector('.admin__container');
  const template = document.querySelector('#editor__template');
  const templateClone = template.content.cloneNode(true);
  container.appendChild(templateClone);
};

export const initEditor = () => {
  renderEditor();
  editor = new Quill('#editor', options);
  previewButton(editor);
  submitButton(editor);
  validateIntroduction();
};

export default initEditor;
