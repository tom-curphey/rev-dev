import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  getIngredients,
  addOrEditUserIngredient
} from './ingredientActions';
import { getSuppliers } from './supplierActions';
import Spinner from '../../utils/spinner/Spinner';
import TextInput from '../../utils/input/TextInput';
import SupplierPanel from './SupplierPanel';

class Ingredient extends Component {
  state = {
    errors: {},
    ingredients: [],
    ingredient: {
      displayName: '',
      packetCost: '',
      selected: false,
      userIngredient: false
    },
    filteredIngredientsArray: [],
    filteredSuppliersArray: [],
    suppliers: [],
    supplier: {
      displayName: '',
      packetCost: '',
      packetGrams: '',
      selected: false,
      userSupplier: false
    }
  };

  componentDidMount() {
    this.props.getIngredients();
    this.props.getSuppliers();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    if (nextProps.ingredients) {
      this.setState({ ingredients: nextProps.ingredients });
    }
    if (nextProps.suppliers) {
      this.setState({ suppliers: nextProps.suppliers });
    }
  }

  async filteredIngredients(ingredientsArray) {
    const searchInput = this.state.ingredient.displayName;

    if (searchInput.length >= 1) {
      const filteredIngredients = ingredientsArray.filter(
        ingredient => {
          console.log('dataIngredient: ', ingredient.urlName);
          console.log(
            'IngredeintSearch: ',
            this.state.ingredient.displayName
          );
          console.log('IngredeintSearch: ', this.state);

          let re = new RegExp(searchInput, 'gi');
          let matchedArray = ingredient.urlName.match(re);

          // const matchedArray = ingredient.urlName.match(
          //   /this.state.ingredient.name/gi
          // );
          console.log('matchedArray: ', matchedArray);

          return matchedArray;
        }
      );
      this.setState({
        filteredIngredientsArray: filteredIngredients
      });
    }
  }

  async handleOnChangeSearch(e) {
    let inputData = e.target.value;
    await this.setState(prevState => ({
      ingredient: {
        ...prevState.ingredient,
        displayName: inputData
      }
    }));

    await this.filteredIngredients(this.state.ingredients);
  }

  handleIngredientSupplierChange = e => {
    e.persist();
    this.setState(prevState => ({
      supplier: {
        ...prevState.supplier,
        [e.target.name]: e.target.value
      }
    }));
  };

  handleSelectIngredient = e => {
    const { suppliers, filteredIngredientsArray } = this.state;
    const { user } = this.props.auth;

    const selectedIngredient = filteredIngredientsArray.filter(
      ingredient => {
        // console.log('dataIngredient: ', ingredient._id);
        // console.log('inputIngredient: ', e.target.id);
        if (ingredient._id === e.target.id) {
          ingredient.selected = true;
          return ingredient;
        } else {
          return null;
        }
      }
    );

    const userSelectedIngredient = user.ingredients.filter(
      userIngredient => {
        if (userIngredient.ingredient === selectedIngredient[0]._id) {
          selectedIngredient[0].userIngredient = true;
          return selectedIngredient;
        } else {
          return null;
        }
      }
    );

    if (suppliers.length > 0) {
      const filterSuppliersThatSupplyIngredient = selectedIngredient[0].suppliers.filter(
        o1 => {
          return suppliers.some(o2 => {
            return o1.supplier._id === o2._id; // return the ones with equal id
          });
        }
      );

      function compare(a, b) {
        const supplierA = a.supplier.displayName;
        const supplierB = b.supplier.displayName;

        let comparison = 0;
        if (supplierA > supplierB) {
          comparison = 1;
        } else if (supplierA < supplierB) {
          comparison = -1;
        }
        return comparison;
      }

      const filteredSuppliers = filterSuppliersThatSupplyIngredient.sort(
        compare
      );
      console.log('filteredSuppliers: ', filteredSuppliers);

      if (selectedIngredient[0].userIngredient) {
        const setSupplier = filteredSuppliers.filter(supplier => {
          if (
            supplier.supplier._id ===
            userSelectedIngredient[0].supplier
          ) {
            console.log('supplier: ', supplier);
            console.log(
              'userSelectedIngredient[0]: ',
              userSelectedIngredient[0]
            );
            supplier.packageCost = userSelectedIngredient[0].packageCost.toString();
            supplier.packageGrams = userSelectedIngredient[0].packageGrams.toString();
            supplier.userSupplier = true;
            supplier.selected = true;
            console.log('supplier: ', supplier);
            return supplier;
          } else {
            return null;
          }
        });
        console.log('setSupplier: ', setSupplier);
        if (setSupplier.length > 0) {
          this.setState({ supplier: setSupplier[0] });
        }
      }

      this.setState({ filteredSuppliersArray: filteredSuppliers });
    }

    console.log('selectedIngredient: ', selectedIngredient[0]);
    this.setState({ ingredient: selectedIngredient[0] });
    this.setState({ filteredIngredientsArray: [] });
  };

