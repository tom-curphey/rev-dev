import axios from 'axios';
import {
  GET_SUPPLIERS,
  SUPPLIERS_LOADING,
  OPEN_SUPPLIER_PANEL,
  CLOSE_SUPPLIER_PANEL,
  SET_SELECTED_INGREDIENT_SUPPLIER,
  GET_ERRORS,
  REMOVE_SUPPLIERS,
  INGREDIENTS_LOADING,
  INGREDIENTS_LOADING_FALSE
} from '../../redux/types';
import capitalizeFirstLetter from '../../utils/functions/capitalizeFirstLetter';
import { addAndSetSelectedIngredientSupplier } from './ingredientActions';

// Get Suppliers and set redux state with suppliers
export const getSuppliers = () => dispatch => {
  dispatch(setSuppliersLoading());
  axios
    .get('api/supplier/all')
    .then(res =>
      dispatch({
        type: GET_SUPPLIERS,
        payload: res.data
      })
    )
    .catch({
      GET_SUPPLIERS,
      payload: {}
    });
};

export const clearSuppliers = () => dispatch => {
  dispatch({
    type: REMOVE_SUPPLIERS
  });
};

// Suppliers loading
export const setSuppliersLoading = () => {
  return {
    type: SUPPLIERS_LOADING
  };
};

export const openAddSupplierPanel = newSupplier => dispatch => {
  newSupplier.supplier.displayName = capitalizeFirstLetter(
    newSupplier.supplier.displayName
  );
  dispatch({
    type: OPEN_SUPPLIER_PANEL
  });
  dispatch({
    type: SET_SELECTED_INGREDIENT_SUPPLIER,
    payload: newSupplier
  });
};

export const closeAddSupplierPanel = removeSelectedSupplierData => dispatch => {
  console.log('Close Panel');
  dispatch({
    type: CLOSE_SUPPLIER_PANEL
  });
};

export const addNewSupplier = (
  newSupplier,
  selectedIngredient
) => dispatch => {
  console.log('Actions newSupplier: ', newSupplier);
  console.log('Actions selectedIngredient: ', selectedIngredient);
  dispatch({
    type: INGREDIENTS_LOADING
  });
  axios
    .post('api/supplier', newSupplier)
    .then(res => {
      console.log('res.data: ', res.data);
      dispatch(
        addAndSetSelectedIngredientSupplier(
          res.data,
          selectedIngredient
        )
      );
      dispatch({
        type: CLOSE_SUPPLIER_PANEL
      });
    })
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      dispatch({
        type: INGREDIENTS_LOADING_FALSE
      });
    });
};
