import {
  GET_RECIPES,
  ADD_RECIPE,
  RECIPE_LOADING,
  SET_SELECTED_RECIPE
} from '../../redux/types';

const initialState = {
  recipes: null,
  selectedRecipe: null,
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
    case ADD_RECIPE:
      return {
        ...state,
        selectedRecipe: action.payload,
        loading: false
      };
    case SET_SELECTED_RECIPE:
      return {
        ...state,
        selectedRecipe: action.payload,
        loading: false
      };
    case RECIPE_LOADING:
      return {
        ...state,
        loading: true
      };
    default:
      return initialState;
  }
}
