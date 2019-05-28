import React from 'react';
import { roundNumber } from '../../utils/utilityFunctions';
import { isNumber } from 'util';

const RecipeComparison = ({
  selectedRecipe,
  recipeResults,
  profile,
  venue
}) => {
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
        <li>
          {isNumber(recipeResults.totalIngredientCost) ? (
            roundNumber(recipeResults.totalIngredientCost, 2)
          ) : (
            <span style={{ color: 'red' }}>
              {recipeResults.totalIngredientCost}
            </span>
          )}
        </li>
        <li>
          {isNumber(recipeResults.staffCost) ? (
            roundNumber(recipeResults.staffCost, 2)
          ) : (
            <span style={{ color: 'red' }}>
              {recipeResults.staffCost}
            </span>
          )}
        </li>
        <li>
          {isNumber(recipeResults.venueCost) ? (
            roundNumber(recipeResults.venueCost, 2)
          ) : (
            <span style={{ color: 'red' }}>
              {recipeResults.venueCost}
            </span>
          )}
        </li>
        <li>
          {isNumber(recipeResults.profitPerYear) ? (
            roundNumber(recipeResults.profitPerYear, 2)
          ) : (
            <span style={{ color: 'red' }}>
              {recipeResults.profitPerYear}
            </span>
          )}
        </li>
        <li>
          {isNumber(recipeResults.profitPerServe) ? (
            roundNumber(recipeResults.profitPerServe, 2)
          ) : (
            <span style={{ color: 'red' }}>
              {recipeResults.profitPerServe}
            </span>
          )}
        </li>
        <li>
          {isNumber(recipeResults.profitPerServe) ? (
            roundNumber(recipeResults.profitPerServe, 2)
          ) : (
            <span style={{ color: 'red' }}>
              {recipeResults.profitPerServe}
            </span>
          )}
        </li>
      </ul>
    </section>
  );
};

export default RecipeComparison;
