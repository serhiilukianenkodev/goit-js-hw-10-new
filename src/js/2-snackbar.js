import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  form: document.querySelector('.js-form'),
};

refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit(e) {
  e.preventDefault();
  const delay = e.target.elements.delay.value;
  const state = e.target.elements.state.value;

  createPromice({ delay, state })
    .then(delay => {
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${delay}ms`,
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
      });
    });
}

function createPromice({ delay, state }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      }

      reject(delay);
    }, delay);
  });
}
