import axios from 'axios';
import { GET_SUPPLIERS, SUPPLIERS_LOADING } from '../../redux/types';

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
