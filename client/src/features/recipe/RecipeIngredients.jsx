import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import PropTypes from 'prop-types';
import { editRecipe } from './recipeActions';
import Spinner from '../../utils/spinner/Spinner';
import SelectIngredient from './SelectIngredient';
import RecipeIngredientForm from './RecipeIngredientForm';

class RecipeIngredients extends Component {
  state = {
    recipeIngredients: []
  };

  componentDidMount() {
    if (
      this.props.recipe.selectedRecipe !== null &&
      this.props.recipe.selectedRecipe.ingredients.length !== 0
    ) {
      this.setState({
        recipeIngredients: this.props.recipe.selectedRecipe
          .ingredients
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    // console.log('prevProps: ', prevProps.recipe.selectedRecipe);
    // console.log('this.props: ', this.props.recipe.selectedRecipe);

    if (
      prevProps.recipe.selectedRecipe !==
      this.props.recipe.selectedRecipe
    ) {
      this.setState({
        recipeIngredients: this.props.recipe.selectedRecipe
          .ingredients
      });
    }
  }

  getSelectedIngredient = (selectedIngredient, addIngredient) => {
    if (addIngredient) {
      // this.props.openAddIngredientPanel(selectedIngredient);
      console.log('New Ingredient');
    } else {
      const selectedIngredientData = {};
      selectedIngredientData.ingredient = {};

      selectedIngredientData.ingredient._id = selectedIngredient._id;
      selectedIngredientData.ingredient.displayName =
        selectedIngredient.displayName;
      selectedIngredientData.ingredient.metrics =
        selectedIngredient.metrics;
      selectedIngredientData.quantity = '';
      selectedIngredientData.metric = 'grams';
      selectedIngredientData.grams = '';
      selectedIngredientData.new = true;

      this.setState({
        recipeIngredients: [
          ...this.state.recipeIngredients,
          selectedIngredientData
        ]
      });
    }
  };

  handleOnChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    if (name === 'quantity') {
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
              [name]: value
            }
          }));
        }
      } else {
        this.setState(prevState => ({
          selectedRecipe: {
            ...prevState.selectedRecipe,
            [name]: value
          }
        }));
      }
    }
  };

  handleOnChange = e => {
    const { name, id, value } = e.target;
    let valueCheck = true;
    let key = id;

    let stateCopy = Object.assign({}, this.state);
    stateCopy.recipeIngredients = stateCopy.recipeIngredients.slice();
    stateCopy.recipeIngredients[key] = Object.assign(
      {},
      stateCopy.recipeIngredients[key]
    );

    stateCopy.recipeIngredients[key][`${name}`] = value;

    if (
      valueCheck &&
      stateCopy.recipeIngredients[key].quantity > 0 &&
      stateCopy.recipeIngredients[key].metric !== ''
    ) {
      let metricGrams = 0;
      switch (stateCopy.recipeIngredients[key].metric) {
        case 'cup':
          metricGrams =
            stateCopy.recipeIngredients[key].ingredient.metrics.cup;
          break;
        case 'grams':
          metricGrams = 1;
          break;
        case 'tablespoon':
          metricGrams =
            stateCopy.recipeIngredients[key].ingredient.metrics
              .tablespoon;
          break;
        case 'teaspoon':
          metricGrams =
            stateCopy.recipeIngredients[key].ingredient.metrics
              .teaspoon;
          break;
        case 'whole':
          metricGrams =
            stateCopy.recipeIngredients[key].ingredient.metrics.whole;
          break;
        default:
          metricGrams = 1;
      }

      // console.log('metricGrams', metricGrams);

      stateCopy.recipeIngredients[key].grams =
        stateCopy.recipeIngredients[key].quantity * metricGrams;
    } else {
      stateCopy.recipeIngredients[key].grams = '';
    }

    console.log('value', value);
    // console.log('key', key);

    if (name === 'quantity') {
      if (!isNaN(value)) {
        stateCopy.recipeIngredients[key].quantity = e.target.value;
        this.setState(stateCopy);
      }
      if (value === '.') {
        stateCopy.recipeIngredients[key].quantity = '0.';
        this.setState(stateCopy);
      }
    } else {
      this.setState(stateCopy);
    }

    // console.log('stateCopy: ', stateCopy.recipeIngredients[0]);
  };

  handleDeleteRecipeIngredient = rowID => e => {
    // console.log('ROWID: ', rowID);
    this.setState({
      recipeIngredients: this.state.recipeIngredients.filter(
        (_, i) => i !== rowID
      )
    });
  };

  handleOnSubmit = exit => e => {
    e.preventDefault();
    const recipeData = { ...this.props.recipe.selectedRecipe };
    if (this.state.recipeIngredients.length > 0) {
      const recipeIngredientDataCorrectFormat = this.state.recipeIngredients.map(
        ingredient => {
          // console.log('Submitted: ', ingredient);

          let updatedRecipeIngredient = {};
          updatedRecipeIngredient.ingredient =
            ingredient.ingredient._id;
          updatedRecipeIngredient.quantity = ingredient.quantity;
          updatedRecipeIngredient.metric = ingredient.metric;
          updatedRecipeIngredient.grams = ingredient.grams;

          return updatedRecipeIngredient;
        }
      );

      recipeData.ingredients = recipeIngredientDataCorrectFormat;
    } else {
      recipeData.ingredients = [];
    }

    console.log('recipeData: ', recipeData);

    this.props.editRecipe(
      recipeData,
      this.props.profile,
      this.props.history,
      exit
    );
  };

  render() {
    const { selectedRecipe, loading } = this.props.recipe;
    // const { ingredients } = this.props.ingredient;
    const { recipeIngredients } = this.state;
    const { errors } = this.props;

    // console.log('RENDER STATE', this.state.recipeIngredients);

    let recipeIngredientContent;
    if (loading === true || selectedRecipe === null) {
      recipeIngredientContent = <Spinner />;
    } else {
      recipeIngredientContent = (
        <React.Fragment>
          <section className="recipeIngredientsHeader">
            <div>Edit</div>
            <div>Ingredients</div>
            <div>Quantity</div>
            <div>Metric</div>
            <div>Grams</div>
            <div>del</div>
          </section>
          <section className="recipeIngredientForm">
            {recipeIngredients.length > 0 && (
              <RecipeIngredientForm
                recipeIngredients={recipeIngredients}
                errors={errors}
                handleOnChange={this.handleOnChange}
                handleDeleteRecipeIngredient={
                  this.handleDeleteRecipeIngredient
                }
              />
            )}
            <SelectIngredient
              getSelectedIngredient={this.getSelectedIngredient}
            />
          </section>
        </React.Fragment>
      );
    }

    return (
      <section className="recipeIngredients">
        {recipeIngredientContent}
        <button onClick={this.handleOnSubmit(true)} type="button">
          Save & Close Recipe
        </button>
        <button onClick={this.handleOnSubmit(false)} type="button">
          Save Recipe
        </button>
      </section>
    );
  }
}

const actions = {
  editRecipe
};

const mapState = state => ({
  recipe: state.recipe,
  ingredient: state.ingredient,
  profile: state.profile.profile,
  errors: state.errors
});

RecipeIngredients.propTypes = {
  recipe: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  ingredient: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  editRecipe: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(withRouter(RecipeIngredients));
