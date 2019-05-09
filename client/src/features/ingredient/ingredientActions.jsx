import axios from 'axios';
import {
  GET_INGREDIENTS,
  INGREDIENTS_LOADING,
  GET_ERRORS,
  SAVE_PROFILE_INGREDIENT,
  INGREDIENTS_LOADING_FALSE,
  SET_SELECTED_INGREDIENT,
  SET_SELECTED_INGREDIENT_SUPPLIER,
  REMOVE_SELECTED_INGREDIENT,
  OPEN_INGREDIENT_PANEL,
  CLOSE_INGREDIENT_PANEL,
  REMOVE_INGREDIENTS
} from '../../redux/types';
import capitalizeFirstLetter from '../../utils/functions/capitalizeFirstLetter';

// Get Ingredients and set redux state with ingredients
export const getIngredients = () => dispatch => {
  dispatch(setIngredientsLoading());
  axios
    .get('/api/ingredient/all')
    .then(res => {
      const sortedIngredients = sortIngredientsIntoAbcOrder(res.data);
      dispatch({
        type: GET_INGREDIENTS,
        payload: sortedIngredients
      });
    })
    .catch({
      GET_INGREDIENTS,
      payload: {}
    });
};

export const clearIngredients = () => dispatch => {
  dispatch({
    type: REMOVE_INGREDIENTS
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

export const sortIngredientsIntoAbcOrder = ingredients => {
  if (ingredients.length > 0) {
    ingredients = ingredients.sort((a, b) =>
      a.displayName.localeCompare(b.displayName)
    );
    return ingredients;
  }
  return ingredients;
};

export const sortIngredientSuppliersIntoAbcOrder = selectedIngredientSuppliers => {
  if (selectedIngredientSuppliers.length > 0) {
    selectedIngredientSuppliers = selectedIngredientSuppliers.sort(
      (a, b) =>
        a.supplier.displayName.localeCompare(b.supplier.displayName)
    );
    return selectedIngredientSuppliers;
  }
  return selectedIngredientSuppliers;
};

export const updateSelectedIngredientSupplierDetails = (
  profileSuppliers,
  selectedIngredientSuppliers
) => {
  let updatedSuppliers = [];
  for (var dis = 0; dis < selectedIngredientSuppliers.length; dis++) {
    let updatedSupplierDetails = {};
    for (var pis = 0; pis < profileSuppliers.length; pis++) {
      if (
        selectedIngredientSuppliers[dis].supplier._id ===
        profileSuppliers[pis].supplier
      ) {
        updatedSupplierDetails.supplier = {};
        updatedSupplierDetails._id =
          selectedIngredientSuppliers[dis]._id;
        updatedSupplierDetails.packageCost =
          profileSuppliers[pis].packageCost;
        updatedSupplierDetails.packageGrams =
          profileSuppliers[pis].packageGrams;
        updatedSupplierDetails.preferred =
          profileSuppliers[pis].preferred;

        updatedSupplierDetails.supplier._id =
          selectedIngredientSuppliers[dis].supplier._id;
        updatedSupplierDetails.supplier.displayName =
          selectedIngredientSuppliers[dis].supplier.displayName;
        updatedSuppliers.push(updatedSupplierDetails);
      }
    }
    if (Object.keys(updatedSupplierDetails).length > 0) {
      selectedIngredientSuppliers[dis] = updatedSupplierDetails;
    }
  }
  return selectedIngredientSuppliers;
};

export const setSelectedIngredient = (
  selectedIngredient,
  profile,
  selectIngredientSupplier
) => dispatch => {
  let confirmedProfileIngredient = null;
  let updatedSelectedIngredient = null;

  // Check if the ingredient selected is in the profile ingredients
  if (selectedIngredient.suppliers.length > 0) {
    confirmedProfileIngredient = profile.ingredients.filter(
      profileIngredient => {
        if (profileIngredient.ingredient === selectedIngredient._id) {
          selectedIngredient.profileIngredient = true;
          return profileIngredient;
        }
        return null;
      }
    );
    if (
      confirmedProfileIngredient.length > 0 &&
      selectedIngredient.suppliers !== null
    ) {
      updatedSelectedIngredient = updateSelectedIngredientSupplierDetails(
        confirmedProfileIngredient[0].suppliers,
        selectedIngredient.suppliers
      );
      if (updatedSelectedIngredient.length > 0) {
        selectedIngredient.suppliers = updatedSelectedIngredient;
      }
      if (selectIngredientSupplier === true) {
        const selectedIngredientSupplier = selectedIngredient.suppliers.filter(
          supplier => {
            return supplier.preferred === true;
          }
        );
        if (selectedIngredientSupplier.length > 0) {
          dispatch(
            setSelectedIngredientSupplier(
              selectedIngredientSupplier[0]
            )
          );
        } else {
          dispatch(removeSelectedIngredient());
        }
      }
    } else {
      dispatch(removeSelectedIngredient());
    }
  } else {
    console.log('in set');

    dispatch(removeSelectedIngredient());
  }

  // Filters ingredient supplier names and puts them in ABC order
  selectedIngredient.suppliers = sortIngredientSuppliersIntoAbcOrder(
    selectedIngredient.suppliers
  );
  dispatch({
    type: SET_SELECTED_INGREDIENT,
    payload: selectedIngredient
  });
};

export const removeSelectedIngredient = () => {
  return { type: REMOVE_SELECTED_INGREDIENT };
};

// Add / Edit Profile Ingredient
export const addOrEditProfileIngredientSupplier = (
  selectedIngredient,
  profileIngredientSupplierData,
  preferred
) => dispatch => {
  const { supplier } = profileIngredientSupplierData;

  if (preferred) {
    profileIngredientSupplierData.preferred = true;
  }

  // console.log(
  //   '---> Update: selectedIngredient: ',
  //   selectedIngredient
  // );
  // console.log(
  //   '---> Update: profileIngredientSupplierData: ',
  //   profileIngredientSupplierData
  // );

  dispatch(setIngredientsLoading());
  axios
    .post(
      `api/profile/ingredient/${selectedIngredient._id}/${
        supplier._id
      }`,
      profileIngredientSupplierData
    )
    .then(res => {
      const profile = res.data;
      dispatch(
        setSelectedIngredient(selectedIngredient, profile, false)
      );
      dispatch({
        type: SAVE_PROFILE_INGREDIENT,
        payload: profile
      });

      dispatch(ingredientsLoadingFalse());
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};

// Set selected ingredient supplier
export const setSelectedIngredientSupplier = selectedIngredientSupplier => dispatch => {
  let updatedSelectedIngredientSupplier = {
    ...selectedIngredientSupplier
  };

  updatedSelectedIngredientSupplier.packageCost = selectedIngredientSupplier.packageCost.toString();
  updatedSelectedIngredientSupplier.packageGrams = selectedIngredientSupplier.packageGrams.toString();

  dispatch({
    type: SET_SELECTED_INGREDIENT_SUPPLIER,
    payload: updatedSelectedIngredientSupplier
  });
};

export const addAndSetSelectedIngredientSupplier = (
  newIngredientSupplier,
  selectedIngredient
) => dispatch => {
  const newIngredientSupplierData = {};
  newIngredientSupplierData.packageCost = '0';
  newIngredientSupplierData.packageGrams = '0';

  axios
    .post(
      `/api/ingredient/supplier/${selectedIngredient._id}/${
        newIngredientSupplier._id
      }`,
      newIngredientSupplierData
    )
    .then(res => {
      if (res.data.ingredient.suppliers.length > 0) {
        let count = 0;
        let index = 0;
        const updatedIngredientSuppliers = res.data.ingredient.suppliers.map(
          ingredientSupplierData => {
            if (
              ingredientSupplierData.supplier.toString() ===
              newIngredientSupplier._id.toString()
            ) {
              index = count;
              const resSupplierData = {};
              resSupplierData.supplier = {};

              resSupplierData._id = ingredientSupplierData._id;
              resSupplierData.packageCost = ingredientSupplierData.packageCost.toString();
              resSupplierData.packageGrams = ingredientSupplierData.packageGrams.toString();
              resSupplierData.preferred = false;

              resSupplierData.supplier._id =
                ingredientSupplierData.supplier;
              resSupplierData.supplier.displayName =
                newIngredientSupplier.displayName;

              ingredientSupplierData = resSupplierData;

              // return ingredientSupplierData;
            } else {
              let currentSuppiler = selectedIngredient.suppliers.filter(
                currentSuppiler => {
                  return (
                    currentSuppiler.supplier._id ===
                    ingredientSupplierData.supplier
                  );
                }
              );

              ingredientSupplierData = currentSuppiler[0];
            }
            count++;
            return ingredientSupplierData;
          }
        );
        res.data.ingredient.suppliers = updatedIngredientSuppliers;

        // Filters ingredient supplier names and puts them in ABC order
        // res.data.ingredient.suppliers = sortIngredientSuppliersIntoAbcOrder(
        //   res.data.ingredient.suppliers
        // );
        dispatch(getIngredients());
        dispatch({
          type: SET_SELECTED_INGREDIENT,
          payload: res.data.ingredient
        });
        dispatch({
          type: SET_SELECTED_INGREDIENT_SUPPLIER,
          payload: updatedIngredientSuppliers[index]
        });
      }
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err
      });
    });
};

export const openAddIngredientPanel = newIngredient => dispatch => {
  newIngredient.displayName = capitalizeFirstLetter(
    newIngredient.displayName
  );
  dispatch({
    type: OPEN_INGREDIENT_PANEL
  });
  dispatch({
    type: SET_SELECTED_INGREDIENT,
    payload: newIngredient
  });
};

export const closeAddIngredientPanel = removeSelectedIngredientData => dispatch => {
  if (removeSelectedIngredientData === true) {
    dispatch(removeSelectedIngredient());
  }
  dispatch({
    type: CLOSE_INGREDIENT_PANEL
  });
};

export const addNewIngredient = newIngredient => dispatch => {
  console.log('Actions: new ingredient: ', newIngredient);
  axios
    .post('api/ingredient', newIngredient)
    .then(res => {
      dispatch(getIngredients());
      let profile = null;
      dispatch(setSelectedIngredient(res.data, profile, false));
      dispatch(closeAddIngredientPanel(false));
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
    });
};
