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
import { select } from 'async';

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
  suppliers
) => dispatch => {
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

  // console.log('@@@@@@@@@ selectedIngredient: ', selectedIngredient);
  // console.log('@@@@@@@@@ profile: ', profile);
  // console.log('@@@@@@@@@ suppliers.length: ', suppliers.length);

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

  // Filter suppliers
  if (
    checkProfileIngredient.length > 0 &&
    selectedIngredient.suppliers !== null
  ) {
    // console.log('profile: ', checkProfileIngredient[0].suppliers);
    // console.log('selectedIngredient: ', selectedIngredient.suppliers);

    const profileIngredientSuppliersToUpdate = checkProfileIngredient[0].suppliers.filter(
      fromProfileIngredient => {
        return selectedIngredient.suppliers.some(fromIngredient => {
          // return the ones with equal id
          // console.log(
          //   'fromProfileIngredient:',
          //   fromProfileIngredient
          // );
          // console.log('fromIngredient:', fromIngredient);
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

          if (profileIngredientSuppliersToUpdate[pis].prefered) {
            updatedSelectedProfileIngredientSupplier = newIngredientSupplier;
          }
        }
      }
    }

    console.log('newIngredientSuppliers: ', newIngredientSuppliers);
    if (newIngredientSuppliers.length > 0) {
      selectedIngredient.suppliers = newIngredientSuppliers;
    }

    // const updatedProfileIngredientSuppliers = selectedIngredient.suppliers.map(
    //   fromDatabaseIngredientSupplier => {
    //     return profileIngredientSuppliersToUpdate.map(
    //       fromProfileIngredientSupplier => {
    //         return (
    //           fromDatabaseIngredientSupplier.supplier._id ===
    //           fromProfileIngredientSupplier.supplier
    //         );

    //         // if (
    //         //   fromDatabaseIngredientSupplier.supplier._id ===
    //         //   fromProfileIngredientSupplier.supplier
    //         // ) {
    //         //   console.log(
    //         //     'fromDatabaseIngredientSupplier: ',
    //         //     fromDatabaseIngredientSupplier
    //         //   );
    //         //   console.log(
    //         //     'fromProfileIngredientSupplier: ',
    //         //     fromProfileIngredientSupplier
    //         //   );

    //         //   let newOb = { name: 'Kalindi' };

    //         //   // fromDatabaseIngredientSupplier.packageCost = fromProfileIngredientSupplier.packageCost.toString();
    //         //   // fromDatabaseIngredientSupplier.packageGrams = fromProfileIngredientSupplier.packageGrams.toString();
    //         //   // fromDatabaseIngredientSupplier.prefered =
    //         //   //   fromProfileIngredientSupplier.prefered;
    //         //   // // if (fromProfileIngredientSupplier.prefered) {
    //         //   // //   updatedSelectedProfileIngredientSupplier = fromDatabaseIngredientSupplier;
    //         //   // // }

    //         // }
    //       }
    //     );
    //   }
    // );

    // let updatedSelectedProfileIngredientSupplier = null;
    // const updatedProfileIngredientSuppliers = selectedIngredient.suppliers.map(
    //   ingredientSupplier => {
    //     if (
    //       ingredientSupplier.supplier._id ===
    //       profileIngredientSuppliersToUpdate.supplier
    //     ) {
    //       ingredientSupplier.packageCost = profileIngredientSuppliersToUpdate[0].packageCost.toString();
    //       ingredientSupplier.packageGrams = profileIngredientSuppliersToUpdate[0].packageGrams.toString();
    //       ingredientSupplier.prefered = true;
    //       updatedSelectedProfileIngredientSupplier = ingredientSupplier;
    //       return ingredientSupplier;
    //     } else {
    //       ingredientSupplier.prefered = false;
    //       return ingredientSupplier;
    //     }
    //   }
    // );

    // console.log(
    //   'updatedSelectedProfileIngredientSupplier: ',
    //   updatedSelectedProfileIngredientSupplier
    // );
    // console.log(
    //   'KKKKKK -> updatedProfileIngredientSuppliers: ',
    //   updatedProfileIngredientSuppliers
    // );

    if (updatedSelectedProfileIngredientSupplier !== null) {
      dispatch(
        setSelectedIngredientSupplier(
          updatedSelectedProfileIngredientSupplier
        )
      );
    }
  }

  dispatch({
    type: SET_SELECTED_INGREDIENT,
    payload: selectedIngredient
  });
};

// Add / Edit Profile Ingredient
export const addOrEditProfileIngredientSupplier = (
  selectedIngredient,
  profileIngredientSupplierData,
  prefered
) => dispatch => {
  const { supplier } = profileIngredientSupplierData;
  if (prefered) {
    profileIngredientSupplierData.prefered = true;
  }
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
        setSelectedIngredient(selectedIngredient, profile, suppliers)
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
        payload: err
      });
    });
};

// Set selected ingredient supplier
export const setSelectedIngredientSupplier = selectedIngredientSupplier => dispatch => {
  // console.log(
  //   '** selectedIngredientSupplier',
  //   selectedIngredientSupplier
  // );
  // selectedIngredientSupplier.packageCost = selectedIngredientSupplier.packageCost.toString();
  // selectedIngredientSupplier.packageGrams = selectedIngredientSupplier.packageGrams.toString();

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
