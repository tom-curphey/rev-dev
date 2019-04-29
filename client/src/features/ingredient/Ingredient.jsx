import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from '../../utils/validation/is.empty';
import { getUserProfile } from '../profile/profileActions';
import {
  getIngredients,
  addOrEditProfileIngredientSupplier,
  setSelectedIngredient,
  removeSelectedIngredient,
  closeAddIngredientPanel,
  openAddIngredientPanel,
  addNewIngredient
} from './ingredientActions';
import { getSuppliers } from './supplierActions';
import Spinner from '../../utils/spinner/Spinner';
import TextInput from '../../utils/input/TextInput';
import SupplierPanel from './SupplierPanel';
import SelectIngredient from './SelectIngredient';
import AddIngredientPanel from './AddIngredientPanel';
import AddSupplierPanel from './AddSupplierPanel';

class Ingredient extends Component {
  state = {
    errors: {},
    selectedIngredient: null,
    selectedIngredientSupplier: {},
    currentProfileIngredientSupplier: {}
  };

  componentDidMount() {
    this.props.getUserProfile();
    this.props.getIngredients();
    this.props.getSuppliers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    if (
      prevProps.ingredient.selectedIngredient !==
        this.props.ingredient.selectedIngredient &&
      this.props.ingredient.selectedIngredient !== null
    ) {
      this.setState({
        selectedIngredient: this.props.ingredient.selectedIngredient
      });
    }

    if (
      prevProps.ingredient.selectedIngredientSupplier !==
      this.props.ingredient.selectedIngredientSupplier
    ) {
      this.setState({
        selectedIngredientSupplier: this.props.ingredient
          .selectedIngredientSupplier
      });
    }

    if (prevProps.suppliers !== this.props.suppliers) {
      this.setState({ suppliers: this.props.suppliers });
    }
  }

  handleIngredientSupplierChange = e => {
    e.persist();
    this.setState(prevState => ({
      selectedIngredientSupplier: {
        ...prevState.selectedIngredientSupplier,
        [e.target.name]: e.target.value
      }
    }));
  };

  handleUpdateAndSetpreferredProfileIngredientSupplier = e => {
    e.preventDefault();

    this.props.addOrEditProfileIngredientSupplier(
      this.props.ingredient.selectedIngredient,
      this.state.selectedIngredientSupplier,
      true
    );
  };

  handleUpdateProfileIngredientSupplier = e => {
    e.preventDefault();

    this.props.addOrEditProfileIngredientSupplier(
      this.props.ingredient.selectedIngredient,
      this.state.selectedIngredientSupplier,
      false
    );
  };

  getSelectedIngredient = (selectedIngredient, addIngredient) => {
    if (addIngredient) {
      this.props.openAddIngredientPanel(selectedIngredient);
    } else {
      let suppliers = [];
      this.props.setSelectedIngredient(
        selectedIngredient,
        this.props.profile.profile,
        suppliers,
        true
      );
    }
  };

  searchIngredientClicked = () => {
    this.props.removeSelectedIngredient();
  };

  render() {
    const {
      ingredients,
      loading,
      openIngredientPanel
    } = this.props.ingredient;
    const { openSupplierPanel } = this.props.supplier;
    const {
      selectedIngredient,
      selectedIngredientSupplier,
      errors
    } = this.state;
    // const { closeAddIngredientPanel } = this.props;

    // console.log(
    //   'selectedIngredientSupplier: ',
    //   selectedIngredientSupplier
    // );

    let ingredientContent;
    let supplierContent;
    if (ingredients === null || loading === true) {
      ingredientContent = <Spinner />;
    } else {
      ingredientContent = (
        <div>
          <form style={{ border: 'none' }}>
            <SelectIngredient
              // ingredients={ingredients}
              // selectedIngredient={selectedIngredient}
              getSelectedIngredient={this.getSelectedIngredient}
              searchIngredientClicked={this.searchIngredientClicked}
            />

            {!isEmpty(selectedIngredientSupplier) && (
              <React.Fragment>
                <TextInput
                  label="Package Cost"
                  name="packageCost"
                  value={selectedIngredientSupplier.packageCost}
                  onChange={this.handleIngredientSupplierChange}
                  error={errors.packageCost}
                />
                <TextInput
                  label="Package Grams"
                  name="packageGrams"
                  value={selectedIngredientSupplier.packageGrams}
                  onChange={this.handleIngredientSupplierChange}
                  error={errors.packageGrams}
                />

                <ul className="supplier_buttons">
                  <li>
                    <button
                      type="submit"
                      onClick={
                        this.handleUpdateProfileIngredientSupplier
                      }
                    >
                      Update Supplier:{' '}
                      {
                        selectedIngredientSupplier.supplier
                          .displayName
                      }
                    </button>
                  </li>
                  <li>
                    {!selectedIngredientSupplier.preferred && (
                      <button
                        type="submit"
                        onClick={
                          this
                            .handleUpdateAndSetpreferredProfileIngredientSupplier
                        }
                      >
                        Confirm{' '}
                        {
                          selectedIngredientSupplier.supplier
                            .displayName
                        }{' '}
                        as your preferred Supplier
                      </button>
                    )}
                  </li>
                </ul>
              </React.Fragment>
            )}
          </form>
        </div>
      );
    }

    if (selectedIngredient === null) {
      supplierContent = '';
    } else {
      if (selectedIngredient.new !== true) {
        console.log(
          'selectedIngredient.suppliers: ',
          selectedIngredient.suppliers
        );

        supplierContent = (
          <SupplierPanel
          // filteredSuppliers={filteredIngredientSuppilersArray}
          // selectedIngredient={selectedIngredient}
          // handleSelectIngredientSupplier={
          //   this.handleSelectIngredientSupplier
          // }
          />
        );
      }
    }

    return (
      <div className="ingredient_page">
        <section className="ingredient_left">
          <h1>Ingredient Page</h1>
          {ingredientContent && ingredientContent}
        </section>
        <section className="ingredient_right">
          {supplierContent && supplierContent}
        </section>
        {openIngredientPanel && <AddIngredientPanel />}
        {openSupplierPanel && <AddSupplierPanel />}
      </div>
    );
  }
}

const actions = {
  getUserProfile,
  getIngredients,
  getSuppliers,
  addOrEditProfileIngredientSupplier,
  setSelectedIngredient,
  removeSelectedIngredient,
  openAddIngredientPanel,
  closeAddIngredientPanel,
  addNewIngredient
};

const mapState = state => ({
  ingredient: state.ingredient,
  supplier: state.supplier,
  errors: state.errors,
  auth: state.auth,
  profile: state.profile
});

Ingredient.propTypes = {
  getUserProfile: PropTypes.func.isRequired,
  getIngredients: PropTypes.func.isRequired,
  setSelectedIngredient: PropTypes.func.isRequired,
  getSuppliers: PropTypes.func.isRequired,
  addOrEditProfileIngredientSupplier: PropTypes.func.isRequired,
  removeSelectedIngredient: PropTypes.func.isRequired,
  openAddIngredientPanel: PropTypes.func.isRequired,
  closeAddIngredientPanel: PropTypes.func.isRequired,
  addNewIngredient: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(Ingredient);
