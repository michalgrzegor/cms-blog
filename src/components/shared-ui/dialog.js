export default class OpenDialog {
  closeDialog() {
    document.querySelector('.dialog__bg').remove();
  }

  yes() {
    this.yesFunction();
    this.closeDialog();
  }

  no() {
    this.noFunction();
    this.closeDialog();
  }

  createDialog(yesFunction, noFunction, dialogText) {
    this.yesFunction = yesFunction;
    this.noFunction = noFunction;
    const container = document.createElement('div');
    const dialogContainer = document.createElement('div');
    const paragraph = document.createElement('p');
    const yesButton = document.createElement('button');
    const noButton = document.createElement('button');
    container.classList.add('dialog__bg');
    dialogContainer.classList.add('dialog__container');
    yesButton.addEventListener('click', () => this.yes());
    noButton.addEventListener('click', () => this.no());
    paragraph.innerText = dialogText;
    yesButton.innerText = 'yes';
    noButton.innerText = 'no';
    dialogContainer.appendChild(paragraph);
    dialogContainer.appendChild(yesButton);
    dialogContainer.appendChild(noButton);
    container.appendChild(dialogContainer);
    document.body.appendChild(container);
  }
}
