const Validator = require('validator');
const isEmpty = require('../validation/is.empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.passwordMatch = !isEmpty(data.passwordMatch)
    ? data.passwordMatch
    : '';

  data.firstName = !isEmpty(data.firstName) ? data.firstName : '';
  data.lastName = !isEmpty(data.lastName) ? data.lastName : '';
  data.mobile = !isEmpty(data.mobile) ? data.mobile : '';
  data.position = !isEmpty(data.position) ? data.position : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }
  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password is required';
  }
  if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
    errors.password = 'Password must be between 6 & 30 characters';
  }
  if (Validator.isEmpty(data.passwordMatch)) {
    errors.passwordMatch = 'Confirm password is required';
  }
  if (!Validator.equals(data.password, data.passwordMatch)) {
    errors.passwordMatch = 'Passwords need to match';
  }

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
