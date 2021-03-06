import { GET_ERRORS, REMOVE_ERRORS } from './types';

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      // We only need to say action.payload as the payload contains the errors object
      return action.payload;
    case REMOVE_ERRORS:
      // We only need to say action.payload as the payload contains the empty errors object
      return action.payload;

    default:
      return state;
  }
}
