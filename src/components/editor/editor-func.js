const json = {
  time: 1591165236217,
  blocks: [
    {
      type: 'paragraph',
      data: {
        text:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec ex vitae ipsum tincidunt pellentesque. Vivamus eu ultricies quam. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed convallis nisi et nisl rhoncus, interdum ultricies purus semper. Pellentesque ac velit vitae ante faucibus ultrices in fringilla velit. Quisque vitae dapibus elit, sit amet tempus mauris. Praesent et ultricies mauris. Nulla sodales lacinia consequat. Sed et posuere nunc. Nullam sodales maximus purus, egestas blandit neque sagittis at. Fusce sed lacus id eros tincidunt consequat id sed mauris. Aenean pharetra ante et elit ultricies aliquam.',
      },
    },
    {
      type: 'paragraph',
      data: {
        text:
          'Phasellus non magna ultrices nisi efficitur interdum. Donec ut urna at eros efficitur vehicula ut quis tortor. Nam vel consectetur lectus. Donec nec eros ac massa ornare scelerisque. Donec pulvinar non diam non pellentesque. Nunc blandit, diam et tempor vestibulum, velit leo convallis eros, at porttitor urna sapien nec leo. Sed sed libero sit amet mi fermentum tristique eu eu enim. Nam molestie augue vel diam ornare, a imperdiet nibh tincidunt. Etiam consequat lectus id nisl interdum,<b> ut mollis mi molestie</b>. Maecenas eget pulvinar nunc, et sagittis massa. Phasellus elementum, tellus nec pulvinar congue, magna ipsum ullamcorper ligula, sit amet ornare augue lacus vel nulla. Phasellus dui eros, viverra quis pellentesque non, volutpat volutpat lorem. Vivamus porta ante nisi, ut porta lectus vestibulum ut. Vivamus scelerisque leo et malesuada convallis. Nullam id purus interdum, euismod enim sit amet, elementum augue. Nulla non aliquam dui.',
      },
    },
    {
      type: 'paragraph',
      data: {
        text:
          'Donec ultricies sed augue fringilla malesuada. Ut gravida tempus malesuada. Aliquam vel felis aliquam urna scelerisque rutrum. Morbi erat arcu, ullamcorper vitae justo a, maximus lobortis mi. Mauris mattis neque arcu. Suspendisse eu lobortis ipsum. Mauris vitae ex vitae velit dignissim tincidunt. Ut in est eget augue aliquam vulputate ut vitae nunc. Proin neque tellus, blandit sit amet mi in, viverra placerat ante. Proin condimentum eleifend pulvinar. Nullam felis justo, lacinia at tristique vel, mattis non libero. Pellentesque vehicula mattis dolor id sollicitudin.',
      },
    },
  ],
  version: '2.17.0',
};

const saveData = editor => {
  console.log(editor);
  const divOutput = document.querySelector('.output');
  editor
    .save()
    .then(outputData => {
      console.log(outputData);
      divOutput.innerHTML = JSON.stringify(outputData);
    })
    .catch(error => {
      console.log('Saving failed: ', error);
    });
};

const loadData = editor => {
  editor.render(json);
};

export function fireBtn(editor) {
  const btn = document.querySelector('.saveBtn');
  btn.addEventListener('click', () => saveData(editor));
}
export function fireLoadBtn(editor) {
  const btn = document.querySelector('.loadBtn');
  btn.addEventListener('click', () => loadData(editor));
}
