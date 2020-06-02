class PostMiniatures {
  constructor() {
    this.template = document.querySelector('#miniature__template');
    this.container = document.querySelector('.container');
    this.postsMin = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  renderPostsMin() {
    this.postsMin.forEach(postMin => {
      const clone = this.template.content.cloneNode(true);
      const comments = clone.querySelector('.post__comments');
      comments.textContent = postMin;
      this.container.appendChild(clone);
      console.log(clone);
    });
  }
}

export default PostMiniatures;
