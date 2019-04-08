// import {
//   GET_RECIPE,
//   RECIPE_LOADING,
//   CLEAR_CURRENT_RECIPE,
//   SAVE_RECIPE
// } from '../../redux/types';

const initialState = {
  recipe: null,
  loading: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return initialState;
  }
}
