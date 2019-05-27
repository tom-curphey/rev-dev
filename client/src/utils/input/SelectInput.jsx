import React from 'react';

const SelectInput = ({
  options,
  label,
  onChange,
  value,
  name,
  id,
  labelClass
}) => {
  const selectOptions = options.map(option => (
    <option
      key={option.label}
      value={option.value}
      disabled={option.disabled}
    >
      {option.label}
    </option>
  ));
  return (
    <div>
      <label htmlFor={name} className={labelClass}>
        {label}{' '}
        <select name={name} value={value} onChange={onChange} id={id}>
          {selectOptions}
        </select>
      </label>
    </div>
  );
};

export default SelectInput;
