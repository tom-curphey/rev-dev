const Validator = require('validator');
const isEmpty = require('../validation/is.empty');

module.exports = function validateRegisterInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';
  data.passwordMatch = !isEmpty(data.passwordMatch)
    ? data.passwordMatch
    : '';

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 & 30 characters';
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = 'Name is required';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
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

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
