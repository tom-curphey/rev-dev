import React, { Component } from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';

const SelectInput = ({ options, getSelectedValue, checkFocus }) => {
  const handleChange = (newValue, actionMeta) => {
    console.group('Value Changed');
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();

    if (newValue) {
      // Pass the selected value to the parent component
      getSelectedValue(newValue);
    }
  };

  // What to do when input is being typed
  const handleInputChange = (inputValue, actionMeta) => {
    console.group('Input Changed');
    console.log(inputValue);
    console.log(`action: ${actionMeta.action}`);
    console.groupEnd();
  };

  const handleOnFocus = () => {
    if (checkFocus) {
      checkFocus(true);
    }
  };

  return (
    <div>
      {/* <Select options={options} /> */}
      <CreatableSelect
        isClearable
        onChange={handleChange}
        onInputChange={handleInputChange}
        options={options}
        onFocus={handleOnFocus}
      />
    </div>
  );
};

export default SelectInput;
