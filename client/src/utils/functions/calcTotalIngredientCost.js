export default function calcTotalIngredientCost(selectedRecipe) {
  let totalIngredientCost = 0;
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
  return totalIngredientCost;
}
