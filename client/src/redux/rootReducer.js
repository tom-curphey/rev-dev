import { combineReducers } from 'redux';
import authReducer from '../features/auth/authReducer';
import profileReducer from '../features/profile/profileReducer';
import venueReducer from '../features/venue/venueReducer';
import recipeReducer from '../features/recipe/recipeReducer';
import errorReducer from './errorReducer';
import ingredientReducer from '../features/ingredient/ingredientReducer';
import supplierReducer from '../features/ingredient/supplierReducer';

export default combineReducers({
  auth: authReducer,
  profile: profileReducer,
  errors: errorReducer,
  venue: venueReducer,
  recipe: recipeReducer,
  ingredient: ingredientReducer,
  supplier: supplierReducer
});
