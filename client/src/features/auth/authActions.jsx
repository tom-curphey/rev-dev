import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import { GET_ERRORS, SET_CURRENT_USER } from '../../redux/types';

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post('/api/user/register', userData)
    .then(res => history.push('/login'))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Login - Get User Token
export const loginUser = (userData, history) => dispatch => {
  axios
    .post('/api/user/login', userData)
    .then(res => {
      // Save token to localStorage
      const { token } = res.data;
      // Set token to localStorage
      // localStorage only accepts strings as data
      localStorage.setItem('jwtToken', token);
      // Set Token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decodedData = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decodedData));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decodedData => {
  // console.log('decodedData: ', decodedData);

  return {
    type: SET_CURRENT_USER,
    payload: decodedData
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set the current user to an empty {} which will set isAuthenticated to false
  // If set current user recieves an empty object it will turn isAuthenticated to false
  dispatch(setCurrentUser({}));
};

export const reactivateUser = () => dispatch => {
  axios
    .post('/api/user/reactivate')
    .then(res =>
      dispatch({
        type: SET_CURRENT_USER,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
