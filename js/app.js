//* Selectors
const form = document.querySelector('#formulario');
const result = document.querySelector('#resultado');
const pagination = document.querySelector('#paginacion');

//* Listeners
window.onload = () => {
  form.addEventListener('submit', validateForm);
};

//* Functions
function validateForm(e) {
  e.preventDefault();

  const termSearch = document.querySelector('#termino').value.trim();

  if (termSearch === '') {
    showAlert('Por favor ingrese un término de búsqueda');
    return;
  }
}

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
