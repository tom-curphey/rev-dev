import React from 'react';
import { roundNumber } from '../../utils/utilityFunctions';
import { isNumber } from 'util';

const twoDecimalNumber = value => {
  let result = '';
  if (isNumber(value) && !isNaN(value) && value !== null) {
    result = roundNumber(value, 2);
  }

  return result;
};

export default twoDecimalNumber;
