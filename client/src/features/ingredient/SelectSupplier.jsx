import React from 'react';
import PropTypes from 'prop-types';
import CreatableSelectInput from '../../utils/input/CreatableSelectInput';

const SelectSupplier = ({ getSelectedSupplier, suppliers }) => {
  const getSelectedValue = selectedValue => {
    let addSupplier = false;
    let selectSupplier = [];
    console.log(selectedValue);

    if (selectedValue.__isNew__) {
      console.log('NEW');
      addSupplier = true;
      const newSupplier = {};
      newSupplier.packageCost = '0';
      newSupplier.packageGrams = '0';

      newSupplier.supplier = {};
      newSupplier.supplier.displayName = selectedValue.label;
      newSupplier.new = true;
      selectSupplier.push(newSupplier);
    } else {
      selectSupplier = suppliers.filter(supplier => {
        return supplier._id === selectedValue.value;
      });
    }
    getSelectedSupplier(selectSupplier[0], addSupplier);
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
      <CreatableSelectInput
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
