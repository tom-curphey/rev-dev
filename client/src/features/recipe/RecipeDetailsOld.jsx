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
      expectedSalesPerDay: '',
      internalRecipe: false,
      ingredients: []
    },
    errors: {}
  };

  componentDidMount() {
    console.log(
      'MOUNTED this.props: ',
      this.props.recipe.selectedRecipe
    );
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

    console.log('prevProps: ', prevProps.recipe.selectedRecipe);
    console.log('this.props: ', this.props.recipe.selectedRecipe);

    if (
      prevProps.recipe.selectedRecipe !==
      this.props.recipe.selectedRecipe
    ) {
      if (this.props.recipe.selectedRecipe.staffTime !== '') {
        this.props.recipe.selectedRecipe.staffTime = calcSecondsIntoTime(
          this.props.recipe.selectedRecipe.staffTime,
          this.props.recipe.selectedRecipe.staffTimeUnit
        );
      } else {
        this.props.recipe.selectedRecipe.staffTime = this.props.recipe.selectedRecipe.staffTime;
      }
      if (this.props.recipe.selectedRecipe.totalCookingTime !== '') {
        this.props.recipe.selectedRecipe.totalCookingTime = calcSecondsIntoTime(
          this.props.recipe.selectedRecipe.totalCookingTime,
          this.props.recipe.selectedRecipe.cookingTimeUnit
        );
      } else {
        this.props.recipe.selectedRecipe.totalCookingTime = this.props.recipe.selectedRecipe.totalCookingTime;
      }

      this.setState({
        selectedRecipe: this.props.recipe.selectedRecipe
      });
    }
  }

  handleOnChange = e => {
    e.persist();
    this.setState(prevState => ({
      selectedRecipe: {
        ...prevState.selectedRecipe,
        [e.target.name]: e.target.value
      }
    }));
  };

  handleOnSubmit = exit => e => {
    e.preventDefault();

    // const updatedRecipe = {};
    // updatedRecipe._id = this.state.selectedRecipe._id;
    // updatedRecipe.venue = this.props.venue.venue._id;
    // updatedRecipe.displayName = this.state.selectedRecipe.displayName;
    // updatedRecipe.serves = this.state.selectedRecipe.serves;
    // updatedRecipe.salePricePerServe = this.state.selectedRecipe.salePricePerServe;
    // updatedRecipe.staffTimeUnit = this.state.selectedRecipe.staffTimeUnit;
    // updatedRecipe.cookingTimeUnit = this.state.selectedRecipe.cookingTimeUnit;
    // updatedRecipe.expectedSalesPerDay = this.state.selectedRecipe.expectedSalesPerDay;
    // updatedRecipe.internalRecipe = this.state.selectedRecipe.internalRecipe;
    const updatedRecipe = {
      _id: this.state.selectedRecipe._id,
      venue: this.state.selectedRecipe.venue,
      displayName: this.state.selectedRecipe.displayName,
      serves: this.state.selectedRecipe.serves,
      salePricePerServe: this.state.selectedRecipe.salePricePerServe,
      staffTimeUnit: this.state.selectedRecipe.staffTimeUnit,
      cookingTimeUnit: this.state.selectedRecipe.cookingTimeUnit,
      expectedSalesPerDay: this.state.selectedRecipe
        .expectedSalesPerDay,
      internalRecipe: this.state.selectedRecipe.internalRecipe
    };

    console.log(
      'this.state.staffTime',
      this.state.selectedRecipe.staffTime
    );
    console.log('this.state.staffTime', this.state);

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

    console.log('updatedRecipe: ', updatedRecipe);
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
      expectedSalesPerDay,
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
            <TextInput
              placeholder="How much time do staff spend creating the recipe"
              name="staffTime"
              type="text"
              value={staffTime.toString()}
              onChange={this.handleOnChange}
              label="Staff Input Time"
              error={errors.staffTime}
            />
            <SelectInput
              label="Staff Time Unit"
              name="staffTimeUnit"
              options={timeOptions}
              value={staffTimeUnit}
              onChange={this.handleOnChange}
            />
            <TextInput
              placeholder="How long does the total recipe take to make?"
              name="totalCookingTime"
              type="text"
              value={totalCookingTime.toString()}
              onChange={this.handleOnChange}
              label="Total Recipe Production Time"
              error={errors.totalCookingTime}
            />
            <SelectInput
              label="Cooking Time Unit"
              name="cookingTimeUnit"
              options={timeOptions}
              value={cookingTimeUnit}
              onChange={this.handleOnChange}
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
