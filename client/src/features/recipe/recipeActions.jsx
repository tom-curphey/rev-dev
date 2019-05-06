import axios from 'axios';
import { GET_ERRORS, GET_RECIPES } from '../../redux/types';
// import {
//   GET_VENUE,
//   VENUE_LOADING
//   // CLEAR_CURRENT_VENUE,
//   // GET_ERRORS,
//   // SET_CURRENT_USER,
//   // SAVE_VENUE
// } from '../../redux/types';

// // Get current venue
// export const getCurrentVenue = () => dispatch => {
//   dispatch(setVenueLoading());
//   axios
//     .get('/api/venue')
//     .then(res =>
//       dispatch({
//         type: GET_VENUE,
//         payload: res.data
//       })
//     )
//     // If there is no venue that is ok and we want to
//     // pass an emply object to let the component know to
//     // Promote the user to add a venue
//     .catch(err =>
//       dispatch({
//         type: GET_VENUE,
//         payload: {}
//       })
//     );
// };

export const getRecipes = () => dispatch => {
  console.log('Called');

  axios
    .get('/api/recipe/all')
    .then(res => {
      dispatch({
        type: GET_RECIPES,
        payload: res.data
      });
    })
    .catch({
      GET_RECIPES,
      payload: {}
    });
};

export const addRecipe = recipeData => dispatch => {
  // dispatch(setVenueLoading());
  axios.post('/api');
};
