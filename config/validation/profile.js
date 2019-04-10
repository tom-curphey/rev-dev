const Validator = require('validator');
const isEmpty = require('../validation/is.empty');

module.exports = function validateProfileInput(data) {
  let errors = {};

  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
  data.mobile = !isEmpty(data.mobile) ? data.mobile : '';
  data.position = !isEmpty(data.position) ? data.position : '';

  if (Validator.isEmpty(data.firstName)) {
    errors.firstName = 'Please let us know your First Name';
  }
  if (Validator.isEmpty(data.lastName)) {
    errors.lastName = 'Please let us know your Last Name';
  }
  if (Validator.isEmpty(data.position)) {
    errors.position = 'What is your job position?';
  }
  if (Validator.isEmpty(data.mobile)) {
    errors.mobile =
      'Your mobile is required as we will use your mobile for to verify your account';
  }
  if (!isEmpty(data.mobile)) {
    if (!Validator.isNumeric(data.mobile)) {
      errors.mobile = 'Your mobile must be a number..';
    }
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
