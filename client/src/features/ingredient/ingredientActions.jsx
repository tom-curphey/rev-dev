import axios from 'axios';
import {
  GET_INGREDIENTS,
  INGREDIENTS_LOADING,
  GET_ERRORS,
  SAVE_PROFILE_INGREDIENT,
  INGREDIENTS_LOADING_FALSE,
  SET_SELECTED_INGREDIENT,
  SET_SELECTED_INGREDIENT_SUPPLIER,
  REMOVE_SELECTED_INGREDIENT
} from '../../redux/types';
import { select } from 'async';
import { isValid } from 'ipaddr.js';

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
    for (var pis = 0; pis < profileSuppliers.length; pis++) {
      if (
        selectedIngredientSuppliers[dis].supplier._id ===
        profileSuppliers[pis].supplier
      ) {
        let updatedSupplierDetails = {};
        updatedSupplierDetails.supplier = {};
        updatedSupplierDetails._id =
          selectedIngredientSuppliers[dis]._id;
        updatedSupplierDetails.packageCost =
          profileSuppliers[pis].packageCost;
        updatedSupplierDetails.packageGrams =
          profileSuppliers[pis].packageGrams;
        updatedSupplierDetails.prefered =
          profileSuppliers[pis].prefered;

        updatedSupplierDetails.supplier._id =
          selectedIngredientSuppliers[dis].supplier._id;
        updatedSupplierDetails.supplier.displayName =
          selectedIngredientSuppliers[dis].supplier.displayName;
        updatedSuppliers.push(updatedSupplierDetails);
      }
    }
  }
  return updatedSuppliers;
};

export const setSelectedIngredient = (
  selectedIngredient,
  profile,
  suppliers,
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

      console.log('----> selectedIngredient: ', selectedIngredient);

      if (selectIngredientSupplier === true) {
        const selectedIngredientSupplier = selectedIngredient.suppliers.filter(
          supplier => {
            return supplier.prefered === true;
          }
        );
        if (selectedIngredientSupplier.length > 0) {
          dispatch(
            setSelectedIngredientSupplier(
              selectedIngredientSupplier[0]
            )
          );
        } else {
          console.log('Ingredeint has prefered profile suppliers.');
          dispatch(removeSelectedIngredient());
        }
      }
    } else {
      console.log('Ingredeint has no profile suppliers.');
      dispatch(removeSelectedIngredient());
    }
  } else {
    console.log('Ingredient has no suppliers');
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
  prefered
) => dispatch => {
  const { supplier } = profileIngredientSupplierData;
  console.log(
    '^^^^^^^^%%^^^^^ selectedIngredient.suppliers: ',
    selectedIngredient.suppliers
  );
  console.log(
    'profileIngredientSupplierData: ',
    profileIngredientSupplierData
  );
  console.log('prefered....: ', prefered);
  if (prefered) {
    profileIngredientSupplierData.prefered = true;
  }
  console.log('****** selectedIngredient: ', selectedIngredient);
  console.log('****** supplier: ', supplier);
  console.log(
    '****** profileIngredientSupplierData: ',
    profileIngredientSupplierData
  );

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
      const suppliers = [];
      console.log('profile: ', profile);

      dispatch(
        setSelectedIngredient(
          selectedIngredient,
          profile,
          suppliers,
          false
        )
      );
      dispatch({
        type: SAVE_PROFILE_INGREDIENT,
        payload: profile
      });

      dispatch(ingredientsLoadingFalse());
    })
    .catch(err => {
      // console.log('-------->> err: ', err);

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

  console.log(
    'updatedSelectedIngredientSupplier: ',
    updatedSelectedIngredientSupplier
  );

  dispatch({
    type: SET_SELECTED_INGREDIENT_SUPPLIER,
    payload: updatedSelectedIngredientSupplier
  });
};

export const addAndSetSelectedIngredientSupplier = (
  newIngredientSupplier,
  selectedIngredient
) => dispatch => {
  console.log('newIngredientSupplier: ', newIngredientSupplier._id);

  const newIngredientSupplierData = {};
  newIngredientSupplierData.packageCost = '0';
  newIngredientSupplierData.packageGrams = '0';

  console.log(
    '+++> newIngredientSupplierData: ',
    newIngredientSupplierData
  );

  axios
    .post(
      `/api/ingredient/supplier/${selectedIngredient._id}/${
        newIngredientSupplier._id
      }`,
      newIngredientSupplierData
    )
    .then(res => {
      console.log('res.data: ', res.data);

      // When I had a supplier here it is getting stuck...
      // When you get an ingredient that is not in the profile it gets stuck
      // Add ingredient.. ?
      // What should I do about this?

      if (res.data.ingredient.suppliers.length > 0) {
        console.log('[INNER] - res.data: ', res.data);
        let count = 0;
        let index = 0;
        const updatedIngredientSuppliers = res.data.ingredient.suppliers.map(
          ingredientSupplierData => {
            console.log(
              'newIngredientSupplier: ',
              newIngredientSupplier
            );
            console.log(
              'ingredientSupplierData: ',
              ingredientSupplierData
            );

            if (
              ingredientSupplierData.supplier.toString() ===
              newIngredientSupplier._id.toString()
            ) {
              index = count;
              const resSupplierData = {};
              resSupplierData.supplier = {};
              console.log('resSupplierData :::: ', resSupplierData);

              resSupplierData._id = ingredientSupplierData._id;
              resSupplierData.packageCost = ingredientSupplierData.packageCost.toString();
              resSupplierData.packageGrams = ingredientSupplierData.packageGrams.toString();
              resSupplierData.prefered = false;

              resSupplierData.supplier._id =
                ingredientSupplierData.supplier;
              resSupplierData.supplier.displayName =
                newIngredientSupplier.displayName;

              ingredientSupplierData = resSupplierData;
              console.log('resSupplierData :::: ', resSupplierData);
              console.log(
                'ingredientSupplierData :::: ',
                ingredientSupplierData
              );
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

              // const currentSupplierData = {};
              // currentSupplierData.supplier = {};
              // console.log(
              //   'currentSupplierData :::: ',
              //   currentSupplierData
              // );

              // currentSupplierData._id = ingredientSupplierData._id;
              // currentSupplierData.packageCost =
              //   ingredientSupplierData.packageCost;
              // currentSupplierData.packageGrams =
              //   ingredientSupplierData.packageGrams;
              // currentSupplierData.prefered = currentSuppiler.prefered;

              // currentSupplierData.supplier._id =
              //   ingredientSupplierData.supplier;
              // currentSupplierData.supplier.displayName =
              // currentSuppiler.supplier.displayName;

              // ingredientSupplierData = currentSupplierData;

              console.log(
                'ingredientSupplierData: ---->',
                ingredientSupplierData
              );
              console.log(
                'selectedIngredient: ---->',
                selectedIngredient
              );
              console.log('currentSuppiler: ---->', currentSuppiler);
            }
            count++;
            return ingredientSupplierData;
          }
        );

        console.log('indexxxxxx', index);

        console.log(
          'updatedIngredientSuppliers: ',
          updatedIngredientSuppliers
        );

        res.data.ingredient.suppliers = updatedIngredientSuppliers;

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
