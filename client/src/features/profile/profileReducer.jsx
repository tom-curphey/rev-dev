import {
  SET_USER_PROFILE,
  PROFILE_LOADING,
  SAVE_PROFILE_INGREDIENT
} from '../../redux/types';

const initialState = {
  profile: {},
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_USER_PROFILE:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };
    case PROFILE_LOADING:
      return {
        ...state,
        loading: true
      };
    case SAVE_PROFILE_INGREDIENT:
      return {
        ...state,
        profile: action.payload
      };
    default:
      return state;
  }
}
