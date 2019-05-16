import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
      this.setState({
        recipeIngredients: [
          ...this.state.recipeIngredients,
          selectedIngredient
        ]
      });
    }
  };

  handleOnChange = e => {
    const { name } = e.target;
    let { value } = e.target;
    let valueCheck = true;
    if (name === 'quantity') {
      console.log('value: ', value);
      if (value === '') {
        valueCheck = false;
      } else {
        value = Number(value);
        console.log('value: ', value);
      }
    }

    console.log('id', e.target.id);

    let key = this.state.recipeIngredients
      .map(rI => {
        return rI._id;
      })
      .indexOf(e.target.id);

    console.log('KEY', key);

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
      console.log('Q: ', stateCopy.recipeIngredients[key].quantity);
      console.log(
        'M: ',
        `${stateCopy.recipeIngredients[key].metric}`
      );
      console.log(
        'metricName: ',
        stateCopy.recipeIngredients[key].metrics[`cup`]
      );
      let metricGrams = 0;
      switch (stateCopy.recipeIngredients[key].metric) {
        case 'cup':
          metricGrams = stateCopy.recipeIngredients[key].metrics.cup;
          break;
        case 'grams':
          metricGrams = 1;
          break;
        case 'tablespoon':
          metricGrams =
            stateCopy.recipeIngredients[key].metrics.tablespoon;
          break;
        case 'teaspoon':
          metricGrams =
            stateCopy.recipeIngredients[key].metrics.teaspoon;
          break;
        case 'whole':
          metricGrams =
            stateCopy.recipeIngredients[key].metrics.whole;
          break;
        default:
          metricGrams = 1;
      }

      stateCopy.recipeIngredients[key].grams =
        stateCopy.recipeIngredients[key].quantity * metricGrams;
    } else {
      stateCopy.recipeIngredients[key].grams = '';
    }

    console.log('value', value);

    if (name === 'quantity') {
      if (isNaN(value)) {
        stateCopy.recipeIngredients[key].quantity = '';
      } else {
        let checkDecimal = e.target.value.search(/\./);
        console.log('checkDecimal: ', checkDecimal);
        if (checkDecimal === 1) {
          stateCopy.recipeIngredients[key].quantity = e.target.value;
        }
      }
    }

    console.log('stateCopy: ', stateCopy.recipeIngredients[0]);

    this.setState(stateCopy);
  };

  render() {
    const { selectedRecipe, loading } = this.props.recipe;
    const { ingredients } = this.props.ingredient;
    const { recipeIngredients } = this.state;
    const { errors } = this.props;

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
      </section>
    );
  }
}

const actions = {};

const mapState = state => ({
  recipe: state.recipe,
  ingredient: state.ingredient,
  errors: state.errors
});

RecipeIngredients.propTypes = {
  recipe: PropTypes.object.isRequired,
  ingredient: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(RecipeIngredients);
