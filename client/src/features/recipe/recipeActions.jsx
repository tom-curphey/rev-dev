import axios from 'axios';
import {
  GET_ERRORS,
  GET_RECIPES,
  RECIPE_LOADING,
  ADD_RECIPE,
  SET_SELECTED_RECIPE,
  REMOVE_SELECTED_RECIPE
} from '../../redux/types';
import { getIngredients } from '../ingredient/ingredientActions';
import { pipeline } from 'stream';

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
    .catch(err => {
      dispatch({
        type: GET_RECIPES,
        payload: {}
      });
    });
};

// Ingredients loading
export const setRecipeLoading = () => {
  return {
    type: RECIPE_LOADING
  };
};

export const addRecipe = (recipeData, history) => dispatch => {
  // console.log(recipeData);

  dispatch(setRecipeLoading());
  axios
    .post('/api/recipe', recipeData)
    .then(res => {
      dispatch({
        type: ADD_RECIPE,
        payload: res.data
      });
      history.push(
        `/edit-recipe/${res.data._id}/${res.data.urlName}`
      );
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

const axiosGetSelectedRecipeByID = recipeID => {
  return axios.get(`/api/recipe/${recipeID}`);
};

const axiosGetProfile = () => {
  return axios.get('/api/profile');
};

export const getSelectedRecipeByID = recipeID => dispatch => {
  axios
    .all([axiosGetSelectedRecipeByID(recipeID), axiosGetProfile()])
    .then(
      axios.spread((recipe, profile) => {
        dispatch(setSelectedRecipe(recipe.data, profile.data));
      })
    )
    .catch(err => {
      // console.log('err', err);

      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
};

export const setSelectedRecipe = (
  recipeData,
  profileData
) => dispatch => {
  const newRecipe = {};

  newRecipe._id = recipeData._id;
  newRecipe.venue = recipeData.venue;
  newRecipe.displayName = recipeData.displayName;
  newRecipe.urlName = recipeData.urlName;
  newRecipe.serves = recipeData.serves.toString();
  newRecipe.expectedSalesPerDay = recipeData.expectedSalesPerDay
    ? recipeData.expectedSalesPerDay.toString()
    : '';
  newRecipe.salePricePerServe = recipeData.salePricePerServe
    ? recipeData.salePricePerServe.toString()
    : '';
  newRecipe.staffTime = recipeData.staffTime
    ? recipeData.staffTime.toString()
    : '';
  newRecipe.totalCookingTime = recipeData.totalCookingTime
    ? recipeData.staffTime.toString()
    : '';
  newRecipe.internalRecipe = recipeData.internalRecipe;

  const updatedRecipeIngredients = recipeData.ingredients.map(
    recipeIngredient => {
      // console.log('recipeIngredient', recipeIngredient);
      let pI = profileData.ingredients.filter(profileIngredient => {
        return (
          profileIngredient.ingredient ===
          recipeIngredient.ingredient._id
        );
      });
      if (pI.length > 0) {
        // console.log('PI: ', pI);
        let preferredSupplier = pI[0].suppliers.filter(p => {
          // console.log('p', p);
          return p.preferred === true;
        });

        if (preferredSupplier.length > 0) {
          // console.log(
          //   'PREFERED SUPPLIER TRUE -> Reset ingredient costs'
          // );

          recipeIngredient.packageGrams =
            preferredSupplier[0].packageGrams;
          recipeIngredient.packageCost =
            preferredSupplier[0].packageCost;
        } else {
          // console.log(
          //   'NO PREFERRED SUPPLIER -> Use default ingredient cost'
          // );
          recipeIngredient.packageGrams =
            recipeIngredient.ingredient.packageGrams;
          recipeIngredient.packageCost =
            recipeIngredient.ingredient.packageCost;
        }
      } else {
        // console.log(
        //   'NO PROFILE INGREDIENTS: -> Use default ingredient cost ',
        //   recipeIngredient
        // );
        recipeIngredient.packageGrams =
          recipeIngredient.ingredient.packageGrams;
        recipeIngredient.packageCost =
          recipeIngredient.ingredient.packageCost;
      }
      return recipeIngredient;
    }
  );

  // console.log('TEST', updatedRecipeIngredientsTEST);

  // const updatedRecipeIngredients = {};

  newRecipe.ingredients = updatedRecipeIngredients;

  // console.log('new Selected Recipe: ', newRecipe);
  dispatch({
    type: SET_SELECTED_RECIPE,
    payload: newRecipe
  });
};

export const editRecipe = (
  recipeData,
  profileData,
  history,
  exit
) => dispatch => {
  // console.log('recipeData ACTIONS');
  // console.log('recipeData ACTIONS', history);
  dispatch(setRecipeLoading());
  axios
    .put(`/api/recipe/${recipeData._id}`, recipeData)
    .then(res => {
      // console.log('res recipeData ACTIONS', res.data);
      if (exit) {
        history.push('/recipes');
        dispatch(removeSelectedRecipe());
      } else {
        dispatch(setSelectedRecipe(res.data, profileData));
      }
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
  // console.log('selectedRecipe', selectedRecipe);
  selectedRecipe.kalindi = 'hi';
  dispatch(setSelectedRecipe(selectedRecipe));
};

export const removeSelectedRecipe = () => dispatch => {
  dispatch({
    type: REMOVE_SELECTED_RECIPE
  });
};
