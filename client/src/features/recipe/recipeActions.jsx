import axios from 'axios';
import {
  GET_ERRORS,
  GET_RECIPES,
  RECIPE_LOADING,
  ADD_RECIPE,
  SET_SELECTED_RECIPE
} from '../../redux/types';

export const getRecipes = () => dispatch => {
  console.log('Called');
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
  console.log(recipeData);

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

export const setSelectedRecipe = (recipe, history) => dispatch => {
  history.push(`/edit-recipe/${recipe.urlName}`);
  dispatch({
    type: SET_SELECTED_RECIPE,
    payload: recipe
  });
};
