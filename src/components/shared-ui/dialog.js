export default class OpenDialog {
  closeDialog() {
    document.querySelector('.dialog__bg').remove();
  }

  accept() {
    this.yesFunction();
    this.closeDialog();
  }

  decline() {
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
    yesButton.addEventListener('click', () => this.accept());
    noButton.addEventListener('click', () => this.decline());
    paragraph.textContent = dialogText;
    yesButton.textContent = 'yes';
    noButton.textContent = 'no';
    dialogContainer.appendChild(paragraph);
    dialogContainer.appendChild(yesButton);
    dialogContainer.appendChild(noButton);
    container.appendChild(dialogContainer);
    document.body.appendChild(container);
  }
}
