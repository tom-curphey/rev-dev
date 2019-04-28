import axios from 'axios';
import {
  GET_SUPPLIERS,
  SUPPLIERS_LOADING,
  OPEN_SUPPLIER_PANEL
} from '../../redux/types';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';

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

// Suppliers loading
export const setSuppliersLoading = () => {
  return {
    type: SUPPLIERS_LOADING
  };
};

export const openAddSupplierPanel = newSupplier => dispatch => {
  console.log('New Supplier: ', newSupplier);

  newSupplier.displayName = capitalizeFirstLetter(
    newSupplier.displayName
  );
  dispatch({
    type: OPEN_SUPPLIER_PANEL
  });
  // dispatch({
  //   type: SET_SELECTED_INGREDIENT,
  //   payload: newSupplier
  // });
};
