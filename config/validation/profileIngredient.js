const Validator = require('validator');
const isEmpty = require('./is.empty');

module.exports = function validateProfileIngredientSupplierInput(
  data
) {
  let errors = {};

  // console.log('Check data: ', data);
  data.ingredient_id = !isEmpty(data.ingredient_id)
    ? data.ingredient_id
    : '';
  data.supplier_id = !isEmpty(data.supplier_id)
    ? data.supplier_id
    : '';
  data.packageCost = !isEmpty(data.packageCost)
    ? data.packageCost
    : '';
  data.packageGrams = !isEmpty(data.packageGrams)
    ? data.packageGrams
    : '';

  if (Validator.isEmpty(data.ingredient_id)) {
    errors.ingredient_id =
      'You have not selected an ingredient to add to your account..';
  }
  if (Validator.isEmpty(data.supplier_id)) {
    errors.supplier_id = 'Please select a supplier';
  }
  if (Validator.isEmpty(data.packageCost)) {
    errors.packageCost = 'Supplier package cost is required';
  }
  if (Validator.isEmpty(data.packageGrams)) {
    errors.packageGrams = 'Supplier package grams is required';
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
