import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from '../../utils/validation/is.empty';
import { getUserProfile } from '../profile/profileActions';
import {
  getIngredients,
  addOrEditProfileIngredientSupplier,
  setSelectedIngredient,
  removeSelectedIngredient
} from './ingredientActions';
import { getSuppliers } from './supplierActions';
import Spinner from '../../utils/spinner/Spinner';
import TextInput from '../../utils/input/TextInput';
import SupplierPanel from './SupplierPanel';
import SelectIngredient from './SelectIngredient';

class Ingredient extends Component {
  state = {
    errors: {},
    selectedIngredientSupplier: {},
    currentProfileIngredientSupplier: {},
    filteredIngredientSuppilersArray: []
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
        searchedIngredientName: this.props.ingredient
          .selectedIngredient.displayName
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

  getSelectedIngredient = selectedIngredient => {
    let suppliers = [];
    this.props.setSelectedIngredient(
      selectedIngredient,
      this.props.profile.profile,
      suppliers,
      true
    );
  };
  searchIngredientClicked = () => {
    this.props.removeSelectedIngredient();
  };

  render() {
    const {
      ingredients,
      selectedIngredient,
      loading
    } = this.props.ingredient;
    const {
      filteredIngredientSuppilersArray,
      selectedIngredientSupplier,
      errors
    } = this.state;

    let ingredientContent;
    if (ingredients === null || loading === true) {
      ingredientContent = <Spinner />;
    } else {
      ingredientContent = (
        <div>
          <form style={{ border: 'none' }}>
            <SelectIngredient
              ingredients={ingredients}
              selectedIngredient={selectedIngredient}
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

    return (
      <div className="ingredient_page">
        <section className="ingredient_left">
          <h1>Ingredient Page</h1>
          {ingredientContent && ingredientContent}
        </section>
        <section className="ingredient_right">
          <SupplierPanel
            filteredSuppliers={filteredIngredientSuppilersArray}
            selectedIngredient={selectedIngredient}
            handleSelectIngredientSupplier={
              this.handleSelectIngredientSupplier
            }
          />
        </section>
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
  removeSelectedIngredient
};

const mapState = state => ({
  ingredient: state.ingredient,
  suppliers: state.supplier,
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
  removeSelectedIngredient: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(Ingredient);
