import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';

const SelectInput = ({
  options,
  label,
  getSelectedValue,
  checkFocus,
  onChange,
  value,
  name,
  id
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
      <label htmlFor={name}>
        {label}{' '}
        <select name={name} value={value} onChange={onChange} id={id}>
          {selectOptions}
        </select>
      </label>
    </div>
  );
};

export default SelectInput;
