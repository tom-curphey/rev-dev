import React from 'react';
import PropTypes from 'prop-types';

const SelectInput = ({
  name,
  value,
  label,
  error,
  info,
  onChange,
  options
}) => {
  const selectOptions = options.map((option, i) => (
    <option key={i} value={option.label}>
      {option.value}
    </option>
  ));

  return (
    <label htmlFor={name}>
      {label}{' '}
      <select onChange={onChange} name={name} value={value}>
        {selectOptions}
      </select>
      {info && <small>{info}</small>}
      {error && <span>{error}</span>}
    </label>
  );
};

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
};

export default SelectInput;
