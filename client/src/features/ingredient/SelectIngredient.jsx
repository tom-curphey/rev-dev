import React from 'react';
import PropTypes from 'prop-types';
import SelectInput from '../../utils/input/SelectInput';

const SelectIngredient = ({
  ingredients,
  selectedIngredient,
  getSelectedIngredient,
  searchIngredientClicked
}) => {
  const getSelectedValue = selectedValue => {
    const selectIngredient = ingredients.filter(ingredient => {
      return ingredient._id === selectedValue.value;
    });
    getSelectedIngredient(selectIngredient[0]);
  };

  const checkFocus = () => {
    searchIngredientClicked();
  };

  let formContent = '';

  if (ingredients !== null) {
    const options = ingredients.map(ingredient => {
      let selectData = {};
      selectData.label = ingredient.displayName;
      selectData.value = ingredient._id;
      return selectData;
    });

    console.log(selectedIngredient);

    let selectedOption = [
      {
        label: 'Select Ingredient',
        value: 'no-ingredient-selected'
      }
    ];
    if (selectedIngredient !== null) {
      selectedOption = options.filter(ingredientOption => {
        return ingredientOption.value === selectedIngredient._id;
      });
    }

    formContent = (
      <SelectInput
        label="Search Ingredient"
        value={selectedOption[0]}
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
  selectedIngredient: PropTypes.object,
  getSelectedIngredient: PropTypes.func.isRequired,
  searchIngredientClicked: PropTypes.func.isRequired
};

export default SelectIngredient;
