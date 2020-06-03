import Header from '@editorjs/header';
import ImageTool from '@editorjs/image';

const options = {
  holderId: 'editorjs',
  tools: {
    header: {
      class: Header,
      config: {
        placeholder: 'Enter a header',
        levels: [1, 2],
        defaultLevel: 1,
        inlineToolbar: true,
      },
    },
    img: {
      class: ImageTool,
      config: {
        endpoints: {
          byFile: 'http://localhost:8008/uploadFile', // Your backend file uploader endpoint
          byUrl: 'http://localhost:8008/fetchUrl', // Your endpoint that provides uploading by Url
        },
      },
    },
  },
  placeholder: 'Let`s write an awesome story!',
  autofocus: true,
  //   onChange: () => saveData(),
};

export default options;
