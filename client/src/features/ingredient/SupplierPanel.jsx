import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setSelectedIngredientSupplier } from './ingredientActions';
import isEmpty from '../../utils/validation/is.empty';
import Spinner from '../../utils/spinner/Spinner';

class SupplierPanel extends Component {
  // constructor(props) {
  //   super(props);
  // }

  handleSelectIngredientSupplier = e => {
    const clickedOnIngredientSupplier = this.props.selectedIngredient.suppliers.filter(
      clickedOnSupplier => {
        return clickedOnSupplier.supplier._id === e.target.id;
      }
    );
    this.props.setSelectedIngredientSupplier(
      clickedOnIngredientSupplier[0],
      this.props.selectedIngredient
    );
  };

  render() {
    const {
      loading,
      selectedIngredient,
      selectedIngredientSupplier
    } = this.props.ingredient;

    let supplierContent = '';

    if (loading === true) {
      supplierContent = <Spinner />;
    } else {
      if (!isEmpty(selectedIngredient)) {
        if (selectedIngredient.suppliers.length > 0) {
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
                {supplier.prefered && '**'}
              </li>
            )
          );
        } else {
          supplierContent = (
            <li>
              There are no suppliers avalaible for this ingredient..
              '+ Add Supplier.'
            </li>
          );
        }
      } else {
        supplierContent = (
          <li>Please select an ingredient to use supplier panel</li>
        );
      }
    }

    return (
      <section className="supplier_panel">
        <h1>Supplier Pannel</h1>
        <ul>{supplierContent}</ul>
        {selectedIngredient &&
          selectedIngredientSupplier === null && (
            <p>** Please select a supplier</p>
          )}
      </section>
    );
  }
}

const actions = {
  setSelectedIngredientSupplier
};

const mapState = state => ({
  ingredient: state.ingredient
});

SupplierPanel.propTypes = {
  setSelectedIngredientSupplier: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(SupplierPanel);
