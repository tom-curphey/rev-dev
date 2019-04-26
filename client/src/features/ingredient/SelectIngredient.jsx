import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SelectInput from '../../utils/input/SelectInput';

const SelectIngredient = ({
  getSelectedIngredient,
  ingredients,
  searchIngredientClicked
}) => {
  console.log('this.props.ingredients -->', ingredients);

  const getSelectedValue = selectedValue => {
    console.log('getSelectedValue -->', selectedValue);
    console.log('getSelectedValue -->', ingredients);

    const selectIngredient = ingredients.filter(ingredient => {
      return ingredient._id === selectedValue.value;
    });
    console.log('getSelectedValue -->', selectIngredient);
    getSelectedIngredient(selectIngredient[0]);
  };

  const checkFocus = () => {
    searchIngredientClicked();
  };

  let formContent = '';

  if (ingredients !== null) {
    console.log('Before options', ingredients);

    const options = ingredients.map(ingredient => {
      let selectData = {};
      selectData.label = ingredient.displayName;
      selectData.value = ingredient._id;
      return selectData;
    });

    console.log('options: ', options);

    formContent = (
      <SelectInput
        label="Search Ingredient"
        name="ingredient"
        options={options}
        getSelectedValue={getSelectedValue}
        checkFocus={checkFocus}
      />
    );
  }

  return (
    <React.Fragment>{formContent && formContent}</React.Fragment>
  );
};

SelectIngredient.propTypes = {
  ingredients: PropTypes.array.isRequired,
  getSelectedIngredient: PropTypes.func.isRequired,
  searchIngredientClicked: PropTypes.func.isRequired
};

export default SelectIngredient;
