import axios from 'axios';
import {
  GET_INGREDIENTS,
  INGREDIENTS_LOADING,
  GET_ERRORS,
  SAVE_PROFILE_INGREDIENT,
  INGREDIENTS_LOADING_FALSE
} from '../../redux/types';

// Get Ingredients and set redux state with ingredients
export const getIngredients = () => dispatch => {
  dispatch(setIngredientsLoading());
  axios
    .get('api/ingredient/all')
    .then(res =>
      dispatch({
        type: GET_INGREDIENTS,
        payload: res.data
      })
    )
    .catch({
      GET_INGREDIENTS,
      payload: {}
    });
};

// Add / Edit Profile Ingredient
export const addOrEditProfileIngredient = profileIngredientData => dispatch => {
  console.log(profileIngredientData);
  const { ingredient, supplier } = profileIngredientData;

  dispatch(setIngredientsLoading());
  axios
    .post(
      `api/profile/ingredient/${ingredient}/${supplier}`,
      profileIngredientData
    )
    .then(res => {
      console.log('Res.data: ', res.data);

      dispatch({
        type: SAVE_PROFILE_INGREDIENT,
        payload: res.data
      });
      dispatch(ingredientsLoadingFalse());
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Ingredients loading
export const setIngredientsLoading = () => {
  return {
    type: INGREDIENTS_LOADING
  };
};

export const ingredientsLoadingFalse = () => {
  return {
    type: INGREDIENTS_LOADING_FALSE
  };
};
