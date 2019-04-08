import {
  GET_INGREDIENTS,
  INGREDIENTS_LOADING,
  INGREDIENTS_LOADING_FALSE
  // CLEAR_CURRENT_VENUE,
  // SAVE_VENUE
} from '../../redux/types';

const initialState = {
  ingredients: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case INGREDIENTS_LOADING:
      return {
        ...state,
        loading: true
      };
    case INGREDIENTS_LOADING_FALSE:
      return {
        ...state,
        loading: false
      };
    case GET_INGREDIENTS:
      return {
        ...state,
        ingredients: action.payload,
        loading: false
      };
    default:
      return state;
  }
}
