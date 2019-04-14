import axios from 'axios';
import {
  GET_INGREDIENTS,
  INGREDIENTS_LOADING,
  GET_ERRORS,
  SAVE_PROFILE_INGREDIENT,
  INGREDIENTS_LOADING_FALSE,
  SET_SELECTED_INGREDIENT,
  SET_SELECTED_INGREDIENT_SUPPLIER
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

export const setSelectedIngredient = (
  clickedOnIngredient,
  profile,
  suppliers
) => dispatch => {
  // console.log(cl);

  // Check if the ingredient selected is in the profile ingredients
  const checkProfileIngredient = profile.profile.ingredients.filter(
    profileIngredient => {
      if (profileIngredient.ingredient === clickedOnIngredient._id) {
        clickedOnIngredient.profileIngredient = true;
        return clickedOnIngredient;
      } else {
        return null;
      }
    }
  );

  // Filters ingredient suppliers and puts them in ABC order
  // If successful set filteredIngredientSuppilersArray[]
  let abcFilteredSuppliers = null;
  if (
    clickedOnIngredient.suppliers.length > 0 &&
    suppliers.length > 0
  ) {
    const filteredIngredientSuppliers = clickedOnIngredient.suppliers.filter(
      o1 => {
        return suppliers.some(o2 => {
          // return the ones with equal id
          return o1.supplier._id === o2._id;
        });
      }
    );

    function compare(a, b) {
      const supplierA = a.supplier.displayName;
      const supplierB = b.supplier.displayName;

      let comparison = 0;
      if (supplierA > supplierB) {
        comparison = 1;
      } else if (supplierA < supplierB) {
        comparison = -1;
      }
      return comparison;
    }

    clickedOnIngredient.suppliers = filteredIngredientSuppliers.sort(
      compare
    );

    if (
      checkProfileIngredient !== null &&
      clickedOnIngredient.suppliers !== null
    ) {
      const currentProfileIngredientSupplier = clickedOnIngredient.suppliers.filter(
        ingredientSupplier => {
          if (
            ingredientSupplier.supplier._id ===
            checkProfileIngredient[0].supplier
          ) {
            ingredientSupplier.confirmedProfileIngredientSupplier = true;
          } else {
            return null;
          }
        }
      );
    }
  }

  console.log('clickedOnIngredient', clickedOnIngredient);

  dispatch({
    type: SET_SELECTED_INGREDIENT,
    payload: clickedOnIngredient
  });
};

// Set selected ingredient supplier
export const setSelectedIngredientSupplier = (
  clickedOnIngredientSupplier,
  selectedIngredient
) => dispatch => {
  console.log(clickedOnIngredientSupplier);
  clickedOnIngredientSupplier.packageCost = clickedOnIngredientSupplier.packageCost.toString();
  clickedOnIngredientSupplier.packageGrams = clickedOnIngredientSupplier.packageGrams.toString();

  dispatch({
    type: SET_SELECTED_INGREDIENT_SUPPLIER,
    payload: clickedOnIngredientSupplier
  });
};

// Add / Edit Profile Ingredient
export const addOrEditProfileIngredientSupplier = (
  selectedIngredient,
  profileIngredientSupplierData
) => dispatch => {
  // console.log(
  //   'profileIngredientSupplierData: ',
  //   profileIngredientSupplierData
  // );

  const { supplier } = profileIngredientSupplierData;

  dispatch(setIngredientsLoading());
  axios
    .post(
      `api/profile/ingredient/${selectedIngredient._id}/${
        supplier._id
      }`,
      profileIngredientSupplierData
    )
    .then(res => {
      // console.log('Res.data: ', res.data);

      dispatch({
        type: SAVE_PROFILE_INGREDIENT,
        payload: res.data
      });
      dispatch(
        updateSelectedIngredientAfterProfileUpdate(
          selectedIngredient,
          res.data,
          profileIngredientSupplierData
        )
      );
      dispatch(ingredientsLoadingFalse());
    })
    .catch(err => {
      // console.log('-------->> err: ', err);

      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
};

export const updateSelectedIngredientAfterProfileUpdate = (
  prevSelectedIngredient,
  updatedProfile
) => dispatch => {
  console.log(
    '++++++ prevSelectedIngredient',
    prevSelectedIngredient
  );
  console.log('++++++ updatedProfile', updatedProfile);

  // Filter profile ingredients to get the current ingredient
  const updatedProfileIngredient = updatedProfile.ingredients.filter(
    profileIngredient => {
      return (
        profileIngredient.ingredient === prevSelectedIngredient._id
      );
    }
  );

  let setSelectedIngredientSupplier = null;
  const updatedSelectedIngredientProfileSuppliers = prevSelectedIngredient.suppliers.map(
    ingredientSupplier => {
      if (
        ingredientSupplier.supplier._id ===
        updatedProfileIngredient[0].supplier
      ) {
        ingredientSupplier.confirmedProfileIngredientSupplier = true;
        ingredientSupplier.packageCost = updatedProfileIngredient[0].packageCost.toString();
        ingredientSupplier.packageGrams = updatedProfileIngredient[0].packageGrams.toString();
      } else {
        ingredientSupplier.confirmedProfileIngredientSupplier = false;
      }
      return ingredientSupplier;
    }
  );

  console.log(
    'updatedSelectedIngredientProfileSuppliers: ',
    updatedSelectedIngredientProfileSuppliers
  );
  console.log(
    'updatedProfileIngredient: ',
    updatedProfileIngredient[0]
  );
  prevSelectedIngredient.suppliers = updatedSelectedIngredientProfileSuppliers;
  console.log('prevSelectedIngredient: ', prevSelectedIngredient);
  dispatch({
    type: SET_SELECTED_INGREDIENT,
    payload: prevSelectedIngredient
  });
};
