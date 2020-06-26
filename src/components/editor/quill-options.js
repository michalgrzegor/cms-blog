import deltajson from './lorem.json';

export const options = {
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
  placeholder: 'Compose an epic...',
  theme: 'snow',
};

export const quillbtn = editor => {
  const button = document.querySelector('.loadBtn');
  button.addEventListener('click', () => {
    console.log(editor.getContents());
    editor.setContents(deltajson);
    // document.querySelector('#otput').innerHTML = JSON.stringify(editor.getContents());
  });
};
