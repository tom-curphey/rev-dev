import { isNumber } from 'util';

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

export const getRecipeResults = (selectedRecipe, venue) => {
  const recipeResults = {};

  recipeResults.totalIngredientCost = calcTotalIngredientCost(
    selectedRecipe
  );

  recipeResults.staffCost = calcStaffCost(selectedRecipe, venue);
  recipeResults.venueCost = calcVenueCost(selectedRecipe, venue);

  recipeResults.recipeCost =
    recipeResults.totalIngredientCost +
    recipeResults.staffCost +
    recipeResults.venueCost;

  recipeResults.profitPerServe = calcProfitPerServe(
    selectedRecipe,
    recipeResults.recipeCost
  );

  recipeResults.profitPerWeek = calcProfitPerWeek(
    selectedRecipe.expectedSales,
    recipeResults.profitPerServe
  );

  recipeResults.profitPerMonth = calcProfitPerMonth(
    selectedRecipe.expectedSales,
    recipeResults.profitPerServe
  );

  recipeResults.profitPerYear = calcProfitPerYear(
    selectedRecipe,
    recipeResults.profitPerServe,
    venue
  );

  recipeResults.recommendedSalesPrice = recommendedSalesPrice(
    selectedRecipe.serves,
    recipeResults.recipeCost
  );

  recipeResults.recipeProfit = calcRecipeProfit(
    selectedRecipe,
    recipeResults.recipeCost
  );

  recipeResults.recipeRevenue = calcRecipeRevenue(selectedRecipe);

  recipeResults.revenuePerWeek = calcRevenuePerWeek(
    selectedRecipe.salePricePerServe,
    selectedRecipe.expectedSales
  );

  recipeResults.revenuePerMonth = calcRevenuePerMonth(
    selectedRecipe.salePricePerServe,
    selectedRecipe.expectedSales
  );

  recipeResults.revenuePerYear = calcRevenuePerYear(
    selectedRecipe.salePricePerServe,
    selectedRecipe.expectedSales,
    venue.weeksOpenPerYear
  );

  recipeResults.profitMargin = calcProfitMargin(
    recipeResults.recipeProfit,
    recipeResults.recipeRevenue
  );

  recipeResults.recipeMarkup = calcRecipeMarkup(
    recipeResults.recipeProfit,
    recipeResults.recipeCost
  );

  recipeResults.recipeGrams = calcRecipeGrams(
    selectedRecipe.ingredients
  );

  recipeResults.recipeGramsPerServe = calcRecipeGramsPerServe(
    selectedRecipe.ingredients,
    selectedRecipe.serves
  );

  recipeResults.costPerServe = calcCostPerServe(
    selectedRecipe.serves,
    recipeResults.recipeCost
  );

  return recipeResults;
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
  const staffCost = venue.costs.chefCost * selectedRecipe.staffTime;
  return staffCost;
};

export const calcVenueCost = (selectedRecipe, venue) => {
  if (selectedRecipe.totalCookingTime === 0) {
    return `Recipe total cooking time not set..`;
  }
  if (venue.costs.chefPayPerHour === 0) {
    return `Venue rent is not set..`;
  }

  let totalVenueCost = 0;
  if (venue.costs.rentCost !== 0)
    totalVenueCost = totalVenueCost + venue.costs.rentCost;
  if (venue.costs.powerCost !== 0)
    totalVenueCost = totalVenueCost + venue.costs.powerCost;
  if (venue.costs.insuranceCost !== 0)
    totalVenueCost = totalVenueCost + venue.costs.insuranceCost;
  if (venue.costs.councilCost !== 0)
    totalVenueCost = totalVenueCost + venue.costs.councilCost;
  if (venue.costs.waterCost !== 0)
    totalVenueCost = totalVenueCost + venue.costs.waterCost;

  const venueCost = selectedRecipe.totalCookingTime * totalVenueCost;

  return venueCost;
};

export const calcProfitPerServe = (selectedRecipe, totalCost) => {
  if (selectedRecipe.serves === 0) {
    return `Recipes serves equals 0..`;
  }
  if (
    !selectedRecipe.salePricePerServe ||
    selectedRecipe.salePricePerServe === 0
  ) {
    return `Recipes sales price is not set..`;
  }
  const costPerServe = totalCost / selectedRecipe.serves;
  const profitPerServe =
    selectedRecipe.salePricePerServe - costPerServe;

  return profitPerServe;
};

export const calcProfitPerWeek = (expectedSales, profitPerServe) => {
  const profitPerWeek = profitPerServe * expectedSales;
  return profitPerWeek;
};

export const calcProfitPerMonth = (expectedSales, profitPerServe) => {
  const profitPerWeek = profitPerServe * expectedSales;
  const profitPerMonth = (profitPerWeek * 52) / 12;
  return profitPerMonth;
};

