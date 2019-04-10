import axios from 'axios';
import { SET_USER_PROFILE, PROFILE_LOADING } from '../../redux/types';

// Get User Profile
export const getUserProfile = () => dispatch => {
  dispatch(setProfileLoading());
  axios
    .get('api/profile')
    .then(res =>
      dispatch({
        type: SET_USER_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: SET_USER_PROFILE,
        payload: err
      })
    );
};

// Profile Loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
};
