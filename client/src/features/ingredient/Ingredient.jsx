import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from '../../utils/validation/is.empty';
import { getUserProfile } from '../profile/profileActions';
import {
  getIngredients,
  addOrEditProfileIngredientSupplier,
  setSelectedIngredient,
  updateSelectedIngredientAfterProfileUpdate
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

  // Leave data in props
  // Put data in redux

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
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
    if (prevProps.ingredients !== this.props.ingredients) {
      this.setState({ ingredients: this.props.ingredients });
    }
    if (
      prevProps.selectedIngredient !== this.props.selectedIngredient
    ) {
      this.setState({
        searchedIngredientName: this.props.selectedIngredient
          .displayName
      });
    }
    if (
      prevProps.selectedIngredientSupplier !==
      this.props.selectedIngredientSupplier
    ) {
      // console.log(
      //   'Updated Selected Supplier State: ',
      //   this.props.selectedIngredientSupplier
      // );

      this.setState({
        selectedIngredientSupplier: this.props
          .selectedIngredientSupplier
      });
    }
    if (prevProps.suppliers !== this.props.suppliers) {
      this.setState({ suppliers: this.props.suppliers });
    }
  }

  async handleOnChangeSearch(e) {
    let inputData = e.target.value;
    await this.setState(prevState => ({
      searchedIngredientName: inputData
    }));
    await this.filteredIngredients(this.props.ingredient.ingredients);
  }

  async filteredIngredients(ingredientsArray) {
    // console.log(
    //   'this.state.searchedIngredientName: ',
    //   this.state.searchedIngredientName
    // );

    const { searchedIngredientName } = this.state;

    if (searchedIngredientName.length >= 1) {
      const filteredIngredients = ingredientsArray.filter(
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

  async handleSelectIngredient(e) {
    const { filteredSearchIngredientsArray } = this.state;
    const { profile, suppliers } = this.props;

    // Figures out which ingredient was selected
    const clickedOnIngredient = filteredSearchIngredientsArray.filter(
      ingredient => {
        return ingredient._id === e.target.id;
      }
    );

    console.log('clickedOnIngredient - react: ', clickedOnIngredient);

    await this.props.setSelectedIngredient(
      clickedOnIngredient[0],
      profile,
      suppliers
    );

    this.setState({ filteredSearchIngredientsArray: [] });
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

  handleConfirmProfileIngredientSupplier = e => {
    e.preventDefault();
    console.log(
      'Selected Ingredient: ',
      this.props.selectedIngredient
    );
    console.log(
      'selectedIngredientSupplier: ',
      this.state.selectedIngredientSupplier
    );

    this.props.addOrEditProfileIngredientSupplier(
      this.props.selectedIngredient,
      this.state.selectedIngredientSupplier
    );
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
      selectedIngredientSupplier
    } = this.state;

    let ingredientContent;
    if (ingredients === null && loading === true) {
      ingredientContent = <Spinner />;
    } else {
      ingredientContent = (
        <div>
          <form
            style={{ border: 'none' }}
            onSubmit={this.handleConfirmProfileIngredientSupplier}
          >
            <TextInput
              label="Search Ingredient"
              name="ingredient"
              value={searchedIngredientName}
              onChange={this.handleOnChangeSearch.bind(this)}
            />

            {!isEmpty(selectedIngredientSupplier) && (
              <React.Fragment>
                <TextInput
                  label="Package Cost"
                  name="packageCost"
                  value={selectedIngredientSupplier.packageCost}
                  onChange={this.handleIngredientSupplierChange}
                />
                <TextInput
                  label="Package Grams"
                  name="packageGrams"
                  value={selectedIngredientSupplier.packageGrams}
                  onChange={this.handleIngredientSupplierChange}
                />
                {console.log(
                  'Button Supplier: ',
                  selectedIngredientSupplier
                )}

                {!selectedIngredientSupplier.confirmedProfileIngredientSupplier && (
                  <button type="submit">
                    Confirm{' '}
                    {selectedIngredientSupplier.supplier.displayName}{' '}
                    as your Supplier
                  </button>
                )}
              </React.Fragment>
            )}
          </form>

          <ul>
            {filteredSearchIngredientsArray &&
              filteredSearchIngredientsArray.map(
                filteredSearchIngredient => (
                  <li
                    id={filteredSearchIngredient._id}
                    style={{ cursor: 'pointer' }}
                    onClick={this.handleSelectIngredient.bind(this)}
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
  updateSelectedIngredientAfterProfileUpdate
};

const mapState = state => ({
  ingredient: state.ingredient,
  suppliers: state.supplier.suppliers,
  errors: state.errors,
  ingredientLoading: state.ingredient.loading,
  auth: state.auth,
  profile: state.profile,
  selectedIngredient: state.ingredient.selectedIngredient,
  selectedIngredientSupplier:
    state.ingredient.selectedIngredientSupplier
});

Ingredient.propTypes = {
  getUserProfile: PropTypes.func.isRequired,
  getIngredients: PropTypes.func.isRequired,
  setSelectedIngredient: PropTypes.func.isRequired,
  getSuppliers: PropTypes.func.isRequired,
  addOrEditProfileIngredientSupplier: PropTypes.func.isRequired,
  updateSelectedIngredientAfterProfileUpdate:
    PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(Ingredient);
