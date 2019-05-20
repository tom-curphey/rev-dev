export const calcTimeToSeconds = (time, unit) => {
  console.log('time', time);
  console.log('unit', unit);

  let seconds = null;
  switch (unit) {
    case 'sec':
      seconds = time;
      break;
    case 'min':
      seconds = time * 60;
      break;
    case 'hour':
      seconds = time * 60 * 60;
      break;
    default:
      seconds = null;
  }

  console.log('seconds', seconds);

  return seconds;
};

export const calcSecondsIntoTime = (seconds, unit) => {
  let convertedTime = null;
  switch (unit) {
    case 'sec':
      convertedTime = seconds;
      break;
    case 'min':
      convertedTime = seconds / 60;
      break;
    case 'hour':
      convertedTime = seconds / 60 / 60;
      break;
    default:
      convertedTime = null;
  }
  return convertedTime;
};

export const calcTotalIngredientCost = selectedRecipe => {
  let totalIngredientCost = null;
  for (
    let index = 0;
    index < selectedRecipe.ingredients.length;
    index++
  ) {
    const ingredient = selectedRecipe.ingredients[index];

    if (
      ingredient.packageCost === 0 ||
      ingredient.packageGrams === 0
    ) {
      if (ingredient.packageCost === 0) {
        return `${
          ingredient.ingredient.displayName
        } has no set price..`;
      }
      if (ingredient.packageGrams === 0) {
        return `${
          ingredient.ingredient.displayName
        } has no set grams..`;
      }
    } else {
      const iCostForOneGram =
        ingredient.packageCost / ingredient.packageGrams;
      const ingredientCost = iCostForOneGram * ingredient.grams;
      totalIngredientCost = totalIngredientCost + ingredientCost;
    }
  }
  if (totalIngredientCost === null)
    totalIngredientCost = 'No Ingredients set..';

  return totalIngredientCost;
};

export const calcStaffCost = (selectedRecipe, venue) => {
  if (selectedRecipe.staffTime === 0) {
    return `Recipe staff time not set..`;
  }
  if (venue.costs.chefPayPerHour === 0) {
    return `Chef pay in not set..`;
  }
  const staffTimeInHourFormat =
    ((100 / 60 / 60) * selectedRecipe.staffTime) / 100;
  const staffCost =
    venue.costs.chefPayPerHour * staffTimeInHourFormat;
  return staffCost;
};

export const calcVenueCost = (recipe, venue) => {
  console.log('recipe', recipe);
  console.log('venue', venue);

  if (recipe.totalCookingTime === 0) {
    return `Recipe total cooking time not set..`;
  }
  if (venue.costs.chefPayPerHour === 0) {
    return `Venue rent is not set..`;
  }
};
