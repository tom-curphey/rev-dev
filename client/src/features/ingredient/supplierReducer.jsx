import {
  GET_SUPPLIERS,
  SUPPLIERS_LOADING,
  OPEN_SUPPLIER_PANEL,
  CLOSE_SUPPLIER_PANEL
} from '../../redux/types';

const initialState = {
  suppliers: null,
  openSupplierPanel: false,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SUPPLIERS_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_SUPPLIERS:
      return {
        ...state,
        suppliers: action.payload,
        loading: false
      };
    case OPEN_SUPPLIER_PANEL:
      return {
        ...state,
        openSupplierPanel: true
      };
    case CLOSE_SUPPLIER_PANEL:
      return {
        ...state,
        openSupplierPanel: false
      };
    default:
      return state;
  }
}
