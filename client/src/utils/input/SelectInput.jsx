import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';

const SelectInput = ({
  options,
  label,
  getSelectedValue,
  checkFocus,
  onChange,
  value,
  name
}) => {
  const selectOptions = options.map(option => (
    <option key={option.label} value={option.value}>
      {option.label}
    </option>
  ));
  return (
    <div>
      <label htmlFor={name}>
        {label}{' '}
        <select name={name} value={value} onChange={onChange}>
          {selectOptions}
        </select>
      </label>
    </div>
  );
};

export default SelectInput;
