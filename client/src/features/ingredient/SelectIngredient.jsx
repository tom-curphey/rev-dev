import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SelectInput from '../../utils/input/SelectInput';
import { removeSelectedIngredient } from './ingredientActions';

class SelectIngredient extends Component {
  state = {
    selectedValue: {
      label: 'Select Ingredient',
      value: 'no-ingredient-selected'
    }
  };

  componentDidMount() {
    if (this.props.ingredient.selectedIngredient !== null) {
      const { selectedIngredient } = this.props.ingredient;
      let selectedValue = {
        label: selectedIngredient.displayName,
        value: selectedIngredient._id
      };
      this.setState({ selectedValue: selectedValue });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.ingredient.selectedIngredient !== null &&
      prevProps.ingredient.selectedIngredient !==
        this.props.ingredient.selectedIngredient
    ) {
      const { selectedIngredient } = this.props.ingredient;
      let selectedValue = {
        label: selectedIngredient.displayName,
        value: selectedIngredient._id
      };
      this.setState({ selectedValue: selectedValue });
    }

    if (
      prevProps.ingredient.openIngredientPanel !==
      this.props.ingredient.openIngredientPanel
    ) {
      if (
        this.props.ingredient.openIngredientPanel === false &&
        this.props.ingredient.selectedIngredient === null
      ) {
        this.setState({
          selectedValue: {
            label: 'Select Ingredient',
            value: 'no-ingredient-selected'
          }
        });
      }
    }
  }

  getSelectedValue = selectedValue => {
    let addIngredient = false;
    let selectIngredient = [];
    if (selectedValue.__isNew__) {
      this.props.removeSelectedIngredient();
      addIngredient = true;
      const newIngredient = {};
      newIngredient.displayName = selectedValue.label;
      newIngredient.new = true;
      selectIngredient.push(newIngredient);
    } else {
      selectIngredient = this.props.ingredient.ingredients.filter(
        ingredient => {
          return ingredient._id === selectedValue.value;
        }
      );
    }
    this.props.getSelectedIngredient(
      selectIngredient[0],
      addIngredient
    );
  };

  render() {
    const { ingredients } = this.props.ingredient;
    const { selectedValue } = this.state;

    let formContent = '';

    if (ingredients !== null) {
      const options = ingredients.map(ingredient => {
        let selectData = {};
        selectData.label = ingredient.displayName;
        selectData.value = ingredient._id;
        return selectData;
      });

      formContent = (
        <SelectInput
          label="Search Ingredient"
          value={selectedValue}
          name="ingredient"
          options={options}
          getSelectedValue={this.getSelectedValue}
        />
      );
    }
    return (
      <React.Fragment>{formContent && formContent}</React.Fragment>
    );
  }
}

const actions = {
  removeSelectedIngredient
};

const mapState = state => ({
  ingredient: state.ingredient
});

SelectIngredient.propTypes = {
  ingredient: PropTypes.object.isRequired,
  getSelectedIngredient: PropTypes.func.isRequired,
  removeSelectedIngredient: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(SelectIngredient);
