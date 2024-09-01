//* Selectors
const form = document.querySelector('#formulario');
const result = document.querySelector('#resultado');
const pagination = document.querySelector('#paginacion');

//* Variables
const resultsPerPage = 30;
let totalPages;
let iterator;
let currentPage = 1;

//* Listeners

/**
 * Adds an event listener to the form submit event.
 * When the form is submitted, it prevents the default form submission behavior and calls the validateForm function.
 *
 * @returns {void}
 */
window.onload = () => {
  form.addEventListener('submit', validateForm);
};

//* Functions

/**
 * Validates the form input and triggers the search process.
 * @param {Event} e - The event object representing the form submission.
 * @returns {void}
 */
function validateForm(e) {
  e.preventDefault();

  const termSearch = document.querySelector('#termino').value.trim();

  if (termSearch === '') {
    showAlert('Por favor ingrese un término de búsqueda');
    return;
  }

  searchImages();
}

/**
 * Displays an alert message with a specified duration.
 * @param {string} message - The message to be displayed in the alert.
 * @returns {void}
 */
function showAlert(message) {
  const alertExists = document.querySelector('.bg-red-100');

  if (!alertExists) {
    const alert = document.createElement('P');
    const TIME_DURATION = 3000;

    alert.classList.add(
      'bg-red-100', 'border-red-400', 'text-red-700', 'text-center', 'px-4',
      'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'py-3'
    );

    alert.innerHTML = `
      <strong class="font-bold">¡Error!</strong>
      <span class="block sm:inline">${message}</span>
    `;

    form.appendChild(alert);

    setTimeout(() => {
      alert.remove();
    }, TIME_DURATION);
  }
}

/**
 * Fetches images from the Pixabay API based on the user's search term,
 * and updates the UI with the fetched images and pagination.
 * @function searchImages
 * @returns {void}
 */
async function searchImages() {
  const term = document.querySelector('#termino').value.trim();
  const API_KEY = '45249828-7dacdf86c9383b99a295ffc4f';
  const URL = `https://pixabay.com/api/?key=${API_KEY}&q=${term}&per_page=${resultsPerPage}&page=${currentPage}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();
    totalPages = estimatePages(data.totalHits);
    showImages(data.hits);
  } catch (error) {
    console.error(error);
  }
}

/**
 * Estimates the total number of pages based on the total number of hits and the number of results per page.
 * @function estimatePages
 * @param {number} total - The total number of hits returned by the Pixabay API.
 * @returns {number} The total number of pages required to display all the images.
 */
function estimatePages(total) {
  return parseInt(Math.ceil(total / resultsPerPage), 10);
}


/**
 * A generator function that yields a sequence of page numbers.
 * @function createPages
 * @param {number} total - The total number of pages to generate.
 * @yields {number} - The next page number in the sequence.
 * @returns {Generator} - A generator object that can be iterated to retrieve the page numbers.
*/
function* createPages(total) {
  for (let i = 1; i <= total; i++) {
    yield i;
  }
}

/**
 * Displays pagination buttons based on the total number of pages.
 * Each button is created dynamically and appended to the pagination container.
 * When a button is clicked, it updates the current page and triggers the searchImages function.
 * @function showPages
 * @returns {void}
 */
function showPages() {
  iterator = createPages(totalPages);

  while (true) {
    const { value, done } = iterator.next();
    if (done) {
      break;
    }

    const pageBtn = document.createElement('A');
    pageBtn.href = `#page-${value}`;
    pageBtn.textContent = value;
    pageBtn.dataset.page = value;
    pageBtn.classList.add(
      'next', 'bg-yellow-400', 'px-4', 'py-1', 'mr-2',
      'font-bold', 'mb-4', 'rounded'
    );

    pageBtn.onclick = () => {
      currentPage = value;
      searchImages();
    };

    pagination.appendChild(pageBtn);
  }
}

/**
 * Displays the fetched images in the UI, along with pagination buttons.
 * @function showImages
 * @param {Array} images - An array of image objects, each containing properties like previewURL, largeImageURL, likes, and views.
 * @returns {void}
 * @example
 * showImages([
 * {
 * previewURL: 'https://example.com/image1_preview.jpg',
 * largeImageURL: 'https://example.com/image1_large.jpg',
 * likes: 100,
 * views: 500
 * },
 * {
 * previewURL: 'https://example.com/image2_preview.jpg',
 * largeImageURL: 'https://example.com/image2_large.jpg',
 * likes: 200,
 * views: 800
 * },
 * ... more image objects
 * ]);
 */
function showImages(images) {
  while (result.firstChild) {
    result.removeChild(result.firstChild);
  }

  images.forEach(image => {
    const { previewURL, largeImageURL, likes, views } = image;

    result.innerHTML += `
    <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
      <div class="bg-white">
        <img class="w-full" src="${previewURL}">
        <div class="p-4">
          <p class="font-bold">
            ${likes} <span class="font-light">Likes</span>
          </p>
          <p class="font-bold">
            ${views} <span class="font-light">Vistas</span>
          </p>
          <a
            class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
            href="${largeImageURL}" target="_blank" rel="noopener noreferrer"
          >
            Ver Imagen
          </a>
        </div>
      </div>
    </div>
    `;
  });

  while (pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }

  showPages();
}
