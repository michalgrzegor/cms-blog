const initContentEditable = () => {
  const editable = document.querySelector('.editor__window');

  document.execCommand('DefaultParagraphSeparator', false, 'p');
  editable.addEventListener('paste', e => {
    e.preventDefault();
    const text = (e.originalEvent || e).clipboardData.getData('text/plain');
    document.execCommand('insertHTML', false, text);
  });
};

export default initContentEditable;
