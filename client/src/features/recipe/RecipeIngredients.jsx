import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../../utils/spinner/Spinner';

class RecipeIngredients extends Component {
  state = {
    recipeIngredients: []
  };

  componentDidMount() {
    if (this.props.recipe.selectedRecipe !== null) {
      // if (this.props.recipe.selectedRecipe.ingredients.length === 0) {
      console.log('Mounted...');

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

    console.log('prevProps: ', prevProps.recipe.selectedRecipe);
    console.log('this.props: ', this.props.recipe.selectedRecipe);

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

    let recipeContent;
    if (loading === true || selectedRecipe === null) {
      recipeContent = <Spinner />;
    } else {
      recipeContent = (
        <h1>Edit Recipe {selectedRecipe.displayName} Ingredients</h1>
      );
    }

    return <section>{recipeContent}</section>;
  }
}

const actions = {};

const mapState = state => ({
  recipe: state.recipe,
  errors: state.errors
});

RecipeIngredients.propTypes = {
  recipe: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(RecipeIngredients);
