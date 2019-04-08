import React from 'react';
import PropTypes from 'prop-types';

const TextArea = ({
  name,
  placeholder,
  value,
  label,
  error,
  info,
  onChange
}) => {
  return (
    <label htmlFor={name}>
      {label}{' '}
      <textarea
        onChange={onChange}
        name={name}
        value={value}
        placeholder={placeholder}
      />
      {info && <small>{info}</small>}
      {error && <span>{error}</span>}
    </label>
  );
};

TextArea.propTypes = {
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  info: PropTypes.string,
  error: PropTypes.string,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default TextArea;
