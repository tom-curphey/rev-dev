import React from 'react';

const RecipeComparison = ({ selectedRecipe }) => {
  console.log('selectedRecipe: ', selectedRecipe);

  return (
    <section className="comparison">
      <ul>
        <li>Recipe Name</li>
        <li>Ingredient Cost</li>
        <li>Staff Cost</li>
        <li>Rental Cost</li>
        <li>Profit Per Year</li>
        <li>Profit Per Serve</li>
        <li>Profit Comparison</li>
      </ul>
      <ul>
        <li>{selectedRecipe.displayName}</li>
        <li>-</li>
        <li>-</li>
        <li>-</li>
        <li>-</li>
        <li>-</li>
        <li>-</li>
      </ul>
    </section>
  );
};

export default RecipeComparison;
