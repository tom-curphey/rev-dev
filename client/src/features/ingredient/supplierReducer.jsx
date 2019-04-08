import {
  GET_SUPPLIERS,
  SUPPLIERS_LOADING
  // CLEAR_CURRENT_VENUE,
  // SAVE_VENUE
} from '../../redux/types';

const initialState = {
  suppliers: null,
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
    default:
      return state;
  }
}
