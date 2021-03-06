import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import '../css/main.css';

const allRadioBtn = document.querySelectorAll('input[type="radio"]');
const customExpiryDateDiv = document.querySelector('.custom-expiry-date');
const form = document.querySelector('.form');

const moreThan10LinksHTML = `
  <div class="flash flash--error extra-links">
    <p>Don't shorten more than 10 links</p>
  </div>
`;

const chooseExpiryDateHTML = `
  <div class="flash flash--error enter-custom">
    <p>Please select expiry date!</p>
  </div>
`;

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
    form.insertAdjacentHTML('beforebegin', moreThan10LinksHTML);
  } else if (!allRadioBtn[0].checked && allRadioBtn[1].value === 'on') {
    // if the sxpiry date is not selected
    form.insertAdjacentHTML('beforebegin', chooseExpiryDateHTML);
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
