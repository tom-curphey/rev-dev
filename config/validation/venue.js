const Validator = require('validator');
const isEmpty = require('../validation/is.empty');

module.exports = function validateVenueInput(data) {
  let errors = {};

  data.displayName = !isEmpty(data.displayName)
    ? data.displayName
    : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.address = !isEmpty(data.address) ? data.address : '';
  data.phone = !isEmpty(data.phone) ? data.phone : '';

  if (Validator.isEmpty(data.displayName)) {
    errors.displayName = 'Venue name is required';
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email is required';
  }
  if (Validator.isEmpty(data.phone)) {
    errors.phone = 'Phone is required';
  }
  if (Validator.isEmpty(data.address)) {
    errors.address = 'Address is required';
  }
  if (!isEmpty(data.website)) {
    if (!Validator.isURL(data.website)) {
      errors.website = 'Not a valid URL';
    }
  }
  if (!isEmpty(data.chefCost)) {
    if (!Validator.isNumeric(data.chefCost)) {
      errors.chefCost = 'Chef pay per hour must be a number';
    }
  }
  if (!isEmpty(data.rentCost)) {
    if (!Validator.isNumeric(data.rentCost)) {
      errors.rentCost = 'Rent cost per month must be a number';
    }
  }
  if (!isEmpty(data.waterCost)) {
    if (!Validator.isNumeric(data.waterCost)) {
      errors.waterCost = 'Water cost per month must be a number';
    }
  }
  if (!isEmpty(data.powerCost)) {
    if (!Validator.isNumeric(data.powerCost)) {
      errors.powerCost = 'Power cost per month must be a number';
    }
  }
  if (!isEmpty(data.insuranceCost)) {
    if (!Validator.isNumeric(data.insuranceCost)) {
      errors.insuranceCost =
        'Insurance cost per year must be a number';
    }
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