  handleSetUserSupplier = updatedSupplier => {
    console.log('Updated Supplier: ', updatedSupplier[0]);

    const supplierData = {};
    supplierData.id = updatedSupplier[0].supplier._id;
    supplierData.displayName =
      updatedSupplier[0].supplier.displayName;
    supplierData.packageCost = updatedSupplier[0].packageCost.toString();
    supplierData.packageGrams = updatedSupplier[0].packageGrams.toString();
    supplierData.selected = true;
    console.log('Select Supplier: ', supplierData);
    this.setState({ supplier: supplierData });
  };

  handleSelectSupplier = e => {
    const selectedSupplier = this.state.ingredient.suppliers.filter(
      supplier => {
        console.log('dataSupplier: ', supplier.supplier._id);
        console.log('selectedSupplier: ', e.target.id);
        return supplier.supplier._id === e.target.id;
      }
    );
    selectedSupplier[0].packageCost = selectedSupplier[0].packageCost.toString();
    selectedSupplier[0].packageGrams = selectedSupplier[0].packageGrams.toString();
    selectedSupplier[0].selected = true;
    console.log('---> selectedSupplier: ', selectedSupplier[0]);

    this.setState({ supplier: selectedSupplier[0] });
  };

  handleConfirmSupplier = e => {
    e.preventDefault();
    const { ingredient, supplier } = this.state;
    const { user } = this.props.auth;
    const userIngredient = {};
    userIngredient.ingredient = ingredient._id;
    userIngredient.supplier = supplier.supplier._id;
    userIngredient.packageCost = supplier.packageCost;
    userIngredient.packageGrams = supplier.packageGrams;

    const userData = {};
    // console.log('Auth: ', auth);

    userData.iat = user.iat;
    userData.exp = user.exp;

    console.log('userIngredient: ', userIngredient);
    this.props.addOrEditUserIngredient(userIngredient, userData);
  };

  render() {
    const { ingredientLoading, auth } = this.props;
    const {
      ingredient,
      ingredients,
      filteredIngredientsArray,
      filteredSuppliersArray,
      supplier
    } = this.state;

    let ingredientContent;

    if (ingredients.length === 0 || ingredientLoading) {
      ingredientContent = <Spinner />;
    } else {
      let check = 'start';
      if (ingredient.ingredients === null) {
        check = 'Loading';
      } else {
        check = 'done';
      }
      ingredientContent = (
        <div>
          <form
            style={{ border: 'none' }}
            onSubmit={this.handleConfirmSupplier}
          >
            <TextInput
              label="Search Ingredient"
              name="ingredient"
              value={ingredient.displayName}
              onChange={this.handleOnChangeSearch.bind(this)}
            />
            {supplier.selected && (
              <React.Fragment>
                <TextInput
                  label="Package Cost"
                  name="packageCost"
                  value={supplier.packageCost}
                  onChange={this.handleIngredientSupplierChange}
                />
                <TextInput
                  label="Package Grams"
                  name="packageGrams"
                  value={supplier.packageGrams}
                  onChange={this.handleIngredientSupplierChange}
                />
                <button type="submit">
                  Confirm {supplier.supplier.displayName} as your
                  Supplier
                </button>
              </React.Fragment>
            )}
          </form>

          <ul>
            {filteredIngredientsArray.map(ingredientF => (
              <li
                id={ingredientF._id}
                style={{ cursor: 'pointer' }}
                onClick={this.handleSelectIngredient}
                key={ingredientF._id}
              >
                {ingredientF.displayName}
              </li>
            ))}
          </ul>
          <hr />
          <h3>All Ingredients</h3>
          <ul>
            <li>{check}</li>
            {ingredients.map(ingredient => (
              <li key={ingredient._id}>{ingredient.displayName}</li>
            ))}
          </ul>
          <hr />
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
            filteredSuppliers={filteredSuppliersArray}
            ingredient={ingredient}
            userIngredients={auth.user.ingredients}
            handleSelectSupplier={this.handleSelectSupplier}
            handleSetUserSupplier={this.handleSetUserSupplier}
          />
        </section>
      </div>
    );
  }
}

const actions = {
  getIngredients,
  getSuppliers,
  addOrEditUserIngredient
};

const mapState = state => ({
  ingredients: state.ingredient.ingredients,
  suppliers: state.supplier.suppliers,
  errors: state.errors,
  ingredientLoading: state.ingredient.loading,
  auth: state.auth
});

Ingredient.propTypes = {
  getIngredients: PropTypes.func.isRequired,
  getSuppliers: PropTypes.func.isRequired,
  addOrEditUserIngredient: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(Ingredient);
