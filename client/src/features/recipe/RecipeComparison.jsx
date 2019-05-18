import React from 'react';
import calcTotalIngredientCost from '../../utils/functions/calcTotalIngredientCost';
import roundNumber from '../../utils/functions/roundNumber';
import { isNumber } from 'util';

const RecipeComparison = ({ selectedRecipe }) => {
  const totalIngredientCost = calcTotalIngredientCost(selectedRecipe);
  // if (isNumber(totalIngredientCost)) {
  //   console.log('totalIngredientCost: ', totalIngredientCost);
  // }

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
        <li>
          {isNumber(totalIngredientCost) ? (
            roundNumber(totalIngredientCost, 2)
          ) : (
            <span style={{ color: 'red' }}>
              {totalIngredientCost}
            </span>
          )}
        </li>
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
