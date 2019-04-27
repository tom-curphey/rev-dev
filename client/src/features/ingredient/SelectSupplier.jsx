import React from 'react';
import PropTypes from 'prop-types';
import SelectInput from '../../utils/input/SelectInput';

const SelectSupplier = ({ getSelectedSupplier, suppliers }) => {
  const getSelectedValue = selectedValue => {
    const selectSupplier = suppliers.filter(supplier => {
      return supplier._id === selectedValue.value;
    });
    getSelectedSupplier(selectSupplier[0]);
  };

  let formContent = '';

  if (suppliers !== null) {
    const options = suppliers.map(supplier => {
      let selectData = {};
      selectData.label = supplier.displayName;
      selectData.value = supplier._id;
      return selectData;
    });

    formContent = (
      <SelectInput
        label="Search Supplier"
        name="supplier"
        options={options}
        getSelectedValue={getSelectedValue}
      />
    );
  }

  return (
    <React.Fragment>{formContent && formContent}</React.Fragment>
  );
};

SelectSupplier.propTypes = {
  suppliers: PropTypes.array.isRequired,
  getSelectedSupplier: PropTypes.func.isRequired
};

export default SelectSupplier;
