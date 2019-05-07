import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInput from '../../utils/input/TextInput';
import SelectInput from '../../utils/input/SelectInput';
import { addRecipe } from './recipeActions';

class AddRecipe extends Component {
  state = {
    displayName: '',
    serves: '',
    salePricePerServe: '',
    staffTimeInSeconds: '',
    totalCookingTime: '',
    expectedSalesPerDay: '',
    internalRecipe: false,
    errors: {}
  };

  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.errors) {
  //     this.setState({ errors: nextProps.errors });
  //   }
  // }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  handleOnChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOnSubmit = e => {
    e.preventDefault();
    const recipeData = {
      displayName: this.state.displayName,
      serves: this.state.serves,
      salePricePerServe: this.state.salePricePerServe,
      staffTimeInSeconds: this.state.staffTimeInSeconds,
      totalCookingTime: this.state.totalCookingTime,
      expectedSalesPerDay: this.state.expectedSalesPerDay,
      internalRecipe: this.state.internalRecipe
    };

    this.props.addRecipe(recipeData);
  };

  render() {
    const {
      displayName,
      serves,
      salePricePerServe,
      staffTimeInSeconds,
      totalCookingTime,
      expectedSalesPerDay,
      internalRecipe,
      errors
    } = this.state;

    // Select options for status
    const options = [
      { label: 'No', value: false },
      { label: 'Yes', value: true }
    ];

    return (
      <section className="recipe">
        <h1>Add Recipe Details</h1>
        <form onSubmit={this.handleOnSubmit}>
          <TextInput
            placeholder="Please provide your Recipe Name"
            name="displayName"
            type="text"
            value={displayName}
            onChange={this.handleOnChange}
            label="Recipe Name"
            error={errors.displayName}
          />
          <TextInput
            placeholder="How many serves does the recipe make?"
            name="serves"
            type="text"
            value={serves}
            onChange={this.handleOnChange}
            label="Recipe serves"
            error={errors.serves}
          />
          <TextInput
            placeholder="How much will you sell the recipe for per serve"
            name="salePricePerServe"
            type="text"
            value={salePricePerServe}
            onChange={this.handleOnChange}
            label="Sales Price Per Serve"
            error={errors.salePricePerServe}
          />
          <TextInput
            placeholder="How much time do staff spend creating the recipe"
            name="staffTimeInSeconds"
            type="text"
            value={staffTimeInSeconds}
            onChange={this.handleOnChange}
            label="Staff Input In Minutes"
            error={errors.staffTimeInSeconds}
          />
          <TextInput
            placeholder="How long does the total recipe take to make?"
            name="totalCookingTime"
            type="text"
            value={totalCookingTime}
            onChange={this.handleOnChange}
            label="Total Recipe Production Time"
            error={errors.totalCookingTime}
          />
          <TextInput
            placeholder="How many recipe serves will you sell per day?"
            name="expectedSalesPerDay"
            type="text"
            value={expectedSalesPerDay}
            onChange={this.handleOnChange}
            label="Expected Sales Per Day"
            error={errors.expectedSalesPerDay}
          />
          <SelectInput
            // info="Is this recipe made internally to be added to other recipes?"
            name="internalRecipe"
            options={options}
            value={internalRecipe}
            onChange={this.handleOnChange}
            label="Internal Recipe"
            error={errors.internalRecipe}
          />
        </form>
        <button onClick={this.handleOnSubmit} type="button">
          + Add Recipe
        </button>
      </section>
    );
  }
}

const actions = {
  addRecipe
};

const mapState = state => ({
  errors: state.errors
});

AddRecipe.propTypes = {
  errors: PropTypes.object.isRequired,
  addRecipe: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(AddRecipe);
