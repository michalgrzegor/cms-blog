import Quill from 'quill';
import createBlogPost from '../../blog-post/blog-ui';

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

const introductionOptions = {
  modules: {
    toolbar: [['bold', 'italic', 'underline']],
  },
  placeholder: 'Post introduction',
  theme: 'bubble',
};

const collectData = (editor, introductionEditor) => {
  const data = {
    author_name: 'Kupa Koń',
    post_date: '2020-02-11',
    title: '',
    introduction: {
      editor: 'Quill',
      ops: [],
    },
    content_in_json: {
      editor: 'Quill',
      ops: [],
    },
  };
  data.title = document.querySelector('#editor__title').value;
  data.introduction.ops = introductionEditor.getContents().ops;
  data.content_in_json.ops = editor.getContents().ops;
  return data;
};

const openPreview = (editor, introductionEditor) => {
  const bgContainer = document.createElement('div');
  bgContainer.classList.add('preview__container');
  bgContainer.addEventListener('click', () => bgContainer.remove());
  const previewArticle = document.createElement('div');
  previewArticle.classList.add('article');
  bgContainer.appendChild(previewArticle);
  document.body.appendChild(bgContainer);
  const data = collectData(editor, introductionEditor);
  createBlogPost(data);
};

const previewButton = (editor, introductionEditor) => {
  const previeBtn = document.querySelectorAll('.editor__button')[1];
  previeBtn.addEventListener('click', () => openPreview(editor, introductionEditor));
};

const createError = message => {
  const paragraph = document.createElement('p');
  paragraph.classList.add('text--color-error', 'error');
  const editorContainer = document.querySelectorAll('.editor__flex');
  paragraph.innerHTML = message;
  editorContainer[0].appendChild(paragraph);
};

const validateIntroduction = quillEditor => {
  quillEditor.on('text-change', () => {
    if (
      document.querySelector('.error') ||
      (document.querySelector('.error') && quillEditor.getLength() < 201)
    )
      document.querySelector('.error').remove();
    if (quillEditor.getLength() > 201)
      createError('Introduction is too long. The maximum number of characters is 200.');
    // if (quillEditor.getLength === 1) createError('you forgot about the introduction');
  });
};

const renderEditor = () => {
  const container = document.querySelector('.admin__container');
  const template = document.querySelector('#editor__template');
  const templateClone = template.content.cloneNode(true);
  container.appendChild(templateClone);
};

const initEditor = () => {
  renderEditor();
  const introductionEditor = new Quill('#subheading-editor', introductionOptions);
  const editor = new Quill('#editor', options);
  validateIntroduction(introductionEditor);
  previewButton(editor, introductionEditor);
};

export default initEditor;
