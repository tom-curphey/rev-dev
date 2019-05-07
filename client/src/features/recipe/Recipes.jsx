import React from 'react';
import RecipeList from './RecipeList';
import { Link } from 'react-router-dom';

const Recipes = () => {
  return (
    <div className="recipes_page">
      <section className="header">
        <h1>Recipes</h1>
        <div>
          <Link to="/add-recipe">+ Add Recipe</Link>
        </div>
      </section>
      <RecipeList />
    </div>
  );
};

export default Recipes;
