import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEmpty from '../../utils/validation/is.empty';
import roundNumber from '../../utils/functions/roundNumber';
import { getUserProfile } from '../profile/profileActions';
import { getCurrentVenue } from '../venue/venueActions';
import {
  getIngredients,
  addOrEditProfileIngredientSupplier,
  setSelectedIngredient,
  removeSelectedIngredient,
  closeAddIngredientPanel,
  openAddIngredientPanel,
  addNewIngredient,
  clearIngredients
} from './ingredientActions';
import { getSuppliers, clearSuppliers } from './supplierActions';
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
    this.props.getCurrentVenue();
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('prevProps: ', prevProps.ingredient);
    // console.log('this.props: ', this.props.ingredient);

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

  componentWillUnmount() {
    this.props.clearIngredients();
    this.props.clearSuppliers();
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
      this.props.setSelectedIngredient(
        selectedIngredient,
        this.props.profile.profile,
        true
      );
    }
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

    let ingredientContent;
    let supplierContent;
    let metricContent = '';
    if (ingredients === null || loading === true) {
      ingredientContent = <Spinner />;
    } else {
      ingredientContent = (
        <div>
          <form style={{ border: 'none' }}>
            <SelectIngredient
              getSelectedIngredient={this.getSelectedIngredient}
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
        supplierContent = <SupplierPanel />;
      }

      if (selectedIngredient.metrics) {
        let cupPrice = '-';
        let gramPrice = '-';
        let teaspoonPrice = '-';
        let tablespoonPrice = '-';

        // console.log(
        //   'selectedIngredientSupplier: ',
        //   selectedIngredientSupplier
        // );

        if (
          selectedIngredientSupplier !== null &&
          Object.keys(selectedIngredientSupplier).length > 0
        ) {
          if (
            selectedIngredientSupplier.packageCost > 0 &&
            selectedIngredientSupplier.packageGrams > 0
          ) {
            // console.log(
            //   'selectedIngredientSupplier.packageCost: ',
            //   selectedIngredientSupplier.packageCost
            // );
            const gramCalcPrice =
              selectedIngredientSupplier.packageCost /
              selectedIngredientSupplier.packageGrams;

            // console.log('gram: ', gramCalcPrice);

            if (isNaN(gramCalcPrice)) {
              // console.log('gram: ', gramCalcPrice);
              cupPrice = 0;
              gramPrice = 0;
              teaspoonPrice = 0;
              tablespoonPrice = 0;
            } else {
              cupPrice = roundNumber(
                gramCalcPrice * +selectedIngredient.metrics.cup,
                4
              );
              gramPrice = roundNumber(gramCalcPrice, 4);
              tablespoonPrice = roundNumber(
                gramCalcPrice *
                  +selectedIngredient.metrics.tablespoon,
                4
              );

              teaspoonPrice = roundNumber(
                gramCalcPrice * +selectedIngredient.metrics.teaspoon,
                4
              );

              if (cupPrice === 0.0) {
                cupPrice = '-';
              }
              if (gramPrice === 0.0) {
                gramPrice = '-';
              }
              if (tablespoonPrice === 0.0) {
                tablespoonPrice = '-';
              }
              if (teaspoonPrice === 0.0) {
                teaspoonPrice = '-';
              }
            }
          }
        }

        // console.log('gramPrice: ', gramPrice);

        metricContent = (
          <section className="metric_details">
            <h1>
              {selectedIngredient.displayName} Metric Details & Costs
            </h1>

            <ul>
              <li>
                <div>Metric</div>
                <div>Grams</div>
                <div>Cost</div>
              </li>
              <li>
                <div>Cup</div>
                <div>
                  {roundNumber(selectedIngredient.metrics.cup, 4)}
                </div>
                <div>{cupPrice}</div>
              </li>
              <li>
                <div>Gram</div>
                <div>1</div>
                <div>{gramPrice}</div>
              </li>
              <li>
                <div>Tablespoon</div>
                <div>
                  {roundNumber(
                    selectedIngredient.metrics.tablespoon,
                    4
                  )}
                </div>
                <div>{tablespoonPrice}</div>
              </li>
              <li>
                <div>Teaspoon</div>
                <div>
                  {roundNumber(
                    selectedIngredient.metrics.teaspoon,
                    4
                  )}
                </div>
                <div>{teaspoonPrice}</div>
              </li>
            </ul>
          </section>
        );
      }
    }

    return (
      <div className="ingredient_page">
        <section className="ingredient_left">
          <h1>Ingredient Page</h1>
          {ingredientContent && ingredientContent}
          {metricContent && metricContent}
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
  addNewIngredient,
  clearIngredients,
  clearSuppliers,
  getCurrentVenue
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
  getCurrentVenue: PropTypes.func.isRequired,
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
