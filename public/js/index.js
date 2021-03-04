import '../css/main.css';

const allRadioBtn = document.querySelectorAll('input[type="radio"]');
const dateTimeInput = document.querySelector('#datetime');

allRadioBtn.forEach((radioBtn) => {
  radioBtn.addEventListener('input', (e) => {
    dateTimeInput.disabled = !e.target.matches('#custom');
  });
});

dateTimeInput.addEventListener(
  'input',
  (e) => (allRadioBtn[1].value = e.target.value) // setting the value of custom expiry date
);
