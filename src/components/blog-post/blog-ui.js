import authorimg from '../../assets/img/authorimg.png';
import twitter from '../../assets/img/twitter.png';
import facebook from '../../assets/img/facebook.png';
import commentlogo from '../../assets/img/commentlogo.png';

const createTitle = resJson => {
  const header = document.createElement('h1');
  header.innerHTML = resJson.title;
  const postContainer = document.querySelector('.article');
  postContainer.appendChild(header);
};

const createAuthor = resJson => {
  const postContainer = document.querySelector('.article');
  const articleData = document.createElement('div');
  articleData.classList.add('article__data');
  const articleDataBody = `      
    <div class="article__author">
      <img src="${authorimg}" class="article__author-avatar" alt="" />
      <div>
        <div class="article__author-name">${resJson.author_name}</div>
        <div class="article__date">${resJson.post_date}</div>
      </div>
    </div>
    <div class="articel__media">
      <a href="#" class="article__media-link"
        ><img src="${twitter}" alt="" class="article__media-icon"
      /></a>
  
      <a href="#" class="article__media-link"
        ><img src="${facebook}" alt="" class="article__media-icon"
      /></a>
  
      <a href="#" class="article__media-link"
        ><img src="${commentlogo}" alt="" class="article__media-icon"
      /></a>
    </div>`;
  articleData.innerHTML = articleDataBody;
  postContainer.appendChild(articleData);
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

const appendElement = (el, paragraphContent, postContainer) => {
  const paragraph = document.createElement(createTag(el));
  paragraph.innerText = paragraphContent;
  postContainer.appendChild(paragraph);
};
// napisac reducera!!!!!!!!!!!
const createPost = resJson => {
  console.log(resJson);
  const bodyArray = resJson.content_in_json.ops;
  const postContainer = document.querySelector('.article');
  let paragraphContent = '';
  bodyArray.forEach((el, index) => {
    const isLast = index === bodyArray.length - 1;
    if (el.insert !== '\n' && !el.attributes && !isLast) {
      paragraphContent = `${paragraphContent}${el.insert}`;
    } else if (el.insert !== '\n' && el.attributes && !isLast) {
      paragraphContent = `${paragraphContent}<span class="${createAtributesClasses(
        el.attributes
      )}">${el.insert}</span>`;
    } else if (el.insert !== '\n' && !el.attributes && isLast) {
      paragraphContent = `${paragraphContent}${el.insert}`;
      appendElement(el, paragraphContent, postContainer);
      paragraphContent = '';
    } else {
      appendElement(el, paragraphContent, postContainer);
      paragraphContent = '';
    }
  });
};

const createBlogPost = res => {
  createTitle(res);
  createAuthor(res);
  createPost(res);
};

export default createBlogPost;