import {
  GET_VENUE,
  VENUE_LOADING,
  REMOVE_VENUE_LOADING,
  CLEAR_CURRENT_VENUE,
  SAVE_VENUE
} from '../../redux/types';

const initialState = {
  venue: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case VENUE_LOADING:
      return {
        ...state,
        loading: true
      };
    case REMOVE_VENUE_LOADING:
      return {
        ...state,
        loading: false
      };
    case GET_VENUE:
      return {
        ...state,
        venue: action.payload,
        loading: false
      };
    case SAVE_VENUE:
      return {
        ...state,
        venue: action.payload,
        loading: false
      };
    case CLEAR_CURRENT_VENUE:
      return {
        ...state,
        venue: null
      };

    default:
      return state;
  }
}
