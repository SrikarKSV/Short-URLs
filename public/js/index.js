import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import '../css/main.css';

const allRadioBtn = document.querySelectorAll('input[type="radio"]');
const dateTimeInput = document.querySelector('#datetime');
const customExpiryDateDiv = document.querySelector('.custom-expiry-date');

allRadioBtn.forEach((radioBtn) => {
  radioBtn.addEventListener('input', (e) => {
    const toggleOpen = e.target.matches('#custom');
    toggleOpen
      ? customExpiryDateDiv.classList.add('custom-expiry-date--expand')
      : customExpiryDateDiv.classList.remove('custom-expiry-date--expand');
    dateTimeInput.disabled = !toggleOpen;
  });
});

flatpickr('#datetime', {
  enableTime: true,
  minDate: Date.now(),
  onChange: (selectedDates, dateStr, instance) => {
    allRadioBtn[1].value = dateStr;
  },
});
