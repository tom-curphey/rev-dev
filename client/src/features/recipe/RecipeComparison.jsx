import React from 'react';
import { roundNumber } from '../../utils/utilityFunctions';
import { isNumber } from 'util';
import twoDecimalNumber from '../utils/twoDecimalNumber';

const RecipeComparison = ({
  selectedRecipe,
  recipeResults,
  profile,
  venue
}) => {
  const checks = twoDecimalNumber(recipeResults.staffCost);

  return (
    <section className="comparison">
      <ul>
        <li>Recipe Name</li>
        <li>Ingredient Cost</li>
        <li>Staff Cost</li>
        <li>Venue Cost</li>
        <li>Profit Per Year</li>
        <li>Profit Per Serve</li>
        <li>Profit Comparison</li>
      </ul>
      <ul>
        <li>{selectedRecipe.displayName}</li>
        <li>{twoDecimalNumber(recipeResults.totalIngredientCost)}</li>
        <li>{twoDecimalNumber(recipeResults.staffCost)}</li>
        <li>{twoDecimalNumber(recipeResults.venueCost)}</li>
        <li>{twoDecimalNumber(recipeResults.profitPerYear)}</li>
        <li>{twoDecimalNumber(recipeResults.profitPerServe)}</li>
        <li>{twoDecimalNumber(recipeResults.profitPerServe)}</li>
      </ul>
    </section>
  );
};

export default RecipeComparison;
