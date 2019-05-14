import axios from 'axios';
import {
  GET_ERRORS,
  GET_RECIPES,
  RECIPE_LOADING,
  ADD_RECIPE,
  SET_SELECTED_RECIPE
} from '../../redux/types';
import { getIngredients } from '../ingredient/ingredientActions';

export const getRecipes = () => dispatch => {
  // console.log('Called');
  dispatch(setRecipeLoading());
  axios
    .get('/api/recipe/all')
    .then(res => {
      dispatch({
        type: GET_RECIPES,
        payload: res.data
      });
    })
    .catch({
      GET_RECIPES,
      payload: {}
    });
};

// Ingredients loading
export const setRecipeLoading = () => {
  return {
    type: RECIPE_LOADING
  };
};

export const addRecipe = recipeData => dispatch => {
  dispatch(setRecipeLoading());
  axios
    .post('/api/recipe', recipeData)
    .then(res => {
      dispatch({
        type: ADD_RECIPE,
        payload: res.data
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const getSelectedRecipeByID = (
  recipeID,
  profileIngredients
) => dispatch => {
  axios
    .get(`/api/recipe/${recipeID}`)
    .then(res => {
      dispatch(setSelectedRecipe(res.data));
    })
    .catch(err => {
      // console.log('err', err);

      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
};

export const setSelectedRecipe = recipeData => dispatch => {
  axios
    .get(`/api/ingredient/all`)
    .then(res => {
      console.log('res.data: ', res.data);
      const ingredients = res.data;

      const updatedRecipengredients = recipeData.ingredients.map(
        rIngredient => {
          if (!rIngredient.supplier) {
            // If ingredient doesn't have a supplier.. Add ingredient price from the base ingredient
            console.log('rIngredient: ', rIngredient);
          }
          return rIngredient;
        }
      );

      const newRecipe = {};
      newRecipe._id = recipeData._id;
      newRecipe.displayName = recipeData.displayName;
      newRecipe.urlName = recipeData.urlName;
      newRecipe.serves = recipeData.serves.toString();
      newRecipe.expectedSalesPerDay = recipeData.expectedSalesPerDay.toString();
      newRecipe.salePricePerServe = recipeData.salePricePerServe.toString();
      newRecipe.staffTime = recipeData.staffTime.toString();
      newRecipe.totalCookingTime = recipeData.totalCookingTime.toString();
      newRecipe.internalRecipe = recipeData.internalRecipe;
      newRecipe.ingredients = recipeData.ingredients;
      // console.log('new Selected Recipe: ', newRecipe);
      dispatch({
        type: SET_SELECTED_RECIPE,
        payload: newRecipe
      });
    })
    .catch(err => {
      // console.log('err', err);
      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
};

export const editRecipe = (recipeData, venueID) => dispatch => {
  // console.log(recipeData);
  dispatch(setRecipeLoading());
  axios
    .put(`/api/recipe/${recipeData._id}`, recipeData)
    .then(res => {
      dispatch(setSelectedRecipe(res.data));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

export const addSuppliersToRecipeIngredients = (
  selectedRecipe,
  Ingredients,
  Profile
) => dispatch => {
  console.log('selectedRecipe', selectedRecipe);
  selectedRecipe.kalindi = 'hi';
  dispatch(setSelectedRecipe(selectedRecipe));
};
