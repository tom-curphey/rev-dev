const Validator = require('validator');
const isEmpty = require('../validation/is.empty');

module.exports = function validateRecipeInput(data) {
  let errors = {};

  console.log('data: ', data);

  data.displayName = !isEmpty(data.displayName)
    ? data.displayName
    : '';
  data.serves = !isEmpty(data.serves) ? data.serves : '';

  if (Validator.isEmpty(data.displayName)) {
    errors.displayName = 'Name is required';
  }
  if (Validator.isEmpty(data.serves)) {
    errors.serves = 'Recipe serves is required';
  } else {
    console.log('Here..');
    if (!Validator.isNumeric(data.serves)) {
      console.log('Here..');
      errors.serves = 'Recipe serves need to be a number';
    }
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
