import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  setSelectedIngredientSupplier,
  addAndSetSelectedIngredientSupplier
} from './ingredientActions';
import isEmpty from '../../utils/validation/is.empty';
import Spinner from '../../utils/spinner/Spinner';
import TextInput from '../../utils/input/TextInput';

class SupplierPanel extends Component {
  state = {
    searchedSupplierName: '',
    filteredSearchSuppliersArray: []
  };

  handleSelectIngredientSupplier = e => {
    const clickedOnIngredientSupplier = this.props.selectedIngredient.suppliers.filter(
      clickedOnSupplier => {
        return clickedOnSupplier.supplier._id === e.target.id;
      }
    );

    console.log(
      'this.props.selectedIngredient.suppliers: ',
      this.props.selectedIngredient.suppliers
    );

    this.props.setSelectedIngredientSupplier(
      clickedOnIngredientSupplier[0]
      // this.props.selectedIngredient
    );
  };

  async handleOnChangeSearch(e) {
    let inputData = e.target.value;
    await this.setState({ searchedSupplierName: inputData });
    await this.filterSuppliers();
    if (inputData === '') {
      this.setState({ filteredSearchSuppliersArray: [] });
    }
  }

  async filterSuppliers() {
    const { searchedSupplierName } = this.state;
    const { supplier, ingredient } = this.props;
    let filteredSuppliers = supplier.suppliers;

    if (ingredient.selectedIngredient.suppliers) {
      const supplierIdArray = supplier.suppliers.map(supplier => {
        return supplier._id;
      });
      const ingredeintSupplierIdArray = ingredient.selectedIngredient.suppliers.map(
        iSupplier => {
          return iSupplier.supplier._id;
        }
      );

      filteredSuppliers = supplierIdArray.filter(
        s => !ingredeintSupplierIdArray.includes(s)
      );
    }

    const newSearchSuppliersArray = supplier.suppliers.filter(
      supplier => {
        return filteredSuppliers.some(fSupplier => {
          if (supplier._id === fSupplier) {
            return supplier;
          }
        });
      }
    );

    if (searchedSupplierName.length >= 1) {
      const filteredSuppliers = newSearchSuppliersArray.filter(
        supplierToFilter => {
          let regX = new RegExp(searchedSupplierName, 'gi');
          let matchedArray = supplierToFilter.urlName.match(regX);
          return matchedArray;
        }
      );

      this.setState({
        filteredSearchSuppliersArray: filteredSuppliers
      });
    }
  }

  async handleSelectSupplier(e) {
    const { filteredSearchSuppliersArray } = this.state;

    // Figure out which supplier was clicked and place supplier into new object
    const clickedOnSupplier = filteredSearchSuppliersArray.filter(
      supplier => {
        return supplier._id === e.target.id;
      }
    );
    console.log('clickedOnSupplier: ', clickedOnSupplier);
    console.log(
      'this.props.ingredient.selectedIngredient: ',
      this.props.ingredient.selectedIngredient._id
    );

    // Set Supplier as Selected Ingredient Supplier
    await this.props.addAndSetSelectedIngredientSupplier(
      clickedOnSupplier[0],
      this.props.ingredient.selectedIngredient
    );
    this.setState({
      filteredSearchSuppliersArray: [],
      searchedSupplierName: ''
    });
  }

  render() {
    const {
      loading,
      selectedIngredient,
      selectedIngredientSupplier
    } = this.props.ingredient;

    const {
      searchedSupplierName,
      filteredSearchSuppliersArray
    } = this.state;

    let supplierContent = '';
    let addSupplierForm = '';

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
          <form
            style={{ border: 'none' }}
            // onSubmit={this.handleConfirmProfileIngredientSupplier}
            // onSubmit={}
          >
            <TextInput
              label="Search Supplier"
              name="supplier"
              value={searchedSupplierName}
              onChange={this.handleOnChangeSearch.bind(this)}
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
  addAndSetSelectedIngredientSupplier
};

const mapState = state => ({
  profile: state.profile,
  ingredient: state.ingredient,
  supplier: state.supplier,
  errors: state.errors
});

SupplierPanel.propTypes = {
  setSelectedIngredientSupplier: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(SupplierPanel);
