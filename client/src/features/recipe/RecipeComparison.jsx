import React from 'react';
import {
  calcSecondsIntoTime,
  calcTotalIngredientCost,
  calcVenueCost,
  calcStaffCost
} from '../../utils/utilityFunctions';
// import calcStaffCost from '../../utils/functions/calcStaffCost';
import roundNumber from '../../utils/functions/roundNumber';
import { isNumber } from 'util';

const RecipeComparison = ({ selectedRecipe, profile, venue }) => {
  console.log('selectedRecipe', selectedRecipe);
  console.log('venue', venue);

  // const convertedRecipe = { ...selectedRecipe };

  // convertedRecipe.staffTime = selectedRecipe.staffTime
  //   ? calcSecondsIntoTime(
  //       selectedRecipe.staffTime,
  //       selectedRecipe.staffTimeUnit
  //     ).toString()
  //   : '';
  // convertedRecipe.totalCookingTime = selectedRecipe.totalCookingTime
  //   ? calcSecondsIntoTime(
  //       selectedRecipe.totalCookingTime,
  //       selectedRecipe.cookingTimeUnit
  //     ).toString()
  //   : '';

  // selectedRecipe.staffTime = selectedRecipe.staffTime
  //   ? calcSecondsIntoTime(
  //       selectedRecipe.staffTime,
  //       selectedRecipe.staffTimeUnit
  //     ).toString()
  //   : '';
  // selectedRecipe.totalCookingTime = selectedRecipe.totalCookingTime
  //   ? calcSecondsIntoTime(
  //       selectedRecipe.totalCookingTime,
  //       selectedRecipe.cookingTimeUnit
  //     ).toString()
  //   : '';

  const totalIngredientCost = calcTotalIngredientCost(selectedRecipe);
  const staffCost = calcStaffCost(selectedRecipe, venue);
  const venueCost = calcVenueCost(selectedRecipe, venue);
  // if (isNumber(totalIngredientCost)) {
  //   console.log('totalIngredientCost: ', totalIngredientCost);
  // }

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
          {isNumber(totalIngredientCost) ? (
            roundNumber(staffCost, 2)
          ) : (
            <span style={{ color: 'red' }}>{staffCost}</span>
          )}
        </li>
        <li>-</li>
        <li>-</li>
        <li>-</li>
        <li>-</li>
      </ul>
    </section>
  );
};

export default RecipeComparison;
