const loadImage = (image, container) => {
  container.querySelector('.image__loader').style.display = 'none';
  container.querySelector('img').style.display = 'block';
  container.querySelector('img').src = image.src;
};

const imageLoaderPromise = imageSRC => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = imageSRC;
  });
};

const imageLoader = (imageSRC, container) => {
  imageLoaderPromise(imageSRC).then(image => loadImage(image, container));
};

export default imageLoader;
