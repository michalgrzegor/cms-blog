import options from './editor-options-list';

const createHeading = option => {
  return option.valueArgument;
};

const formatSelection = option => {
  document.execCommand(option.command, false, option.valueArgument);
  if (option.class) {
    const selection = window.getSelection().focusNode.parentNode;
    const spanWithClass = document.createElement('span');
    spanWithClass.innerHTML = selection.innerHTML;
    spanWithClass.classList.add(option.class);
    selection.parentNode.replaceChild(spanWithClass, selection);
  }
};

const generateListItems = () => {
  const container = document.querySelector('.editor__pallete');
  options.forEach(opt => {
    const li = document.createElement('li');
    const button = document.createElement('button');
    const span = document.createElement('span');

    button.type = 'button';
    button.classList.add('editor__option');
    button.addEventListener('click', () => formatSelection(opt));

    span.classList.add(opt.name === 'heading' ? 'editor__heading' : 'material-icons');
    span.innerHTML = opt.name === 'heading' ? createHeading(opt) : opt.icon_name;

    button.appendChild(span);
    li.appendChild(button);
    container.appendChild(li);
  });
};

export default generateListItems;
