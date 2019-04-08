import React from 'react';
import PropTypes from 'prop-types';

const SupplierPanel = ({
  filteredSuppliers,
  ingredient,
  userIngredients,
  handleSelectSupplier,
  handleSetUserSupplier
}) => {
  // console.log(ingredient);

  let supplierContent = '';

  if (ingredient.selected) {
    if (filteredSuppliers.length > 0) {
      // const filterSuppliersThatSupplyIngredient = ingredient.suppliers.filter(
      //   o1 => {
      //     return suppliers.some(o2 => {
      //       return o1.supplier._id === o2._id; // return the ones with equal id
      //     });
      //   }
      // );

      // function compare(a, b) {
      //   const supplierA = a.supplier.displayName;
      //   const supplierB = b.supplier.displayName;

      //   let comparison = 0;
      //   if (supplierA > supplierB) {
      //     comparison = 1;
      //   } else if (supplierA < supplierB) {
      //     comparison = -1;
      //   }
      //   return comparison;
      // }

      // const filteredSuppliers = filterSuppliersThatSupplyIngredient.sort(
      //   compare
      // );

      // console.log('filteredSuppliers: ', filteredSuppliers);

      // if (ingredient.userIngredient) {
      //   const selectedUserIngredient = userIngredients.filter(
      //     uIngredient => {
      //       return uIngredient.ingredient === ingredient._id;
      //     }
      //   );

      //   const selectedUserSupplier = filteredSuppliers.filter(
      //     selectSupplier => {
      //       console.log(
      //         'selectSupplier: ',
      //         selectSupplier.supplier._id
      //       );
      //       console.log(
      //         'selectedUserIngredient[0]: ',
      //         selectedUserIngredient[0].supplier
      //       );

      //       if (
      //         selectSupplier.supplier._id ===
      //         selectedUserIngredient[0].supplier
      //       ) {
      //         selectSupplier.packageCost =
      //           selectedUserIngredient[0].packageCost;
      //         selectSupplier.packageGrams =
      //           selectedUserIngredient[0].packageGrams;
      //         return selectSupplier;
      //       } else {
      //         return null;
      //       }
      //     }
      //   );

      //   // handleSetUserSupplier(selectedUserSupplier);
      // }

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
  userIngredients: PropTypes.array.isRequired,
  handleSelectSupplier: PropTypes.func.isRequired,
  handleSetUserSupplier: PropTypes.func.isRequired
};

export default SupplierPanel;