export const calcProfitPerYear = (
  selectedRecipe,
  profitPerServe,
  venue
) => {
  if (
    !selectedRecipe.expectedSales ||
    selectedRecipe.expectedSales === 0
  ) {
    return `Recipe weekly sales is not set..`;
  }

  if (!isNumber(profitPerServe)) {
    return `-`;
  }

  if (venue.weeksOpenPerYear === 0) {
    return `Venue open time is not set..`;
  }

  const profitPerYear =
    profitPerServe *
    selectedRecipe.expectedSales *
    venue.weeksOpenPerYear;

  return profitPerYear;
};

export const recommendedSalesPrice = (recipeServes, totalCost) => {
  if (!recipeServes || recipeServes === 0) {
    return `Recipe serves is not set..`;
  }
  if (!totalCost || totalCost === 0) {
    return `-`;
  }
  let recommendedSalesPrice = (totalCost / recipeServes) * 2;
  return recommendedSalesPrice;
};

export const calcRecipeProfit = (selectedRecipe, totalCost) => {
  if (selectedRecipe.serves === 0) {
    return `Recipes serves equals 0..`;
  }
  if (
    !selectedRecipe.salePricePerServe ||
    selectedRecipe.salePricePerServe === 0
  ) {
    return `Recipes sales price is not set..`;
  }
  const costPerServe = totalCost / selectedRecipe.serves;
  const recipeProfit =
    (selectedRecipe.salePricePerServe - costPerServe) *
    selectedRecipe.serves;

  return recipeProfit;
};

export const calcRecipeRevenue = selectedRecipe => {
  if (selectedRecipe.serves === 0) {
    return `Recipes serves equals 0..`;
  }
  if (
    !selectedRecipe.salePricePerServe ||
    selectedRecipe.salePricePerServe === 0
  ) {
    return `Recipes sales price is not set..`;
  }
  const recipeRevenue =
    selectedRecipe.salePricePerServe * selectedRecipe.serves;
  return recipeRevenue;
};

export const calcRevenuePerWeek = (
  salePricePerServe,
  expectedSales
) => {
  const revenuePerWeek = salePricePerServe * expectedSales;
  return revenuePerWeek;
};

export const calcRevenuePerMonth = (
  salePricePerServe,
  expectedSales
) => {
  const revenuePerWeek = salePricePerServe * expectedSales;
  const revenuePerMonth = (revenuePerWeek * 52) / 12;
  return revenuePerMonth;
};

export const calcRevenuePerYear = (
  salePricePerServe,
  expectedSales,
  weeksOpenPerYear
) => {
  const revenuePerWeek = salePricePerServe * expectedSales;
  const revenuePerYear = revenuePerWeek * weeksOpenPerYear;
  return revenuePerYear;
};

export const calcProfitMargin = (recipeProfit, recipeRevenue) => {
  const profitMargin = (recipeProfit / recipeRevenue) * 100;
  return profitMargin;
};

export const calcRecipeMarkup = (recipeProfit, totalCost) => {
  const recipeMarkup = (recipeProfit / totalCost) * 100;
  return recipeMarkup;
};

export const calcRecipeGrams = recipeIngredients => {
  let totalGrams = 0;
  for (let index = 0; index < recipeIngredients.length; index++) {
    const ingredient = recipeIngredients[index];
    totalGrams = totalGrams + ingredient.grams;
  }
  return totalGrams;
};

export const calcRecipeGramsPerServe = (
  recipeIngredients,
  recipeServes
) => {
  let totalGrams = 0;
  for (let index = 0; index < recipeIngredients.length; index++) {
    const ingredient = recipeIngredients[index];
    totalGrams = totalGrams + ingredient.grams;
  }
  const recipeGramsPerServe = totalGrams / recipeServes;
  return recipeGramsPerServe;
};

export const calcCostPerServe = (recipeServes, totalCost) => {
  const costPerServe = totalCost / recipeServes;
  return costPerServe;
};

export const getIngredientResults = (selectedRecipe, recipeGrams) => {
  const ingredientResultArray = selectedRecipe.ingredients.map(
    ingredient => {
      const ingredientResults = {};
      ingredientResults.displayName =
        ingredient.ingredient.displayName;
      ingredientResults.recipeCost =
        (ingredient.packageCost / ingredient.packageGrams) *
        ingredient.grams;
      ingredientResults.recipeGrams = ingredient.grams;
      ingredientResults.contribution =
        (ingredient.grams / recipeGrams) * 100;
      ingredientResults.packageCost = ingredient.packageCost;
      ingredientResults.packageGrams = ingredient.packageGrams;
      return ingredientResults;
    }
  );

  return ingredientResultArray;
};
