import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setSelectedIngredientSupplier } from './ingredientActions';
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
    this.props.setSelectedIngredientSupplier(
      clickedOnIngredientSupplier[0],
      this.props.selectedIngredient
    );
  };

  async handleOnChangeSearch(e) {
    let inputData = e.target.value;
    await this.setState({ searchedSupplierName: inputData });
    await this.filterSuppliers(this.props.supplier.suppliers);
  }

  async filterSuppliers(suppliersArray) {
    const { searchedSupplierName } = this.state;

    if (searchedSupplierName.length >= 1) {
      const filteredSuppliers = suppliersArray.filter(
        supplierToFilter => {
          let regX = new RegExp(searchedSupplierName, 'gi');
          let matchedArray = supplierToFilter.urlName.match(regX);
          return matchedArray;
        }
      );

      if (filteredSuppliers.length > 0) {
        this.setState({
          filteredSearchSuppliersArray: filteredSuppliers
        });
      }
    }
  }

  async handleSelectSupplier(e) {
    const { filteredSearchSuppliersArray } = this.state;

    // Figure out which supplier was clicked and place supplier into new object
    const clickedOnSupplier = filteredSearchSuppliersArray.filter(
      supplier => {
        // console.log('supplier: ', supplier);
        // console.log('e.target: ', e.target);
        return supplier._id === e.target.id;
      }
    );
    // do you use setSelectedIngredientSupplier or a different function?
    //
    //
    console.log('clickedOnSupplier: ', clickedOnSupplier);
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
              <form
                style={{ border: 'none' }}
                // onSubmit={this.handleConfirmProfileIngredientSupplier}
                // onSubmit={}
              >
                <TextInput
                  label="Search Ingredient"
                  name="ingredient"
                  value={searchedSupplierName}
                  onChange={this.handleOnChangeSearch.bind(this)}
                />
              </form>
              <ul>
                {filteredSearchSuppliersArray &&
                  filteredSearchSuppliersArray.map(
                    filteredSearchSupplier => {
                      return (
                        <li
                          id={filteredSearchSupplier._id}
                          key={filteredSearchSupplier._id}
                          style={{ cursor: 'pointer' }}
                          onClick={this.handleSelectSupplier.bind(
                            this
                          )}
                        >
                          {filteredSearchSupplier.displayName}
                        </li>
                      );
                    }
                  )}
              </ul>
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
  ingredient: state.ingredient,
  supplier: state.supplier
});

SupplierPanel.propTypes = {
  setSelectedIngredientSupplier: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(SupplierPanel);
