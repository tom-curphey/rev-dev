import {
  GET_INGREDIENTS,
  INGREDIENTS_LOADING,
  INGREDIENTS_LOADING_FALSE,
  SET_SELECTED_INGREDIENT,
  SET_SELECTED_INGREDIENT_SUPPLIER,
  REMOVE_SELECTED_INGREDIENT
} from '../../redux/types';

const initialState = {
  ingredients: null,
  loading: false,
  selectedIngredient: null,
  selectedIngredientSupplier: null
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
    case SET_SELECTED_INGREDIENT:
      return {
        ...state,
        selectedIngredient: action.payload
      };
    case REMOVE_SELECTED_INGREDIENT:
      return {
        ...state,
        selectedIngredient: null,
        selectedIngredientSupplier: null
      };
    case SET_SELECTED_INGREDIENT_SUPPLIER:
      return {
        ...state,
        selectedIngredientSupplier: action.payload
      };
    default:
      return state;
  }
}
