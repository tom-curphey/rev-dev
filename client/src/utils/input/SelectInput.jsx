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
  // const handleInputChange = (inputValue, actionMeta) => {
  //   console.log('Input Changed..');
  // };

  return (
    <div>
      <CreatableSelect
        isClearable
        onChange={handleChange}
        // onInputChange={handleInputChange}
        value={value}
        options={options}
      />
    </div>
  );
};

export default SelectInput;
