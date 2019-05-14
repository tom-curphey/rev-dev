const Validator = require('validator');
const isEmpty = require('../validation/is.empty');

module.exports = function validateSupplierInput(data) {
  let errors = {};

  console.log('Check Data: ', data);
  data.displayName = !isEmpty(data.displayName)
    ? data.displayName
    : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';
  data.address = !isEmpty(data.address) ? data.address : '';

  if (Validator.isEmpty(data.displayName)) {
    errors.displayName = 'Supplier name is required';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Supplier email is required';
  }
  if (Validator.isEmpty(data.phone)) {
    errors.phone = 'Supplier phone is required';
  }
  if (Validator.isEmpty(data.address)) {
    errors.address = 'Supplier address is required';
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
