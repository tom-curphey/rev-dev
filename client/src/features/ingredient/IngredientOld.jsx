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
    // profileIngredients: [],
    errors: {},
    ingredients: [],
    ingredient: {
      displayName: '',
      packetCost: '',
      suppliers: [],
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
      supplier: {
        _id: ''
      },
      selected: false,
      profileSupplier: false
    }
  };

  static getDerivedStateFromProps(nextProps, nextState) {
    // console.log(
    //   'getDerivedStateFromProps: nextProps',
    //   nextProps.profile.profile.ingredients
    // );
    // console.log(
    //   'getDerivedStateFromProps: nextState',
    //   nextState.profileIngredients
    // );
    // console.log('getDerivedStateFromProps: this.props', props);

    if (nextProps.profile.profile !== nextState.profile) {
      // console.log('Here');
      return {
        profile: nextProps.profile.profile
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

      if (this.props.profile.profile.ingredients) {
        const selectedProfileIngredient = this.props.profile.profile.ingredients.filter(
          selectedIngredient => {
            // console.log('selectedIngredient: ', selectedIngredient);
            // console.log(
            //   'prevState.ingredient: ',
            //   prevState.ingredient
            // );
            return (
              selectedIngredient.ingredient ===
              prevState.ingredient._id
            );
          }
        );
        // console.log(
        //   'selectedProfileIngredient: ',
        //   selectedProfileIngredient[0]
        // );
        const updatedSelectedSupplierData = [];
        // updatedSelectedSupplierData.suppliers = {};
        for (
          let index = 0;
          index < prevState.ingredient.suppliers.length;
          index++
        ) {
          if (
            selectedProfileIngredient[0].supplier ===
            prevState.ingredient.suppliers[index].supplier._id
          ) {
            updatedSelectedSupplierData[index] = {
              _id: prevState.ingredient.suppliers[index]._id,
              packageCost:
                prevState.ingredient.suppliers[index].packageCost,
              packageGrams:
                prevState.ingredient.suppliers[index].packageGrams,
              profileSupplier: true,
              selected: true,
              supplier: {
                _id:
                  prevState.ingredient.suppliers[index].supplier._id,
                displayName:
                  prevState.ingredient.suppliers[index].supplier
                    .displayName
              }
            };
            this.setState({
              supplier: updatedSelectedSupplierData[index]
            });
          }
        }
        // console.log(
        //   '----> updatedSelectedSupplierData: ',
        //   updatedSelectedSupplierData
        // );
      }
    }
    if (prevState.supplier !== this.state.supplier) {
      // console.log('prevState.supplier: ', prevState.supplier);
      // console.log(
      //   'this.state.supplier: ',
      //   this.state.supplier.supplier._id
      // );
      // console.log(
      //   'filteredSuppliersArray: ',
      //   this.state.filteredSuppliersArray
      // );

      const proSupplier = this.state.profile.ingredients.filter(
        proIngredient => {
          console.log('proIngredient: ', proIngredient);
          console.log(
            'this.state.ingredient: ',
            this.state.ingredient
          );
          if (
            proIngredient.ingredient === this.state.ingredient._id
          ) {
            return proIngredient;
          }
          return null;
        }
      );

      const fullSupplier = this.state.suppliers.filter(
        fullSupplier => {
          console.log('fullSupplier: ', fullSupplier);
          return fullSupplier._id == proSupplier[0].supplier;
        }
      );

      console.log('proSupplier: ', proSupplier[0]);
      console.log('fullSupplier: ', fullSupplier[0]);
      // console.log(
      //   'selectedSupplier[0].supplier._id: ',
      //   selectedSupplier[0].supplier._id
      // );
      // if (
      //   proSupplier[0].supplier === selectedSupplier[0].supplier._id
      // ) {
      //   selectedSupplier[0].profileSupplier = true;
      // } else {
      //   selectedSupplier[0].profileSupplier = false;
      // }

      const updatedFilteredSuppliersData = [];
      // updatedSelectedSupplierData.suppliers = {};
      for (
        let index = 0;
        index < this.state.filteredSuppliersArray.length;
        index++
      ) {
        console.log(
          'this.state.filteredSuppliersArray[index].supplier._id: ',
          this.state.filteredSuppliersArray[index].supplier._id
        );
        console.log(
          'proSupplier[0].supplier: ',
          proSupplier[0].supplier
        );

        if (
          this.state.filteredSuppliersArray[index].supplier._id ===
          proSupplier[0].supplier
        ) {
          updatedFilteredSuppliersData[index] = {
            _id: proSupplier[0]._id,
            packageCost: proSupplier[0].packageCost,
            packageGrams: proSupplier[0].packageGrams,
            profileSupplier: true,
            selected: true,
            supplier: {
              _id: proSupplier[0].supplier,
              displayName: fullSupplier[0].displayName
            }
          };
        } else {
          updatedFilteredSuppliersData[index] = {
            _id: this.state.filteredSuppliersArray[index]._id,
            packageCost: this.state.filteredSuppliersArray[index]
              .packageCost,
            packageGrams: this.state.filteredSuppliersArray[index]
              .packageGrams,
            supplier: {
              _id: this.state.filteredSuppliersArray[index].supplier
                ._id,
              displayName: this.state.filteredSuppliersArray[index]
                .supplier.displayName
            }
          };
        }
      }
      // console.log(
      //   'updatedFilteredSuppliersData: ',
      //   updatedFilteredSuppliersData
      // );
      this.setState({
        filteredSuppliersArray: updatedFilteredSuppliersData
      });

      // this.state.filteredSuppliersArray.filter(filSupplier => {
      //   console.log(
      //     'filSupplier.supplier._id: ',
      //     filSupplier.supplier._id
      //   );
      //   console.log('this.state.supplier: ', this.state.supplier);
      //   if (this.state.supplier.profileSupplier) {
      //   //   console.log('filSupplier: ', filSupplier);
      //   //   filSupplier.packageCost = this.state.supplier.packageCost.toString();
      //   //   filSupplier.packageGrams = this.state.supplier.packageGrams.toString();
      //   //   filSupplier.profileSupplier = true;
      //   //   filSupplier.selected = true;
      //   //   console.log('filSupplier: ', filSupplier);
      //   //   return filSupplier;
      //   // } else {
      //   //   return null;
      //   // }
      //   return null;
      // });
      // console.log('setSupplier: ', setSupplier);
      // if (setSupplier.length > 0) {
      //   this.setState({ supplier: setSupplier[0] });
      // }
    }
  }

  async filteredIngredients(ingredientsArray) {
    const searchInput = this.state.ingredient.displayName;

    if (searchInput.length >= 1) {
      const filteredIngredients = ingredientsArray.filter(
        ingredient => {
          // console.log('dataIngredient: ', ingredient.urlName);
          // console.log(
          //   'IngredeintSearch: ',
          //   this.state.ingredient.displayName
          // );
          // console.log('IngredeintSearch: ', this.state);

          let re = new RegExp(searchInput, 'gi');
          let matchedArray = ingredient.urlName.match(re);

          // const matchedArray = ingredient.urlName.match(
          //   /this.state.ingredient.name/gi
          // );
          // console.log('matchedArray: ', matchedArray);

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
    const {
      suppliers,
      filteredIngredientsArray,
      profile,
      supplier
    } = this.state;

    // console.log('---> handleSelectIngredient PROFILE', profile);

    // Figures out which ingredient was selected
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

    // Figures out if the ingredient selected is in the users profile.ingredients[]
    const profileSelectedIngredient = profile.ingredients.filter(
      profileIngredient => {
        // console.log(
        //   'profileIngredient.ingredient: ',
        //   profileIngredient.ingredient
        // );
        // console.log(
        //   'selectedIngredient[0]._id: ',
        //   selectedIngredient[0]._id
        // );

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

    // Filters ingredient suppliers and puts them in ABC order
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

      if (selectedIngredient[0].profileIngredient) {
        const setSupplier = filteredSuppliers.filter(filSupplier => {
          if (
            filSupplier.supplier._id ===
            profileSelectedIngredient[0].supplier
          ) {
            // console.log('filSupplier: ', filSupplier);
            // console.log(
            //   'profileSelectedIngredient[0]: ',
            //   profileSelectedIngredient[0]
            // );
            filSupplier.packageCost = profileSelectedIngredient[0].packageCost.toString();
            filSupplier.packageGrams = profileSelectedIngredient[0].packageGrams.toString();
            filSupplier.profileSupplier = true;
            filSupplier.selected = true;
            // console.log('filSupplier: ', filSupplier);
            return filSupplier;
          } else {
            return null;
          }
        });
        // console.log('setSupplier: ', setSupplier);
        if (setSupplier.length > 0) {
          this.setState({ supplier: setSupplier[0] });
        }
      }
      this.setState({ filteredSuppliersArray: filteredSuppliers });
    }

    // console.log('selectedIngredient: ', selectedIngredient[0]);
    this.setState({ ingredient: selectedIngredient[0] });
    this.setState({ filteredIngredientsArray: [] });
  };

  // Handles the ability to select a supplier
  handleSelectSupplier = e => {
    const selectedSupplier = this.state.ingredient.suppliers.filter(
      supplier => {
        // console.log('dataSupplier: ', supplier.supplier._id);
        // console.log('selectedSupplier: ', e.target.id);
        return supplier.supplier._id === e.target.id;
      }
    );
    selectedSupplier[0].packageCost = selectedSupplier[0].packageCost.toString();
    selectedSupplier[0].packageGrams = selectedSupplier[0].packageGrams.toString();
    selectedSupplier[0].selected = true;

    const proSupplier = this.state.profile.ingredients.filter(
      proIngredient => {
        console.log('proIngredient: ', proIngredient);
        console.log('this.state.ingredient: ', this.state.ingredient);
        if (proIngredient.ingredient === this.state.ingredient._id) {
          return proIngredient;
        }
        return null;
      }
    );

    console.log('proSupplier: ', proSupplier[0].supplier);
    console.log(
      'selectedSupplier[0].supplier._id: ',
      selectedSupplier[0].supplier._id
    );
    if (
      proSupplier[0].supplier === selectedSupplier[0].supplier._id
    ) {
      selectedSupplier[0].profileSupplier = true;
    } else {
      selectedSupplier[0].profileSupplier = false;
    }
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

    if (!isEmpty(this.state)) {
      console.log('********* State Check: ', this.state);
    }

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
            {supplier.selectedIngredientSupplier && (
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
            supplier={supplier}
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
