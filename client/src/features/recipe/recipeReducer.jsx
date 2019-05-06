import { GET_RECIPES } from '../../redux/types';

const initialState = {
  recipes: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_RECIPES:
      return {
        ...state,
        recipes: action.payload,
        loading: false
      };

    default:
      return initialState;
  }
}
