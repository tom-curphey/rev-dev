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

export const setSelectedIngredient = (
  selectedIngredient,
  profile,
  suppliers,
  selectIngredientSupplier
) => dispatch => {
  console.log('profile.ingredients:', profile.ingredients);

  // Check if the ingredient selected is in the profile ingredients
  const checkProfileIngredient = profile.ingredients.filter(
    profileIngredient => {
      if (profileIngredient.ingredient === selectedIngredient._id) {
        selectedIngredient.profileIngredient = true;
        return selectedIngredient;
      }
      return null;
    }
  );

  console.log('@@@@@@@@@ selectedIngredient: ', selectedIngredient);
  console.log('@@@@@@@@@ profile: ', profile);
  console.log('@@@@@@@@@ suppliers.length: ', suppliers.length);

  // Filters ingredient suppliers and puts them in ABC order
  // If successful set filteredIngredientSuppilersArray[]
  let abcFilteredSuppliers = null;
  if (
    selectedIngredient.suppliers.length > 0 &&
    suppliers.length > 0
  ) {
    const filteredIngredientSuppliers = selectedIngredient.suppliers.filter(
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

    selectedIngredient.suppliers = filteredIngredientSuppliers.sort(
      compare
    );
  }

  console.log('Should be filtered ABC -> ', setSelectedIngredient);

  // Filter suppliers
  if (
    checkProfileIngredient.length > 0 &&
    selectedIngredient.suppliers !== null
  ) {
    // console.log('profile: ', checkProfileIngredient[0].suppliers);
    // console.log('selectedIngredient: ', selectedIngredient.suppliers);

    // Check profile ingredient suppliers
    const profileIngredientSuppliersToUpdate = checkProfileIngredient[0].suppliers.filter(
      fromProfileIngredient => {
        return selectedIngredient.suppliers.some(fromIngredient => {
          if (
            fromProfileIngredient.supplier ===
            fromIngredient.supplier._id
          ) {
            return fromProfileIngredient;
          }
        });
      }
    );
    console.log(
      '>>>>>>>> profileIngredientSuppliersToUpdate: ',
      profileIngredientSuppliersToUpdate
    );

    let updatedSelectedProfileIngredientSupplier = null;
    let newIngredientSuppliers = [];
    for (
      var dis = 0;
      dis < selectedIngredient.suppliers.length;
      dis++
    ) {
      for (
        var pis = 0;
        pis < profileIngredientSuppliersToUpdate.length;
        pis++
      ) {
        if (
          selectedIngredient.suppliers[dis].supplier._id ===
          profileIngredientSuppliersToUpdate[pis].supplier
        ) {
          let newIngredientSupplier = {};
          newIngredientSupplier.supplier = {};
          newIngredientSupplier._id =
            selectedIngredient.suppliers[dis]._id;
          newIngredientSupplier.packageCost =
            profileIngredientSuppliersToUpdate[pis].packageCost;
          newIngredientSupplier.packageGrams =
            profileIngredientSuppliersToUpdate[pis].packageGrams;
          newIngredientSupplier.prefered =
            profileIngredientSuppliersToUpdate[pis].prefered;

          newIngredientSupplier.supplier._id =
            selectedIngredient.suppliers[dis].supplier._id;
          newIngredientSupplier.supplier.displayName =
            selectedIngredient.suppliers[dis].supplier.displayName;
          newIngredientSuppliers.push(newIngredientSupplier);

          if (selectIngredientSupplier) {
            if (profileIngredientSuppliersToUpdate[pis].prefered) {
              updatedSelectedProfileIngredientSupplier = newIngredientSupplier;
            }
          }
        }
      }
    }

    console.log('newIngredientSuppliers: ', newIngredientSuppliers);
    if (newIngredientSuppliers.length > 0) {
      selectedIngredient.suppliers = newIngredientSuppliers;
    }

    console.log('newIngredientSuppliers: ', newIngredientSuppliers);

    if (updatedSelectedProfileIngredientSupplier !== null) {
      dispatch(
        setSelectedIngredientSupplier(
          updatedSelectedProfileIngredientSupplier
        )
      );
    }
  } else {
    console.log(
      'Ingredeint supplier is not in profile ingredients...'
    );
  }

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
  console.log(
    '****** selectedIngredient.suppliers: ',
    selectedIngredient.suppliers
  );
  console.log('****** supplier: ', supplier);
  console.log(
    '****** profileIngredientSupplierData: ',
    profileIngredientSupplierData
  );

  // dispatch(setIngredientsLoading());
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
    'selectedIngredientSupplier: ',
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

      if (res.data.ingredientSaved.suppliers.length > 0) {
        console.log('[INNER] - res.data: ', res.data);
        let count = 0;
        let index = 0;
        const updatedIngredientSuppliers = res.data.ingredientSaved.suppliers.map(
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

        res.data.ingredientSaved.suppliers = updatedIngredientSuppliers;

        dispatch({
          type: SET_SELECTED_INGREDIENT,
          payload: res.data.ingredientSaved
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
