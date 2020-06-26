import '../../style/shared/blog-post.scss';
import responseJson from '../editor/lorem.json';

const postBodyRequest = async () => {
  return new Promise((resolve, reject) => {
    resolve(responseJson);
    reject(new Error(`spartoliło się`));
  });
};

const createAtributesClasses = attributes => {
  let cssClass = ``;
  const attrArray = Object.keys(attributes);
  attrArray.forEach(key => {
    cssClass = `${cssClass} article--style-${key}`;
  });
  return cssClass;
};

const createTag = element =>
  element.attributes && element.attributes.header ? `h${element.attributes.header}` : 'p';

const createPost = resJson => {
  console.log(resJson);
  const bodyArray = resJson.ops;
  const postContainer = document.querySelector('.article');
  let paragraphContent = '';
  bodyArray.forEach(el => {
    if (el.insert !== '\n' && !el.attributes) {
      paragraphContent = `${paragraphContent}${el.insert}`;
    } else if (el.insert !== '\n' && el.attributes) {
      paragraphContent = `${paragraphContent}<span class="${createAtributesClasses(
        el.attributes
      )}">${el.insert}</span>`;
    } else {
      const paragraph = document.createElement(createTag(el));
      paragraph.innerHTML = paragraphContent;
      postContainer.appendChild(paragraph);
      paragraphContent = '';
    }
  });
};

postBodyRequest().then(res => createPost(res));
