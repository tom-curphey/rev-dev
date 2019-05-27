import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { editRecipe } from './recipeActions';
import Spinner from '../../utils/spinner/Spinner';
import TextInput from '../../utils/input/TextInput';
import SelectInput from '../../utils/input/SelectInput';
// import calcTimeToSeconds from '../../utils/functions/calcTimeToSeconds';
import {
  calcTimeToSeconds,
  calcSecondsIntoTime
} from '../../utils/utilityFunctions';

class RecipeDetails extends Component {
  state = {
    selectedRecipe: {
      displayName: '',
      serves: '',
      salePricePerServe: '',
      staffTime: '',
      staffTimeUnit: '',
      totalCookingTime: '',
      cookingTimeUnit: '',
      expectedSales: '',
      internalRecipe: false,
      ingredients: []
    },
    errors: {}
  };

  componentDidMount() {
    if (this.props.recipe.selectedRecipe !== null) {
      const convertedRecipe = { ...this.props.recipe.selectedRecipe };

      if (this.props.recipe.selectedRecipe.staffTime !== '') {
        convertedRecipe.staffTime = calcSecondsIntoTime(
          this.props.recipe.selectedRecipe.staffTime,
          this.props.recipe.selectedRecipe.staffTimeUnit
        );
      } else {
        this.props.recipe.selectedRecipe.staffTime = this.props.recipe.selectedRecipe.staffTime;
      }
      if (this.props.recipe.selectedRecipe.totalCookingTime !== '') {
        convertedRecipe.totalCookingTime = calcSecondsIntoTime(
          this.props.recipe.selectedRecipe.totalCookingTime,
          this.props.recipe.selectedRecipe.cookingTimeUnit
        );
      } else {
        this.props.recipe.selectedRecipe.totalCookingTime = this.props.recipe.selectedRecipe.totalCookingTime;
      }

      this.setState({
        selectedRecipe: convertedRecipe
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    if (
      prevProps.recipe.selectedRecipe !==
      this.props.recipe.selectedRecipe
    ) {
      const convertedRecipe = { ...this.props.recipe.selectedRecipe };
      if (this.props.recipe.selectedRecipe.staffTime !== '') {
        convertedRecipe.staffTime = calcSecondsIntoTime(
          this.props.recipe.selectedRecipe.staffTime,
          this.props.recipe.selectedRecipe.staffTimeUnit
        );
      }
      if (this.props.recipe.selectedRecipe.totalCookingTime !== '') {
        convertedRecipe.totalCookingTime = calcSecondsIntoTime(
          this.props.recipe.selectedRecipe.totalCookingTime,
          this.props.recipe.selectedRecipe.cookingTimeUnit
        );
      }

      this.setState({
        selectedRecipe: convertedRecipe
      });
    }
  }

  handleOnChange = e => {
    e.persist();

    if (
      e.target.name === 'staffTime' ||
      e.target.name === 'totalCookingTime'
    ) {
      let value = e.target.value;
      // console.log('YES');
      if (value !== '') {
        if (!isNaN(value)) {
          let checkDecimal = value.search(/\./);
          // let checkDecimal = value.search(/^\d*\.?\d*$/);
          // let checkDecimal = value.search(/^\d+(\.\d{1,2})?$/);
          // console.log('checkDecimal: ', checkDecimal);
          if (checkDecimal !== -1) {
            value = e.target.value;
          }
          this.setState(prevState => ({
            selectedRecipe: {
              ...prevState.selectedRecipe,
              [e.target.name]: e.target.value
            }
          }));
        }
      } else {
        this.setState(prevState => ({
          selectedRecipe: {
            ...prevState.selectedRecipe,
            [e.target.name]: e.target.value
          }
        }));
      }
    } else {
      this.setState(prevState => ({
        selectedRecipe: {
          ...prevState.selectedRecipe,
          [e.target.name]: e.target.value
        }
      }));
    }
  };

  handleOnSubmit = exit => e => {
    e.preventDefault();

    const updatedRecipe = {
      _id: this.state.selectedRecipe._id,
      venue: this.state.selectedRecipe.venue,
      displayName: this.state.selectedRecipe.displayName,
      serves: this.state.selectedRecipe.serves,
      salePricePerServe: this.state.selectedRecipe.salePricePerServe,
      staffTimeUnit: this.state.selectedRecipe.staffTimeUnit,
      cookingTimeUnit: this.state.selectedRecipe.cookingTimeUnit,
      expectedSales: this.state.selectedRecipe.expectedSales,
      internalRecipe: this.state.selectedRecipe.internalRecipe,
      ingredients: this.state.selectedRecipe.ingredients
    };

    if (this.state.selectedRecipe.staffTime !== '') {
      updatedRecipe.staffTime = calcTimeToSeconds(
        this.state.selectedRecipe.staffTime,
        this.state.selectedRecipe.staffTimeUnit
      );
    } else {
      updatedRecipe.staffTime = this.state.selectedRecipe.staffTime;
    }
    if (this.state.selectedRecipe.totalCookingTime !== '') {
      updatedRecipe.totalCookingTime = calcTimeToSeconds(
        this.state.selectedRecipe.totalCookingTime,
        this.state.selectedRecipe.cookingTimeUnit
      );
    } else {
      updatedRecipe.totalCookingTime = this.state.selectedRecipe.totalCookingTime;
    }

    this.props.editRecipe(
      updatedRecipe,
      this.props.profile,
      this.props.history,
      exit
    );
  };

  render() {
    const { loading, selectedRecipe } = this.props.recipe;
    const { errors } = this.state;
    const {
      displayName,
      serves,
      salePricePerServe,
      staffTime,
      staffTimeUnit,
      totalCookingTime,
      cookingTimeUnit,
      expectedSales,
      internalRecipe
    } = this.state.selectedRecipe;

    // Select options for status
    const options = [
      { label: 'No', value: false },
      { label: 'Yes', value: true }
    ];

    const timeOptions = [
      { label: 'Sec', value: 'sec' },
      { label: 'Min', value: 'min' },
      { label: 'Hour', value: 'hour' }
    ];

    let recipeContent;
    if (loading === true || selectedRecipe === null) {
      recipeContent = <Spinner />;
    } else {
      recipeContent = (
        <section className="recipeDetails">
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
            <div className="textSelectWrapper">
              <TextInput
                name="staffTime"
                type="staffTime"
                value={staffTime.toString()}
                onChange={this.handleOnChange}
                label="Staff Time"
                error={errors.staffTime}
                labelClass="textSelect"
              />
              <SelectInput
                name="staffTimeUnit"
                value={staffTimeUnit}
                options={timeOptions}
                onChange={this.handleOnChange}
                labelClass="textSelectSelect"
              />
            </div>
            <div className="textSelectWrapper">
              <TextInput
                name="totalCookingTime"
                type="totalCookingTime"
                value={totalCookingTime.toString()}
                onChange={this.handleOnChange}
                label="Total Cooking Time"
                error={errors.totalCookingTime}
                labelClass="textSelect"
              />
              <SelectInput
                name="cookingTimeUnit"
                value={cookingTimeUnit}
                options={timeOptions}
                onChange={this.handleOnChange}
                labelClass="textSelectSelect"
              />
            </div>
            <TextInput
              placeholder="How many recipe serves will you sell per day?"
              name="expectedSales"
              type="text"
              value={expectedSales}
              onChange={this.handleOnChange}
              label="Expected Sales Per Week"
              error={errors.expectedSales}
            />
            <SelectInput
              // info="Is this recipe made internally to be added to other recipes?"
              name="internalRecipe"
              options={options}
              value={internalRecipe}
              onChange={this.handleOnChange}
              label="In House Recipe"
              error={errors.internalRecipe}
            />
          </form>
          <button onClick={this.handleOnSubmit(true)} type="button">
            Save & Close Recipe
          </button>
          <button onClick={this.handleOnSubmit(false)} type="button">
            Save Recipe
          </button>
        </section>
      );
    }

    return <section>{recipeContent}</section>;
  }
}

const actions = {
  editRecipe
};

const mapState = state => ({
  recipe: state.recipe,
  venue: state.venue,
  profile: state.profile.profile,
  errors: state.errors
});

RecipeDetails.propTypes = {
  recipe: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  editRecipe: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(withRouter(RecipeDetails));
