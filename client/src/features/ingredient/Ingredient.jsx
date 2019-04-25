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

class Ingredient extends Component {
  state = {
    errors: {},
    searchedIngredientName: '',
    selectedIngredientSupplier: {},
    currentProfileIngredientSupplier: {},
    filteredSearchIngredientsArray: [],
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
      // console.log('YESY');

      this.setState({
        selectedIngredientSupplier: this.props.ingredient
          .selectedIngredientSupplier
      });
    }

    if (prevProps.suppliers !== this.props.suppliers) {
      this.setState({ suppliers: this.props.suppliers });
    }
  }

  // setState search ingredient name
  async handleOnChangeSearch(e) {
    let inputData = e.target.value;

    await this.setState(prevState => ({
      searchedIngredientName: inputData
    }));
    await this.ingredientNameCheck();
    await this.filterIngredients();
    if (inputData === '') {
      this.setState({ filteredSearchIngredientsArray: [] });
    }
  }

  // Check if ingredient state name is different to input box
  async ingredientNameCheck() {
    const { searchedIngredientName } = this.state;
    if (searchedIngredientName.length >= 1) {
      const urlSearchedIngredientName = searchedIngredientName.toLowerCase();
      const checkIngredientName = this.props.ingredient.ingredients.some(
        checkIngredient => {
          return (
            checkIngredient.urlName === urlSearchedIngredientName
          );
        }
      );
      if (!checkIngredientName) {
        this.props.removeSelectedIngredient();
      }
    }
  }

  async filterIngredients() {
    const { searchedIngredientName } = this.state;
    if (searchedIngredientName.length >= 1) {
      const filteredIngredients = this.props.ingredient.ingredients.filter(
        ingredientToFilter => {
          let regX = new RegExp(searchedIngredientName, 'gi');
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
    const { filteredSearchIngredientsArray } = this.state;
    // Figures out which ingredient was selected
    const clickedOnIngredient = filteredSearchIngredientsArray.filter(
      ingredient => {
        return ingredient._id === e.target.id;
      }
    );
    this.props.setSelectedIngredient(
      clickedOnIngredient[0],
      this.props.profile.profile,
      this.props.suppliers.suppliers,
      true
    );

    this.setState({ filteredSearchIngredientsArray: [] });
  };

  handleIngredientSupplierChange = e => {
    e.persist();
    this.setState(prevState => ({
      selectedIngredientSupplier: {
        ...prevState.selectedIngredientSupplier,
        [e.target.name]: e.target.value
      }
    }));
  };

  handleUpdateAndSetPreferedProfileIngredientSupplier = e => {
    e.preventDefault();
    // console.log('HERE');

    console.log(
      'this.props.ingredient.selectedIngredient.suppliers: ',
      this.props.ingredient.selectedIngredient.suppliers
    );

    this.props.addOrEditProfileIngredientSupplier(
      this.props.ingredient.selectedIngredient,
      this.state.selectedIngredientSupplier,
      true
    );
  };

  handleUpdateProfileIngredientSupplier = e => {
    e.preventDefault();
    console.log(
      '^^^^^^^^%%^^^^^ this.props.ingredient.selectedIngredient.suppliers: ',
      this.props.ingredient.selectedIngredient.suppliers
    );

    this.props.addOrEditProfileIngredientSupplier(
      this.props.ingredient.selectedIngredient,
      this.state.selectedIngredientSupplier,
      false
    );
  };

  handleOpenAddIngredientForm = e => {
    const { searchedIngredientName } = this.state;

    this.props.addIngredient(searchedIngredientName);
  };

  render() {
    // console.log('this.props.ingredient: ', this.props.ingredient);

    const {
      ingredients,
      selectedIngredient,
      loading
    } = this.props.ingredient;
    const {
      filteredSearchIngredientsArray,
      filteredIngredientSuppilersArray,
      searchedIngredientName,
      selectedIngredientSupplier,
      errors
    } = this.state;

    console.log('--> errors: ', errors);

    let ingredientContent;
    if (ingredients === null || loading === true) {
      ingredientContent = <Spinner />;
    } else {
      ingredientContent = (
        <div>
          <form
            style={{ border: 'none' }}
            // onSubmit={this.handleConfirmProfileIngredientSupplier}
            // onSubmit={}
          >
            <TextInput
              label="Search Ingredient"
              name="ingredient"
              value={searchedIngredientName}
              onChange={this.handleOnChangeSearch.bind(this)}
            />

            <ul className="filterList ingredient">
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
              {filteredSearchIngredientsArray.length > 0 && (
                <li onClick={this.handleAddIngredient}>
                  + Add Ingredient
                </li>
              )}
            </ul>

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
                {/* {console.log(
                  'Button Supplier: ',
                  selectedIngredientSupplier
                )} */}
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
                    {!selectedIngredientSupplier.prefered && (
                      <button
                        type="submit"
                        onClick={
                          this
                            .handleUpdateAndSetPreferedProfileIngredientSupplier
                        }
                      >
                        Confirm{' '}
                        {
                          selectedIngredientSupplier.supplier
                            .displayName
                        }{' '}
                        as your prefered Supplier
                      </button>
                    )}
                  </li>
                </ul>
              </React.Fragment>
            )}
          </form>

          <hr />
          <h3>All Ingredients</h3>
          <ul>
            {ingredients &&
              ingredients.map(ingredient => (
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
  addOrEditProfileIngredientSupplier: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(Ingredient);
