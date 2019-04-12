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
    errors: {},
    profile: {},
    ingredients: [],
    selectedIngredient: {
      displayName: 'Hello',
      packetCost: '',
      suppliers: [],
      selected: false,
      profileIngredient: false
    },
    suppliers: [],
    selectedIngredientSupplier: {},
    currentProfileIngredientSupplier: {},
    filteredSearchIngredientsArray: [],
    filteredIngredientSuppilersArray: []
  };

  static getDerivedStateFromProps(nextProps, nextState) {
    // Return null to indicate no change to state.
    return null;
  }

  componentDidMount() {
    this.props.getUserProfile();
    this.props.getIngredients();
    this.props.getSuppliers();
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('componentDidUpdate: prevProps', prevProps);
    // console.log('componentDidUpdate: this.props', this.props);
    // console.log('componentDidUpdate: prevState', prevState);

    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
    if (prevProps.ingredients !== this.props.ingredients) {
      this.setState({ ingredients: this.props.ingredients });
    }
    if (prevProps.suppliers !== this.props.suppliers) {
      this.setState({ suppliers: this.props.suppliers });
    }
    if (prevProps.profile !== this.props.profile) {
      this.setState({ profile: this.props.profile });
    }
  }

  async handleOnChangeSearch(e) {
    let inputData = e.target.value;
    await this.setState(prevState => ({
      selectedIngredient: {
        ...prevState.selectedIngredient,
        displayName: inputData
      }
    }));
    await this.filteredIngredients(this.state.ingredients);
  }

  async filteredIngredients(ingredientsArray) {
    const ingredientSearchInput = this.state.selectedIngredient
      .displayName;

    if (ingredientSearchInput.length >= 1) {
      const filteredIngredients = ingredientsArray.filter(
        ingredientToFilter => {
          let regX = new RegExp(ingredientSearchInput, 'gi');
          let matchedArray = ingredientToFilter.urlName.match(regX);
          return matchedArray;
        }
      );

      this.setState({
        filteredSearchIngredientsArray: filteredIngredients
      });
    }
  }

  handleSelectIngredient = e => {
    const {
      filteredSearchIngredientsArray,
      profile,
      suppliers
    } = this.state;

    // Figures out which ingredient was selected
    const clickedOnIngredient = filteredSearchIngredientsArray.filter(
      ingredient => {
        return ingredient._id === e.target.id;
      }
    );

    // Check if the ingredient selected is in the profile ingredients
    const checkProfileIngredient = profile.profile.ingredients.filter(
      profileIngredient => {
        if (
          profileIngredient.ingredient === clickedOnIngredient[0]._id
        ) {
          clickedOnIngredient[0].profileIngredient = true;
          return clickedOnIngredient;
        } else {
          return null;
        }
      }
    );

    // Filters ingredient suppliers and puts them in ABC order
    // If successful set filteredIngredientSuppilersArray[]
    let abcFilteredSuppliers = null;
    if (
      clickedOnIngredient[0].suppliers.length > 0 &&
      suppliers.length > 0
    ) {
      const filteredIngredientSuppliers = clickedOnIngredient[0].suppliers.filter(
        o1 => {
          return suppliers.some(o2 => {
            // return the ones with equal id
            return o1.supplier._id === o2._id;
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

      abcFilteredSuppliers = filteredIngredientSuppliers.sort(
        compare
      );

      this.setState({
        filteredIngredientSuppilersArray: abcFilteredSuppliers
      });
    }

    // Set current ingredient supplier if there is one
    // Set current ingredient supplier as the selected supplier
    if (
      checkProfileIngredient !== null &&
      abcFilteredSuppliers !== null
    ) {
      const currentProfileIngredientSupplier = abcFilteredSuppliers.filter(
        ingredientSupplier => {
          return (
            ingredientSupplier.supplier._id ===
            checkProfileIngredient[0].supplier
          );
        }
      );
      this.setState({
        currentProfileIngredientSupplier:
          currentProfileIngredientSupplier[0]
      });
      this.setState({
        selectedIngredientSupplier:
          currentProfileIngredientSupplier[0]
      });
    }

    // Sets selectedIngredient in the state & clears the filteredIngredientsArray
    this.setState({ selectedIngredient: clickedOnIngredient[0] });
    this.setState({ filteredSearchIngredientsArray: [] });
  };

  // Update selectedIngredientSupplier in the state
  handleSelectIngredientSupplier = e => {
    const clickedOnIngredientSupplier = this.state.filteredIngredientSuppilersArray.filter(
      clickedSupplier => {
        return clickedSupplier._id === e.target.id;
      }
    );
    this.setState({
      selectedIngredientSupplier: clickedOnIngredientSupplier
    });
    if (
      clickedOnIngredientSupplier.supplier._id ==
      this.state.currentProfileIngredientSupplier
    ) {
      this.setState({
        currentProfileIngredientSupplier: clickedOnIngredientSupplier
      });
    }
  };

  render() {
    const {
      ingredients,
      selectedIngredient,
      filteredSearchIngredientsArray,
      filteredIngredientSuppilersArray
    } = this.state;
    if (!isEmpty(this.state)) {
      console.log('********* State Check: ', this.state);
    }

    let ingredientContent;
    if (ingredients.length === 0) {
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
              value={selectedIngredient.displayName}
              onChange={this.handleOnChangeSearch.bind(this)}
            />
          </form>

          <ul>
            {filteredSearchIngredientsArray &&
              filteredSearchIngredientsArray.map(
                filteredSearchIngredient => (
                  <li
                    id={filteredSearchIngredient._id}
                    style={{ cursor: 'pointer' }}
                    onClick={this.handleSelectIngredient}
                    key={filteredSearchIngredient._id}
                  >
                    {filteredSearchIngredient.displayName}
                  </li>
                )
              )}
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
