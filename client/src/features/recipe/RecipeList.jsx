import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getRecipes } from './recipeActions';

class RecipeList extends Component {
  componentDidMount() {
    this.props.getRecipes();
  }

  render() {
    const { recipes } = this.props.recipe;

    let recipeList;

    console.log('Recipes: ', recipes);
    if (recipes !== null && recipes.length > 0) {
      recipeList = (
        <ul>
          {recipes.map((recipe, i) => (
            <li key={i}>{recipe.displayName}</li>
          ))}
        </ul>
      );
    } else {
      recipeList = <p>No Recipes were found</p>;
    }

    return <div>{recipeList}</div>;
  }
}

const actions = {
  getRecipes
};

const mapState = state => ({
  auth: state.auth,
  recipe: state.recipe
});

RecipeList.propTypes = {
  recipe: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(RecipeList);
