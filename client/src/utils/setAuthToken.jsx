import axios from 'axios';

// This function puts the Auth Token in the header with each axios request
const setAuthToken = token => {
  if (token) {
    // Apply token to every request in the auth header
    axios.defaults.headers.common['Authorization'] = token;
  } else {
    // Remove token from auth header
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setAuthToken;
