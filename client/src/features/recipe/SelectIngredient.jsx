import React, { Component } from 'react';
import { connect } from 'react-redux';
import CreatableSelectInput from '../../utils/input/CreatableSelectInput';

class SelectIngredient extends Component {
  state = {
    selectedValue: {
      label: 'Select Ingredient',
      value: 'no-ingredient-selected'
    }
  };

  componentDidMount() {}

  getSelectedValue = selectedValue => {
    console.log('sV: ', selectedValue);
    let addNewIngredient = false;
    let selectedIngredient = [];

    if (selectedValue.__isNew__) {
      addNewIngredient = true;
      const newIngredient = {};
      newIngredient.displayName = selectedValue.label;
      newIngredient.new = true;
      selectedIngredient.push(newIngredient);
    } else {
      selectedIngredient = this.props.ingredients.filter(
        ingredient => {
          return ingredient._id === selectedValue.value;
        }
      );
    }
    selectedIngredient[0].quantity = '';
    selectedIngredient[0].metric = '';
    selectedIngredient[0].grams = '';

    this.props.getSelectedIngredient(
      selectedIngredient[0],
      addNewIngredient
    );
  };

  render() {
    const { ingredients } = this.props;
    const { selectedValue } = this.state;

    let content = '';

    if (ingredients !== null || ingredients.length > 0) {
      const options = ingredients.map(ingredient => {
        let selectData = {};
        selectData.label = ingredient.displayName;
        selectData.value = ingredient._id;
        return selectData;
      });

      content = (
        <CreatableSelectInput
          label="Search Ingredient"
          value={selectedValue}
          name="ingredient"
          options={options}
          getSelectedValue={this.getSelectedValue}
        />
      );
    }
    return <div>{content && content}</div>;
  }
}

const mapState = state => ({
  ingredients: state.ingredient.ingredients
});

export default connect(mapState)(SelectIngredient);
