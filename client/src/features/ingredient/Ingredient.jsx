import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from '../../utils/validation/is.empty';
import { getUserProfile } from '../profile/profileActions';
import {
  getIngredients,
  addOrEditProfileIngredient
} from './ingredientActions';
import { getSuppliers } from './supplierActions';
import Spinner from '../../utils/spinner/Spinner';
import TextInput from '../../utils/input/TextInput';
import SupplierPanel from './SupplierPanel';

class Ingredient extends Component {
  state = {
    profile: {},
    errors: {},
    ingredients: [],
    ingredient: {
      displayName: '',
      packetCost: '',
      selected: false,
      profileIngredient: false
    },
    filteredIngredientsArray: [],
    filteredSuppliersArray: [],
    suppliers: [],
    supplier: {
      displayName: '',
      packetCost: '',
      packetGrams: '',
      selected: false,
      profileSupplier: false
    }
  };

  static getDerivedStateFromProps(nextProps, nextState) {
    console.log('getDerivedStateFromProps: nextProps', nextProps);
    console.log('getDerivedStateFromProps: nextState', nextState);

    if (
      nextProps.suppliers &&
      nextState.suppliers !== nextProps.suppliers
    ) {
      nextProps.profile.loading = false;
      nextProps.ingredients.loading = false;
      nextProps.suppliers.loading = false;
      return {
        profile: nextProps.profile,
        ingredients: nextProps.ingredients,
        suppliers: nextProps.suppliers
      };
    }

    // Return null to indicate no change to state.
    return null;
  }

  componentDidMount() {
    this.props.getUserProfile();
    this.props.getIngredients();
    this.props.getSuppliers();
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('componentDidUpdate: prevProps', prevProps);
    console.log('componentDidUpdate: props', this.props);

    console.log('this.state: ', this.state);

    // if (nextProps.errors) {
    //   this.setState({ errors: nextProps.errors });
    // }
    // if (nextProps.profile) {
    //   this.setState({ profile: nextProps.profile });
    // }
    // if (nextProps.ingredients) {
    //   this.setState({ ingredients: nextProps.ingredients });
    // }
    // if (nextProps.suppliers) {
    //   this.setState({ suppliers: nextProps.suppliers });
    // }
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

  // Changes Supplier Details in Form
  handleIngredientSupplierChange = e => {
    e.persist();
    this.setState(prevState => ({
      supplier: {
        ...prevState.supplier,
        [e.target.name]: e.target.value
      }
    }));
  };

  // Allows you to click on the ingredient to begin editing
  handleSelectIngredient = e => {
    const { suppliers, filteredIngredientsArray } = this.state;
    const { profile } = this.props.profile;

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

    const profileSelectedIngredient = profile.ingredients.filter(
      profileIngredient => {
        if (
          profileIngredient.ingredient === selectedIngredient[0]._id
        ) {
          selectedIngredient[0].profileIngredient = true;
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

      if (selectedIngredient[0].profileIngredient) {
        const setSupplier = filteredSuppliers.filter(supplier => {
          if (
            supplier.supplier._id ===
            profileSelectedIngredient[0].supplier
          ) {
            console.log('supplier: ', supplier);
            console.log(
              'profileSelectedIngredient[0]: ',
              profileSelectedIngredient[0]
            );
            supplier.packageCost = profileSelectedIngredient[0].packageCost.toString();
            supplier.packageGrams = profileSelectedIngredient[0].packageGrams.toString();
            supplier.profileSupplier = true;
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

  // Handles the ability to select a supplier
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
    // this.state.profile.suppliers;
    // if (selectedSupplier[0])
    console.log('---> selectedSupplier: ', selectedSupplier[0]);

    this.setState({ supplier: selectedSupplier[0] });
  };

  handleConfirmSupplier = e => {
    e.preventDefault();
    const { ingredient, supplier } = this.state;
    const profileIngredient = {};
    profileIngredient.ingredient = ingredient._id;
    profileIngredient.supplier = supplier.supplier._id;
    profileIngredient.packageCost = supplier.packageCost;
    profileIngredient.packageGrams = supplier.packageGrams;

    console.log('profileIngredient: ', profileIngredient);
    this.props.addOrEditProfileIngredient(profileIngredient);
  };

  render() {
    const { ingredientLoading, profile } = this.props;
    const {
      ingredient,
      ingredients,
      filteredIngredientsArray,
      filteredSuppliersArray,
      supplier
    } = this.state;

    // if (!isEmpty(this.state.profile)) {
    //   console.log(
    //     'State Check: ',
    //     this.state.profile.profile.ingredients[0]
    //   );
    // }

    let ingredientContent;

    if (ingredients.length === 0 || ingredientLoading) {
      ingredientContent = <Spinner />;
    } else {
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
                {console.log('Button Supplier: ', supplier)}

                {!supplier.profileSupplier && (
                  <button type="submit">
                    Confirm {supplier.supplier.displayName} as your
                    Supplier
                  </button>
                )}
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
            // profileIngredients={profile.profile.ingredients}
            handleSelectSupplier={this.handleSelectSupplier}
            // handleSetProfileSupplier={this.handleSetProfileSupplier}
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
  addOrEditProfileIngredient
};

const mapState = state => ({
  ingredients: state.ingredient.ingredients,
  suppliers: state.supplier.suppliers,
  errors: state.errors,
  ingredientLoading: state.ingredient.loading,
  auth: state.auth,
  profile: state.profile
});

Ingredient.propTypes = {
  getUserProfile: PropTypes.func.isRequired,
  getIngredients: PropTypes.func.isRequired,
  getSuppliers: PropTypes.func.isRequired,
  addOrEditProfileIngredient: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(Ingredient);
