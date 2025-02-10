import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const refs = {
  flatpicker: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('[data-start]'),
  fieldDays: document.querySelector('[data-days]'),
  fieldHours: document.querySelector('[data-hours]'),
  fieldMins: document.querySelector('[data-minutes]'),
  fieldSecs: document.querySelector('[data-seconds]'),
};
let userSelectedDate = null;
let intervalId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose: onFlatpickerClose,
};

flatpickr(refs.flatpicker, options);

refs.startBtn.addEventListener('click', onStartBtnClick);

function onFlatpickerClose(selectedDates) {
  const currentDate = Date.now();
  const isAvailableDate = selectedDates[0] - currentDate > 0;

  if (isAvailableDate) {
    userSelectedDate = selectedDates[0];
  } else {
    refs.startBtn.disabled = true;
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future',
      position: 'topRight',
    });
    return;
  }

  refs.startBtn.disabled = false;
}

function onStartBtnClick() {
  intervalId = setInterval(() => {
    const deltaTime = userSelectedDate - Date.now();
    const convertedTime = convertMs(deltaTime);

    refs.flatpicker.disabled = true;
    refs.startBtn.disabled = true;

    showTime(convertedTime);

    if (deltaTime < 1000) {
      refs.flatpicker.disabled = false;
      clearInterval(intervalId);
    }
  }, 1000);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function showTime({ days, hours, minutes, seconds }) {
  refs.fieldDays.textContent = addLeadingZero(days);
  refs.fieldHours.textContent = addLeadingZero(hours);
  refs.fieldMins.textContent = addLeadingZero(minutes);
  refs.fieldSecs.textContent = addLeadingZero(seconds);
}
