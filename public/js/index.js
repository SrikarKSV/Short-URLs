import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import '../css/main.css';

const allRadioBtn = document.querySelectorAll('input[type="radio"]');
const customExpiryDateDiv = document.querySelector('.custom-expiry-date');
const extraLinks = document.querySelector('.extra-links');
const customExpiryDate = document.querySelector('.enter-custom');

const form = document.querySelector('.form');

allRadioBtn.forEach((radioBtn) => {
  radioBtn.addEventListener('input', (e) => {
    const toggleOpen = e.target.matches('#custom');
    toggleOpen
      ? customExpiryDateDiv.classList.add('custom-expiry-date--expand')
      : customExpiryDateDiv.classList.remove('custom-expiry-date--expand');
  });
});

// Checking values before submission
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const urls = e.target.url.value.split(',').map((url) => url.trim());
  if (urls.length > 10) {
    extraLinks.hidden = false;
  } else if (!allRadioBtn[0].checked && allRadioBtn[1].value === 'on') {
    // if the expiry date is not selected
    customExpiryDate.hidden = false;
  } else {
    e.target.submit();
  }
});

flatpickr('#datetime', {
  enableTime: true,
  minDate: Date.now(),
  onChange: (selectedDates, dateStr, instance) => {
    allRadioBtn[1].value = dateStr;
  },
});
