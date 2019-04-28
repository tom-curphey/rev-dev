import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SelectInput from '../../utils/input/SelectInput';

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
      // console.log('selectedIngredient: ', selectedIngredient);
      let selectedValue = {
        label: selectedIngredient.displayName,
        value: selectedIngredient._id
      };
      this.setState({ selectedValue: selectedValue });
      // this.updateSelectedValue(
      //   this.props.ingredient.selectedIngredient
      // );
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.ingredient.selectedIngredient !== null &&
      prevProps.ingredient.selectedIngredient !==
        this.props.ingredient.selectedIngredient
    ) {
      const { selectedIngredient } = this.props.ingredient;
      // console.log('selectedIngredient: ', selectedIngredient);
      let selectedValue = {
        label: selectedIngredient.displayName,
        value: selectedIngredient._id
      };
      this.setState({ selectedValue: selectedValue });
      // this.updateSelectedValue(
      //   this.props.ingredient.selectedIngredient
      // );
    }
  }

  getSelectedValue = selectedValue => {
    let addIngredient = false;
    let selectIngredient = [];
    if (selectedValue.__isNew__) {
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

  checkFocus = () => {
    this.props.searchIngredientClicked();
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
          checkFocus={this.checkFocus}
        />
      );
    }
    return (
      <React.Fragment>{formContent && formContent}</React.Fragment>
    );
  }
}

const mapState = state => ({
  ingredient: state.ingredient
});

SelectIngredient.propTypes = {
  ingredient: PropTypes.object.isRequired,
  getSelectedIngredient: PropTypes.func.isRequired,
  searchIngredientClicked: PropTypes.func.isRequired
};

export default connect(mapState)(SelectIngredient);
