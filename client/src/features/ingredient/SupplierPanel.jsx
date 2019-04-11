import React from 'react';
import PropTypes from 'prop-types';

const SupplierPanel = ({
  filteredSuppliers,
  ingredient,
  // userIngredients,
  handleSelectSupplier
  // handleSetProfileSupplier
}) => {
  // console.log(ingredient);

  let supplierContent = '';

  if (ingredient.selected) {
    if (filteredSuppliers.length > 0) {
      supplierContent = filteredSuppliers.map(supplier => (
        <li
          style={{ cursor: 'pointer' }}
          key={supplier.supplier._id}
          id={supplier.supplier._id}
          onClick={handleSelectSupplier}
        >
          {supplier.supplier.displayName}
        </li>
      ));
    } else {
      supplierContent = (
        <li>
          There are no suppliers avalaible for this ingredient..
        </li>
      );
    }
  } else {
    supplierContent = (
      <li>Please select an ingredient to use supplier panel</li>
    );
  }

  return (
    <section className="supplier_panel">
      <h1>Supplier Pannel</h1>

      <ul>{supplierContent}</ul>
    </section>
  );
};

SupplierPanel.propTypes = {
  filteredSuppliers: PropTypes.array.isRequired,
  ingredient: PropTypes.object.isRequired,
  // userIngredients: PropTypes.array.isRequired,
  handleSelectSupplier: PropTypes.func.isRequired
  // handleSetProfileSupplier: PropTypes.func.isRequired
};

export default SupplierPanel;
