import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';

const SelectInput = ({
  options,
  getSelectedValue,
  checkFocus,
  value
}) => {
  const handleChange = (newValue, actionMeta) => {
    if (newValue) {
      // Pass the selected value to the parent component
      getSelectedValue(newValue);
    }
  };

  // What to do when input is being typed
  // const handleInputChange = (inputValue, actionMeta) => {};

  const handleOnFocus = () => {
    if (checkFocus) {
      checkFocus(true);
    }
  };

  return (
    <div>
      <CreatableSelect
        isClearable
        onChange={handleChange}
        // onInputChange={handleInputChange}
        value={value}
        options={options}
        onFocus={handleOnFocus}
      />
    </div>
  );
};

export default SelectInput;
