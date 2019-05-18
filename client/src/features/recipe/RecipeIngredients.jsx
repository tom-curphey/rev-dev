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
    const { name, id } = e.target;

    let index = id;
    let value = e.target.value;
    // console.log('dataindex', dataindex);
    // console.log('value', value);
    // console.log('target', e.target.id);

    let valueCheck = true;
    if (name === 'quantity') {
      // console.log('value: ', value);
      if (value === '') {
        valueCheck = false;
      } else {
        value = Number(value);
        // console.log('value: ', value);
      }
    }

    // console.log('state..', this.state.recipeIngredients);

    let key = id;
    // this.state.recipeIngredients
    //   .map(rI => {
    //     console.log('rI', rI.ingredient._id);

    //     return rI.ingredient._id;
    //   })
    //   .indexOf(e.target.id);

    // console.log('KEY', key);

    let stateCopy = Object.assign({}, this.state);
    stateCopy.recipeIngredients = stateCopy.recipeIngredients.slice();
    stateCopy.recipeIngredients[key] = Object.assign(
      {},
      stateCopy.recipeIngredients[key]
    );

    // console.log('STATE COPY: ', stateCopy.recipeIngredients[key]);
    stateCopy.recipeIngredients[key][`${name}`] = value;
    // console.log('STATE COPY: ', stateCopy.recipeIngredients[key]);

    if (
      valueCheck &&
      stateCopy.recipeIngredients[key].quantity > 0 &&
      stateCopy.recipeIngredients[key].metric !== ''
    ) {
      // console.log('Q: ', stateCopy.recipeIngredients[key].quantity);
      // console.log(
      //   'Metrix: ',
      //   `${stateCopy.recipeIngredients[key].metric}`
      // );
      // console.log('metricName: ', stateCopy.recipeIngredients[key]);
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

    // console.log('value', value);
    // console.log('key', key);

    if (name === 'quantity') {
      if (isNaN(value)) {
        stateCopy.recipeIngredients[key].quantity = '';
      } else {
        let checkDecimal = e.target.value.search(/\./);
        // console.log('checkDecimal: ', checkDecimal);
        if (checkDecimal === 1) {
          stateCopy.recipeIngredients[key].quantity = e.target.value;
        }
      }
    }

    // console.log('stateCopy: ', stateCopy.recipeIngredients[0]);

    this.setState(stateCopy);
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
    const recipeData = this.props.recipe.selectedRecipe;
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
    }

    // console.log('recipeData: ', recipeData);

    this.props.editRecipe(
      recipeData,
      this.props.profile,
      this.props.history,
      exit
    );
  };

  render() {
    const { selectedRecipe, loading } = this.props.recipe;
    const { ingredients } = this.props.ingredient;
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
