import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../../utils/spinner/Spinner';

class RecipeIngredients extends Component {
  componentDidMount() {
    if (this.props.recipe.selectedRecipe === null) {
      this.props.history.push('/recipes');
    } else {
      this.setState({
        selectedRecipe: this.props.recipe.selectedRecipe
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    console.log('prevProps: ', prevProps.recipe);
    console.log('this.props: ', this.props.recipe);

    if (
      prevProps.recipe.selectedRecipe !==
      this.props.recipe.selectedRecipe
    ) {
      this.setState({
        selectedRecipe: this.props.recipe.selectedRecipe
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
