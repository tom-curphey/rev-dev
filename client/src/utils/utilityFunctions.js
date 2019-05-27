export const roundNumber = (value, decimals) => {
  if (value === 0 || value === '0' || value === '') {
    return '';
  }

  return Number(
    Math.round(+value + 'e' + decimals) + 'e-' + decimals
  );
};

export const calcTimeToSeconds = (time, unit) => {
  // console.log('time', time);
  // console.log('unit', unit);

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

export const calcCostToSeconds = (cost, unit) => {
  let costPerSecond = null;
  switch (unit) {
    case 'sec':
      costPerSecond = cost;
      break;
    case 'min':
      costPerSecond = cost / 60;
      break;
    case 'hour':
      costPerSecond = cost / 60 / 60;
      break;
    case 'day':
      costPerSecond = cost / 24 / 60 / 60;
      break;
    case 'week':
      costPerSecond = 7 / 24 / 60 / 60;
      break;
    case 'month':
      // console.log('Made it');
      // 31556925.9747 -> Hewlett-Packard seconds per year
      costPerSecond = (cost / 31556925.9747) * 12;
      break;
    case 'year':
      costPerSecond = cost / 31556925.9747;
      break;
    default:
      costPerSecond = null;
  }
  return costPerSecond;
};

export const calcCostPerSecondToCostPerUnit = (
  costPerSecond,
  unit
) => {
  let costPerUnit = null;
  switch (unit) {
    case 'sec':
      costPerUnit = costPerSecond;
      break;
    case 'min':
      costPerUnit = costPerSecond * 60;
      break;
    case 'hour':
      costPerUnit = costPerSecond * 60 * 60;
      break;
    case 'day':
      costPerUnit = costPerSecond * 24 * 60 * 60;
      break;
    case 'week':
      costPerUnit = costPerSecond * 7 * 24 * 60 * 60;
      break;
    case 'month':
      // console.log('Made it');
      // 31556925.9747 -> Hewlett-Packard seconds per year
      costPerUnit = (costPerSecond * 31556925.9747) / 12;
      // costPerUnit = 1;
      break;
    case 'year':
      costPerUnit = costPerSecond * 31556925.9747;
      break;
    default:
      costPerUnit = null;
  }
  return roundNumber(costPerUnit, 3);
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
  if (venue.costs.chefCost === 0) {
    return `Chef pay in not set..`;
  }
  const staffCostPerSecond =
    venue.costs.chefCost * selectedRecipe.staffTime;

  const staffCostPerHour =
    ((100 / 60 / 60) * staffCostPerSecond) / 100;

  console.log('selectedRecipe.staffTime', selectedRecipe.staffTime);
  console.log('chefPayPerHour', venue.costs.chefCost);
  console.log('staffCostPerHour', staffCostPerHour);
  console.log('staffCostPerSecond', staffCostPerSecond);

  // console.log('staffCost', staffCost);

  return staffCostPerHour;
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
