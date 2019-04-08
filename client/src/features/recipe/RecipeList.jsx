import React, { Component } from 'react';
import { connect } from 'react-redux';

class RecipeList extends Component {
  render() {
    const { recipes } = this.props;

    let recipeList;

    if (recipes === null) {
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

    return (
      <div>
        <h1>Recipes</h1>
        {recipeList}
      </div>
    );
  }
}

const mapState = state => ({
  auth: state.auth,
  recipes: state.auth
});

export default connect(mapState)(RecipeList);
