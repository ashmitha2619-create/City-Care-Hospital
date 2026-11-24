
(function () {
  var form = document.getElementById('appointment-form');
  var errorSummary = document.getElementById('form-errors');
  var successMessage = document.getElementById('form-success');

  // Today's date as YYYY-MM-DD (local time)
  function today() {
    var d = new Date();
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return d.getFullYear() + '-' + month + '-' + day;
  }

  // Preferred date cannot be in the past; date of birth cannot be in the future
  document.getElementById('date').min = today();
  document.getElementById('dob').max = today();

  // Show or clear the error under one field. Returns a list of errors.
  function showFieldError(messageId, input, message) {
    document.getElementById(messageId).textContent = message;

    if (message) {
      input.setAttribute('aria-invalid', 'true');
      return [{ message: message, field: input }];
    }

    input.removeAttribute('aria-invalid');
    return [];
  }

  // Check every field and return all errors found
  function validateForm() {
    var f = form.elements;
    var errors = [];
    var msg;

    msg = f.name.value.trim() === '' ? 'Enter your full name.' : '';
    errors = errors.concat(showFieldError('name-err', f.name, msg));

    msg = /^\d{10}$/.test(f.phone.value.trim()) ? '' : 'Enter a 10-digit phone number.';
    errors = errors.concat(showFieldError('phone-err', f.phone, msg));

    msg = (f.email.value === '' || !f.email.validity.valid) ? 'Enter a valid email address.' : '';
    errors = errors.concat(showFieldError('email-err', f.email, msg));

    if (f.dob.value === '') {
      msg = 'Enter your date of birth.';
    } else if (f.dob.value > today()) {
      msg = 'Date of birth cannot be in the future.';
    } else {
      msg = '';
    }
    errors = errors.concat(showFieldError('dob-err', f.dob, msg));

    msg = f.department.value === '' ? 'Select a department.' : '';
    errors = errors.concat(showFieldError('department-err', f.department, msg));

    if (f.date.value === '') {
      msg = 'Choose a preferred date.';
    } else if (f.date.value < today()) {
      msg = 'Preferred date cannot be in the past.';
    } else {
      msg = '';
    }
    errors = errors.concat(showFieldError('date-err', f.date, msg));

    // One time slot must be selected (error attached to the first radio)
    var timePicked = form.querySelector('input[name="time"]:checked');
    msg = timePicked ? '' : 'Select a preferred time.';
    errors = errors.concat(showFieldError('time-err', document.getElementById('t-morning'), msg));

    return errors;
  }

  // Summary at the top of the form; focus moves here so it is announced
  function showErrorSummary(errors) {
    var messages = errors.map(function (e) { return e.message; });
    var count = errors.length;

    errorSummary.textContent = 'Please fix ' + count + ' error' + (count > 1 ? 's' : '') + ': ' + messages.join(' ');
    errorSummary.hidden = false;
    errorSummary.focus();
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    successMessage.hidden = true;

    var errors = validateForm();

    if (errors.length > 0) {
      showErrorSummary(errors);
    } else {
      errorSummary.hidden = true;
      successMessage.hidden = false;
      form.reset();
    }
  });
})();
