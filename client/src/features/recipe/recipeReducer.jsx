import {
  GET_RECIPES,
  ADD_RECIPE,
  RECIPE_LOADING,
  SET_SELECTED_RECIPE,
  REMOVE_SELECTED_RECIPE,
  REMOVE_RECIPE_LOADING
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
    case REMOVE_SELECTED_RECIPE:
      return {
        ...state,
        selectedRecipe: null,
        loading: true
      };
    case RECIPE_LOADING:
      return {
        ...state,
        loading: true
      };
    case REMOVE_RECIPE_LOADING:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
