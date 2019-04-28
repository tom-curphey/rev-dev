import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  setSelectedIngredientSupplier,
  addAndSetSelectedIngredientSupplier
} from './ingredientActions';
import { openAddSupplierPanel } from './supplierActions';
import isEmpty from '../../utils/validation/is.empty';
import Spinner from '../../utils/spinner/Spinner';
// import TextInput from '../../utils/input/TextInput';
import SelectSupplier from './SelectSupplier';

class SupplierPanel extends Component {
  state = {
    filteredSearchSuppliersArray: []
  };

  // handles the event when the user clicks on the supplier
  handleSelectIngredientSupplier = e => {
    console.log(
      'this.props.selectedIngredient: ',
      this.props.ingredient.selectedIngredient
    );
    const clickedOnIngredientSupplier = this.props.ingredient.selectedIngredient.suppliers.filter(
      clickedOnSupplier => {
        return clickedOnSupplier.supplier._id === e.target.id;
      }
    );
    this.props.setSelectedIngredientSupplier(
      clickedOnIngredientSupplier[0]
      // this.props.selectedIngredient
    );
  };

  getSelectedSupplier = (selectedSupplier, addSupplier) => {
    console.log('addSupplier: ', addSupplier);

    if (addSupplier) {
      this.props.openAddSupplierPanel(selectedSupplier);
    } else {
      this.props.addAndSetSelectedIngredientSupplier(
        selectedSupplier,
        this.props.ingredient.selectedIngredient
      );
    }
  };

  render() {
    const {
      loading,
      selectedIngredient,
      selectedIngredientSupplier
    } = this.props.ingredient;
    const { suppliers } = this.props.supplier;
    const { filteredSearchSuppliersArray } = this.state;
    let notAnIngredientSuppliers = [];

    // console.log('Supplier: ', suppliers);
    // console.log('selectedIngredient: ', selectedIngredient);

    console.log('selectedIngredient: ', selectedIngredient);

    if (
      suppliers !== null &&
      selectedIngredient !== null &&
      selectedIngredient.new !== true
    ) {
      for (let s = 0; s < suppliers.length; s++) {
        let check = 0;
        for (
          let sI = 0;
          sI < selectedIngredient.suppliers.length;
          sI++
        ) {
          if (
            suppliers[s]._id ===
            selectedIngredient.suppliers[sI].supplier._id
          ) {
            check = 1;
          }
        }
        if (check === 0) {
          notAnIngredientSuppliers.push(suppliers[s]);
        }
      }
    }

    let supplierContent = '';
    let addSupplierForm = '';

    if (loading === true) {
      supplierContent = <Spinner />;
    } else {
      if (!isEmpty(selectedIngredient)) {
        if (
          selectedIngredient.new !== true &&
          selectedIngredient.suppliers.length > 0
        ) {
          /// Check to see if this updates when the redux state changes..

          supplierContent = selectedIngredient.suppliers.map(
            supplier => (
              <li
                style={{ cursor: 'pointer' }}
                key={supplier.supplier._id}
                id={supplier.supplier._id}
                onClick={this.handleSelectIngredientSupplier}
              >
                {supplier.supplier.displayName}
                {supplier.preferred && '**'}
              </li>
            )
          );
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
    }

    if (!isEmpty(selectedIngredient)) {
      addSupplierForm = (
        <React.Fragment>
          <h1>+ Add Supplier</h1>
          <form style={{ border: 'none' }}>
            <SelectSupplier
              getSelectedSupplier={this.getSelectedSupplier}
              suppliers={notAnIngredientSuppliers}
            />
          </form>
          <ul className="filterList">
            {filteredSearchSuppliersArray &&
              filteredSearchSuppliersArray.map(
                filteredSearchSupplier => {
                  return (
                    <li
                      id={filteredSearchSupplier._id}
                      key={filteredSearchSupplier._id}
                      style={{ cursor: 'pointer' }}
                      onClick={this.handleSelectSupplier.bind(this)}
                    >
                      {filteredSearchSupplier.displayName}
                    </li>
                  );
                }
              )}
            {filteredSearchSuppliersArray.length > 0 && (
              <li onClick={this.handleAddSupplier}>+ Add Supplier</li>
            )}
          </ul>
        </React.Fragment>
      );
    }
    return (
      <section className="supplier_panel">
        <h1>Supplier Pannel</h1>
        {selectedIngredient &&
          selectedIngredientSupplier === null && (
            <p>** Please select a supplier</p>
          )}
        <ul>{supplierContent}</ul>
        {addSupplierForm}
      </section>
    );
  }
}

const actions = {
  setSelectedIngredientSupplier,
  addAndSetSelectedIngredientSupplier,
  openAddSupplierPanel
};

const mapState = state => ({
  profile: state.profile,
  ingredient: state.ingredient,
  supplier: state.supplier,
  errors: state.errors
});

SupplierPanel.propTypes = {
  setSelectedIngredientSupplier: PropTypes.func.isRequired,
  openAddSupplierPanel: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(SupplierPanel);
