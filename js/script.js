document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('mortgageForm');
    const clearButton = document.getElementById('clearAll');
    const resultSection = document.getElementById('result');
    const emptyResultSection = document.getElementById('empty_result');
    const radioInputs = document.querySelectorAll('input[name="MortageType"]');
    const numberInputs = document.querySelectorAll('#MortgageAmount, #MortgageTerm, #InterestRate');

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        clearErrors();

        const amount = parseFloat(document.getElementById('MortgageAmount').value.replace(/,/g, ''));
        const term = parseInt(document.getElementById('MortgageTerm').value.replace(/,/g, ''));
        const rate = parseFloat(document.getElementById('InterestRate').value.replace(/,/g, ''));
        const type = document.querySelector('input[name="MortageType"]:checked');

        if (validateInputs(amount, term, rate, type)) {
            calculateAndDisplayResults(amount, term, rate, type.value);
        }
    });

    clearButton.addEventListener('click', function (event) {
        event.preventDefault();
        clearForm();
    });

    radioInputs.forEach(radio => {
        radio.addEventListener('change', handleRadioChange);
    });

    // Add number-only input event listeners with comma formatting
    numberInputs.forEach(input => {
        input.addEventListener('input', function () {
            let value = this.value.replace(/[^0-9.]/g, '');
            if (value.includes('.')) {
                const parts = value.split('.');
                parts[0] = formatNumberWithCommas(parts[0]);
                this.value = parts.join('.');
            } else {
                this.value = formatNumberWithCommas(value);
            }
        });
    });

    function validateInputs(amount, term, rate, type) {
        let isValid = true;

        if (isNaN(amount) || amount <= 0) {
            showError('MortgageAmount', 'This field is required', 'inputgroup1');
            isValid = false;
        }
        if (isNaN(term) || term <= 0) {
            showError('MortgageTerm', 'This field is required', 'inputgroup2');
            isValid = false;
        }
        if (isNaN(rate) || rate <= 0) {
            showError('InterestRate', 'This field is required', 'inputgroup2');
            isValid = false;
        }
        if (!type) {
            showError('MortgageType', 'This field is required', 'formgroup3', true);
            isValid = false;
        }

        return isValid;
    }

    function calculateAndDisplayResults(amount, term, rate, type) {
        const monthlyRate = rate / 100 / 12;
        const numberOfPayments = term * 12;
        let monthlyRepayment, totalRepayment;

        if (type === 'Repayment') {
            monthlyRepayment = (amount * monthlyRate) / (1 - Math.pow((1 + monthlyRate), -numberOfPayments));
            totalRepayment = monthlyRepayment * numberOfPayments;
        } else {
            monthlyRepayment = amount * monthlyRate;
            totalRepayment = monthlyRepayment * numberOfPayments + amount;
        }

        document.getElementById('monthlyRepayments').innerText = `£${formatNumberWithCommas(monthlyRepayment.toFixed(2))}`;
        document.getElementById('totalRepayments').innerText = `£${formatNumberWithCommas(totalRepayment.toFixed(2))}`;

        emptyResultSection.style.display = 'none';
        resultSection.style.display = 'block';
    }

    function showError(inputId, message, groupClass, isRadio = false) {
        let element;

        if (isRadio) {
            element = document.querySelector(`.${groupClass}`);
        } else {
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                element = inputElement.closest(`.${groupClass}`);
            }
        }

        if (element) {
            element.classList.add('error');

            const error = document.createElement('div');
            error.className = 'error-message';
            error.innerText = message;

            // Append the error message outside of the groupClass element
            element.parentElement.appendChild(error);
        }
    }

    function clearErrors() {
        const errors = document.querySelectorAll('.error');
        errors.forEach(error => error.classList.remove('error'));

        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(message => message.remove());
    }

    function clearForm() {
        form.reset();
        clearErrors();
        emptyResultSection.style.display = 'flex';
        resultSection.style.display = 'none';

        radioInputs.forEach(radio => {
            const label = document.querySelector(`label[for="${radio.id}"]`);
            label.classList.remove('active');
        });
    }

    function handleRadioChange() {
        radioInputs.forEach(r => {
            const label = document.querySelector(`label[for="${r.id}"]`);
            if (r.checked) {
                label.classList.add('active');
            } else {
                label.classList.remove('active');
            }
        });
    }

    function formatNumberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
});
