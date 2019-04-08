import { combineReducers } from 'redux';
import authReducer from '../features/auth/authReducer';
import venueReducer from '../features/venue/venueReducer';
import recipeReducer from '../features/recipe/recipeReducer';
import errorReducer from './errorReducer';
import ingredientReducer from '../features/ingredient/ingredientReducer';
import supplierReducer from '../features/ingredient/supplierReducer';

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  venue: venueReducer,
  recipe: recipeReducer,
  ingredient: ingredientReducer,
  supplier: supplierReducer
});
