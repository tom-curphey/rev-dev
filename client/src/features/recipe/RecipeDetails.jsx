import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { editRecipe } from './recipeActions';
import Spinner from '../../utils/spinner/Spinner';
import TextInput from '../../utils/input/TextInput';
import SelectInput from '../../utils/input/SelectInput';
import { withRouter } from 'react-router';

class RecipeDetails extends Component {
  state = {
    selectedRecipe: {
      displayName: '',
      serves: '',
      salePricePerServe: '',
      staffTime: '',
      totalCookingTime: '',
      expectedSalesPerDay: '',
      internalRecipe: false
    },
    errors: {}
  };

  componentDidMount() {
    if (this.props.recipe.selectedRecipe) {
      this.setState({
        selectedRecipe: this.props.recipe.selectedRecipe
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    // console.log('prevProps: ', prevProps.recipe);
    // console.log('this.props: ', this.props.recipe);

    if (
      prevProps.recipe.selectedRecipe !==
      this.props.recipe.selectedRecipe
    ) {
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

    const updatedRecipe = {};
    updatedRecipe._id = this.state.selectedRecipe._id;
    updatedRecipe.venue = this.props.venue.venue._id;
    updatedRecipe.displayName = this.state.selectedRecipe.displayName;
    updatedRecipe.serves = this.state.selectedRecipe.serves;
    updatedRecipe.salePricePerServe = this.state.selectedRecipe.salePricePerServe;
    updatedRecipe.staffTime = this.state.selectedRecipe.staffTime;
    updatedRecipe.totalCookingTime = this.state.selectedRecipe.totalCookingTime;
    updatedRecipe.expectedSalesPerDay = this.state.selectedRecipe.expectedSalesPerDay;
    updatedRecipe.internalRecipe = this.state.selectedRecipe.internalRecipe;

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
      totalCookingTime,
      expectedSalesPerDay,
      internalRecipe
    } = this.state.selectedRecipe;

    // Select options for status
    const options = [
      { label: 'No', value: false },
      { label: 'Yes', value: true }
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
              value={staffTime}
              onChange={this.handleOnChange}
              label="Staff Input Time"
              error={errors.staffTime}
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
