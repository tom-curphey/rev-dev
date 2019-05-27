import React from 'react';
import {
  calcSecondsIntoTime,
  calcTotalIngredientCost,
  calcVenueCost,
  calcStaffCost,
  calcProfitPerServe,
  calcProfitPerYear
} from '../../utils/utilityFunctions';
// import calcStaffCost from '../../utils/functions/calcStaffCost';
import roundNumber from '../../utils/functions/roundNumber';
import { isNumber } from 'util';

const RecipeComparison = ({ selectedRecipe, profile, venue }) => {
  console.log('selectedRecipe', selectedRecipe);
  console.log('venue', venue);

  const totalIngredientCost = calcTotalIngredientCost(selectedRecipe);
  const staffCost = calcStaffCost(selectedRecipe, venue);
  const venueCost = calcVenueCost(selectedRecipe, venue);

  const totalCost = totalIngredientCost + staffCost + venueCost;

  const profitPerServe = calcProfitPerServe(
    selectedRecipe,
    totalCost
  );

  const profitPerYear = calcProfitPerYear(
    selectedRecipe,
    profitPerServe,
    venue
  );

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
          {isNumber(totalIngredientCost) ? (
            roundNumber(totalIngredientCost, 2)
          ) : (
            <span style={{ color: 'red' }}>
              {totalIngredientCost}
            </span>
          )}
        </li>
        <li>
          {isNumber(staffCost) ? (
            roundNumber(staffCost, 2)
          ) : (
            <span style={{ color: 'red' }}>{staffCost}</span>
          )}
        </li>
        <li>
          {isNumber(venueCost) ? (
            roundNumber(venueCost, 2)
          ) : (
            <span style={{ color: 'red' }}>{venueCost}</span>
          )}
        </li>
        <li>-</li>
        <li>
          {isNumber(profitPerServe) ? (
            roundNumber(profitPerServe, 2)
          ) : (
            <span style={{ color: 'red' }}>{profitPerServe}</span>
          )}
        </li>
        <li>-</li>
      </ul>
    </section>
  );
};

export default RecipeComparison;
