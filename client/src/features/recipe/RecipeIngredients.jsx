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
    if (this.props.recipe.selectedRecipe !== null) {
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

  render() {
    const { selectedRecipe, loading } = this.props.recipe;
    const { ingredients } = this.props.ingredient;

    if (ingredients !== null) {
      console.log('ingredients: ', ingredients);
    }

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
            <div>Price</div>
            <div>Grams</div>
            <div>del</div>
          </section>
          <RecipeIngredientForm />
          <SelectIngredient />
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
