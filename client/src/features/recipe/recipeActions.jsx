import axios from 'axios';
import {
  GET_ERRORS,
  GET_RECIPES,
  RECIPE_LOADING,
  ADD_RECIPE,
  SET_SELECTED_RECIPE,
  REMOVE_SELECTED_RECIPE
} from '../../redux/types';
import { calcSecondsIntoTime } from '../../utils/utilityFunctions';

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

export const addRecipe = (
  recipeData,
  profileData,
  history
) => dispatch => {
  // console.log(recipeData);

  dispatch(setRecipeLoading());
  axios
    .post('/api/recipe', recipeData)
    .then(res => {
      dispatch(setSelectedRecipe(res.data, profileData));
      // dispatch({
      //   type: ADD_RECIPE,
      //   payload: res.data
      // });
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

// export const setSelectedRecipe = (
//   recipeData,
//   profileData
// ) => dispatch => {
//   const empty = new Object();
//   console.log('empty', empty);

//   dispatch({
//     type: SET_SELECTED_RECIPE,
//     payload: empty
//   });
// };

export const setSelectedRecipe = (
  recipeData,
  profileData
) => dispatch => {
  console.log('recipeData ACTIONS', recipeData);

  const updateRecipe = {
    _id: recipeData._id,
    venue: recipeData.venue,
    displayName: recipeData.displayName,
    urlName: recipeData.urlName,
    serves: recipeData.serves.toString(),
    expectedSalesPerDay: recipeData.expectedSalesPerDay
      ? recipeData.expectedSalesPerDay.toString()
      : '',
    salePricePerServe: recipeData.salePricePerServe
      ? recipeData.salePricePerServe.toString()
      : '',
    staffTime: recipeData.staffTime,
    staffTimeUnit: recipeData.staffTimeUnit,
    totalCookingTime: recipeData.totalCookingTime,
    cookingTimeUnit: recipeData.cookingTimeUnit,
    internalRecipe: recipeData.internalRecipe
  };

  const updatedRecipeIngredients = recipeData.ingredients.map(
    (recipeIngredient, index) => {
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
          recipeIngredient.packageGrams =
            preferredSupplier[0].packageGrams;
          recipeIngredient.packageCost =
            preferredSupplier[0].packageCost;
        } else {
          recipeIngredient.packageGrams =
            recipeIngredient.ingredient.packageGrams;
          recipeIngredient.packageCost =
            recipeIngredient.ingredient.packageCost;
        }
      } else {
        recipeIngredient.packageGrams =
          recipeIngredient.ingredient.packageGrams;
        recipeIngredient.packageCost =
          recipeIngredient.ingredient.packageCost;
      }
      return recipeIngredient;
    }
  );
  updateRecipe.ingredients = updatedRecipeIngredients;

  dispatch({
    type: SET_SELECTED_RECIPE,
    payload: updateRecipe
  });
};

export const editRecipe = (
  recipeData,
  profileData,
  history,
  exit
) => dispatch => {
  console.log('recipeData ACTIONS', recipeData);
  // console.log('recipeData ACTIONS', profileData);
  dispatch(setRecipeLoading());
  axios
    .put(`/api/recipe/${recipeData._id}`, recipeData)
    .then(res => {
      // console.log('res recipeData ACTIONS', res.data);
      if (exit) {
        history.push('/recipes');
        dispatch(removeSelectedRecipe());
      } else {
        console.log('recipeData ACTIONS', res.data);
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
