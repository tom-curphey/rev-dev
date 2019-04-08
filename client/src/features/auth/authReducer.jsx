import isEmpty from '../../utils/validation/is.empty';
import {
  SET_CURRENT_USER,
  SAVE_USER_INGREDIENT
} from '../../redux/types';

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload
      };
    case SAVE_USER_INGREDIENT:
      return {
        ...state,
        user: action.payload
      };

    default:
      return state;
  }
}
