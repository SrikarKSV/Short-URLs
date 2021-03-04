import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import '../css/main.css';

const allRadioBtn = document.querySelectorAll('input[type="radio"]');
const dateTimeInput = document.querySelector('#datetime');

allRadioBtn.forEach((radioBtn) => {
  radioBtn.addEventListener('input', (e) => {
    dateTimeInput.disabled = !e.target.matches('#custom');
  });
});

flatpickr('#datetime', {
  enableTime: true,
  minDate: Date.now(),
  onChange: (selectedDates, dateStr, instance) => {
    allRadioBtn[1].value = dateStr;
  },
});
