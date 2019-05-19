import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { getRecipes, setSelectedRecipe } from './recipeActions';
import Spinner from '../../utils/spinner/Spinner';

class RecipeList extends Component {
  componentDidMount() {
    this.props.getRecipes();
  }

  handleOnClick = selectedRecipe => {
    // console.log('selectedRecipe: ', selectedRecipe);
    this.props.setSelectedRecipe(
      selectedRecipe,
      this.props.profile,
      this.props.history
    );
  };

  render() {
    const { recipes, loading } = this.props.recipe;
    // console.log('PROFILE: ', this.props.profile);

    let recipeList;

    // console.log('Recipes: ', recipes);
    if (recipes === null || loading === true) {
      recipeList = <Spinner />;
    } else {
      if (recipes !== null && recipes.length > 0) {
        recipeList = (
          <ul>
            {recipes.map((recipe, i) => (
              <li key={i}>
                <Link
                  style={{ cursor: 'pointer' }}
                  to={`/edit-recipe/${recipe._id}/${recipe.urlName}`}
                >
                  {recipe.displayName}
                </Link>
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
  recipe: state.recipe,
  profile: state.profile.profile
});

RecipeList.propTypes = {
  recipe: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(withRouter(RecipeList));
