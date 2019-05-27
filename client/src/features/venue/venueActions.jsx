import axios from 'axios';
import {
  GET_VENUE,
  VENUE_LOADING,
  REMOVE_VENUE_LOADING,
  CLEAR_CURRENT_VENUE,
  GET_ERRORS,
  SET_CURRENT_USER,
  SAVE_VENUE
} from '../../redux/types';

// Get current venue
export const getCurrentVenue = () => dispatch => {
  dispatch(setVenueLoading());
  axios
    .get('/api/venue')
    .then(res => {
      // console.log('res.data: ', res.data);
      dispatch({
        type: GET_VENUE,
        payload: res.data
      });
    })
    // If there is no venue that is ok and we want to
    // pass an emply object to let the component know to
    // Promote the user to add a venue
    .catch(err =>
      dispatch({
        type: GET_VENUE,
        payload: {}
      })
    );
};

// Add Venue
export const addOrEditVenue = (venueData, history) => dispatch => {
  console.log('here');

  dispatch(setVenueLoading());
  axios
    .post('/api/venue', venueData)
    .then(res => {
      history.push('/dashboard');
      dispatch({
        type: SAVE_VENUE,
        payload: res.data
      });
    })
    // .then(res => history.push('/dashboard'))
    .catch(err => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });
      dispatch(removeVenueLoading());
    });
};

// Venue loading
export const setVenueLoading = () => {
  return {
    type: VENUE_LOADING
  };
};
// Venue loading
export const removeVenueLoading = () => {
  return {
    type: REMOVE_VENUE_LOADING
  };
};

// Clear Venue
export const clearCurrentVenue = () => {
  return {
    type: CLEAR_CURRENT_VENUE
  };
};

// Delete Venue
export const deleteVenue = () => dispatch => {
  if (window.confirm('Are you sure?')) {
    axios
      .delete('/api/venue')
      .then(res =>
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        })
      )
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};
