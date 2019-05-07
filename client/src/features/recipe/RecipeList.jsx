import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { getRecipes, setSelectedRecipe } from './recipeActions';
import Spinner from '../../utils/spinner/Spinner';

class RecipeList extends Component {
  componentDidMount() {
    this.props.getRecipes();
  }

  handleOnClick = selectedRecipe => {
    console.log('selectedRecipe: ', selectedRecipe);
    this.props.setSelectedRecipe(selectedRecipe, this.props.history);
  };

  render() {
    const { recipes, loading } = this.props.recipe;

    let recipeList;

    console.log('Recipes: ', recipes);
    if (recipes === null || loading === true) {
      recipeList = <Spinner />;
    } else {
      if (recipes !== null && recipes.length > 0) {
        recipeList = (
          <ul>
            {recipes.map((recipe, i) => (
              <li
                style={{ cursor: 'pointer' }}
                key={i}
                onClick={() => this.handleOnClick(recipe)}
              >
                {recipe.displayName}
              </li>
            ))}
          </ul>
        );
      } else {
        recipeList = <p>No Recipes were found</p>;
      }
    }

    return <div>{recipeList}</div>;
  }
}

const actions = {
  getRecipes,
  setSelectedRecipe
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
)(withRouter(RecipeList));
