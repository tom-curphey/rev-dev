import React from 'react';
import PropTypes from 'prop-types';

const TextInput = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  type,
  onChange,
  disabled,
  id
}) => {
  return (
    <label htmlFor={name}>
      {label}{' '}
      <input
        onChange={onChange}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        id={id}
      />
      {info && <small>{info}</small>}
      {error && <span>{error}</span>}
    </label>
  );
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.string
};

TextInput.defaultProps = {
  type: 'text'
};

export default TextInput;
