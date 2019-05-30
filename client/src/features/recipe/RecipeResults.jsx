import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { editRecipe } from './recipeActions';
import Spinner from '../../utils/spinner/Spinner';
import TextInput from '../../utils/input/TextInput';
import RecipeComparison from './RecipeComparison';
import isEmpty from '../../utils/validation/is.empty';
import { isNumber } from 'util';
import {
  roundNumber,
  getRecipeResults,
  getIngredientResults
} from '../../utils/utilityFunctions';
import twoDecimalNumber from '../utils/twoDecimalNumber';

class RecipeResults extends Component {
  state = {
    errors: {},
    selectedRecipe: {},
    recipeResults: {},
    ingredientResults: []
  };

  componentDidMount() {
    if (
      this.props.recipe.selectedRecipe !== null &&
      this.props.venue !== null
    ) {
      if (Object.keys(this.props.recipe.selectedRecipe).length > 0) {
        const { selectedRecipe } = this.props.recipe;
        const { venue } = this.props.venue;
        const recipeResults = getRecipeResults(selectedRecipe, venue);
        this.setState({ recipeResults: recipeResults });

        console.log('Selected Re', selectedRecipe);

        if (selectedRecipe.ingredients.length > 0) {
          const ingredientResults = getIngredientResults(
            selectedRecipe,
            recipeResults.recipeGrams
          );
          this.setState({ ingredientResults: ingredientResults });
        }
      }

      this.setState({
        selectedRecipe: this.props.recipe.selectedRecipe
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    if (
      prevProps.recipe.selectedRecipe !==
      this.props.recipe.selectedRecipe
    ) {
      this.setState({
        selectedRecipe: this.props.recipe.selectedRecipe
      });
    }

    if (
      prevProps.recipe.selectedRecipe !==
        this.props.recipe.selectedRecipe &&
      this.props.venue !== null
    ) {
      if (Object.keys(this.props.recipe.selectedRecipe).length > 0) {
        const { selectedRecipe } = this.props.recipe;
        const { venue } = this.props.venue;
        const recipeResults = getRecipeResults(selectedRecipe, venue);
        this.setState({ recipeResults: recipeResults });

        console.log('Selected Re', selectedRecipe);

        if (selectedRecipe.ingredients.length > 0) {
          const ingredientResults = getIngredientResults(
            selectedRecipe,
            recipeResults.recipeGrams
          );
          this.setState({ ingredientResults: ingredientResults });
        }
      }
    }
    if (prevState.selectedRecipe !== this.state.selectedRecipe) {
      if (Object.keys(this.state.selectedRecipe).length > 0) {
        const { selectedRecipe } = this.state;
        const { venue } = this.props.venue;
        const recipeResults = getRecipeResults(selectedRecipe, venue);

        this.setState({ recipeResults: recipeResults });
      }
    }
  }

  handleOnChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    if (value !== '') {
      if (!isNaN(value)) {
        this.setState(prevState => ({
          selectedRecipe: {
            ...prevState.selectedRecipe,
            [name]: value
          }
        }));
      }
      if (value === '.') {
        this.setState(prevState => ({
          selectedRecipe: {
            ...prevState.selectedRecipe,
            [name]: '0.'
          }
        }));
      }
    } else {
      this.setState(prevState => ({
        selectedRecipe: {
          ...prevState.selectedRecipe,
          [name]: value
        }
      }));
    }
  };

  handleOnSubmit = exit => e => {
    e.preventDefault();

    const { selectedRecipe } = this.state;

    const updatedRecipe = {
      ...selectedRecipe,
      expectedSales: selectedRecipe.salePricePerServe
    };

    console.log('Updated Recipe', updatedRecipe);

    this.props.editRecipe(
      updatedRecipe,
      this.props.profile,
      this.props.history,
      exit
    );
  };

  render() {
    const {
      selectedRecipe,
      errors,
      recipeResults,
      ingredientResults
    } = this.state;
    const recipeLoading = this.props.recipe.loading;
    const { venue } = this.props.venue;
    const venueLoading = this.props.venue.loading;
    const { profile } = this.props;

    // console.log('ingredientResults', ingredientResults);

    let salesPriceForm;
    if (!isEmpty(selectedRecipe)) {
      salesPriceForm = (
        <React.Fragment>
          <div>
            <p>
              Recomended Sales Price:{' '}
              {isNumber(recipeResults.recommendedSalesPrice) ? (
                roundNumber(recipeResults.recommendedSalesPrice, 2)
              ) : (
                <span style={{ color: 'red' }}>
                  {recipeResults.recommendedSalesPrice}
                </span>
              )}
            </p>
          </div>
          <form>
            <TextInput
              placeholder="Sales Price"
              name="salePricePerServe"
              type="text"
              value={selectedRecipe.salePricePerServe}
              onChange={this.handleOnChange}
              label="Confirm Sales Price"
              error={errors.salePricePerServe}
            />
            <button
              type="onSubmit"
              onClick={this.handleOnSubmit(false)}
            >
              Confirm Sales Price
            </button>
          </form>
        </React.Fragment>
      );
    }

    let recipeServes = (
      <React.Fragment>
        <hr />
        <p>
          Recipe Results are based off selling {selectedRecipe.serves}{' '}
          serves per week at ${selectedRecipe.salePricePerServe}
        </p>
        <hr />
      </React.Fragment>
    );

    let recipeAnalysis = (
      <ul>
        <li>
          <span>Profit Per Serve</span>
          <span>
            {twoDecimalNumber(recipeResults.profitPerServe)}
          </span>
        </li>
        <li>
          <span>Recipe Profit</span>
          <span>{twoDecimalNumber(recipeResults.recipeProfit)}</span>
        </li>
        <li>
          <span>Recipe Revenue</span>
          <span>{twoDecimalNumber(recipeResults.recipeRevenue)}</span>
        </li>
        <li>
          <span>Profit Margin</span>
          <span>{twoDecimalNumber(recipeResults.profitMargin)}%</span>
        </li>
        <li>
          <span>Recipe Markup</span>
          <span>{twoDecimalNumber(recipeResults.recipeMarkup)}%</span>
        </li>
        <li>
          <span>Recipe Grams</span>
          <span>{twoDecimalNumber(recipeResults.recipeGrams)}</span>
          <span />
        </li>
        <li>
          <span>Grams Per Serve</span>
          <span>
            {twoDecimalNumber(recipeResults.recipeGramsPerServe)}
          </span>
          <span />
        </li>
      </ul>
    );

    let recipeCosts = (
      <ul>
        <li>
          <span>Cost Per Serve</span>
          <span>{twoDecimalNumber(recipeResults.costPerServe)}</span>
        </li>
        <li>
          <span>Recipe Cost</span>
          <span>{twoDecimalNumber(recipeResults.recipeCost)}</span>
        </li>
        <li>
          <span>Ingredient Cost</span>
          <span>
            {twoDecimalNumber(recipeResults.totalIngredientCost)}
          </span>
        </li>
        <li>
          <span>Staff Cost</span>
          <span>{twoDecimalNumber(recipeResults.staffCost)}</span>
        </li>
        <li>
          <span>Venue Cost</span>
          <span>{twoDecimalNumber(recipeResults.venueCost)}</span>
        </li>
        <li>
          <span>Packaging Cost</span>
          <span />
        </li>
      </ul>
    );

    let profitProjections = (
      <ul>
        <li>
          <span>Profit Per Week</span>
          <span>{twoDecimalNumber(recipeResults.profitPerWeek)}</span>
        </li>
        <li>
          <span>Profit Per Month</span>
          <span>
            {twoDecimalNumber(recipeResults.profitPerMonth)}
          </span>
        </li>
        <li>
          <span>Profit Per Year</span>
          <span>{twoDecimalNumber(recipeResults.profitPerYear)}</span>
        </li>
        <li>
          <span>Revenue Per Week</span>
          <span>
            {twoDecimalNumber(recipeResults.revenuePerWeek)}
          </span>
        </li>
        <li>
          <span>Revenue Per Month</span>
          <span>
            {twoDecimalNumber(recipeResults.revenuePerMonth)}
          </span>
        </li>
        <li>
          <span>Revenue Per Year</span>
          <span>
            {twoDecimalNumber(recipeResults.revenuePerYear)}
          </span>
        </li>
      </ul>
    );

    let ingredientsOverview = (
      <ul>
        <li>
          <div>Ingredient Name</div>
          <div>Recipe Cost</div>
          <div>Recipe Grams</div>
          <div>Contribution</div>
          <div>Packet Cost</div>
          <div>Packet Grams</div>
        </li>
        {ingredientResults &&
          ingredientResults.map((ingredient, i) => {
            return (
              <li key={i}>
                <div>{ingredient.displayName}</div>
                <div>{twoDecimalNumber(ingredient.recipeCost)}</div>
                <div>{twoDecimalNumber(ingredient.recipeGrams)}</div>
                <div>
                  {twoDecimalNumber(ingredient.contribution)}%
                </div>
                <div>{twoDecimalNumber(ingredient.packageCost)}</div>
                <div>{twoDecimalNumber(ingredient.packageGrams)}</div>
              </li>
            );
          })}
      </ul>
    );

    let recipeContent;
    if (
      recipeLoading === true ||
      selectedRecipe === null ||
      venueLoading === true ||
      venue === null
    ) {
      recipeContent = <Spinner />;
    } else {
      recipeContent = (
        <React.Fragment>
          {!isEmpty(recipeResults) && (
            <RecipeComparison
              selectedRecipe={selectedRecipe}
              recipeResults={recipeResults}
              profile={profile}
              venue={venue}
            />
          )}
          <hr />
          {salesPriceForm}
          {recipeServes}
          <section className="recipeOverview">
            {recipeAnalysis}
            {recipeCosts}
            {profitProjections}
          </section>
          <hr />
          <section className="ingredientResults">
            {ingredientsOverview}
          </section>
        </React.Fragment>
      );
    }

    return (
      <section className="recipeResults">{recipeContent}</section>
    );
  }
}

const actions = {
  editRecipe
};

const mapState = state => ({
  recipe: state.recipe,
  profile: state.profile.profile,
  venue: state.venue,
  errors: state.errors
});

RecipeResults.propTypes = {
  recipe: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  venue: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  roundNumber: PropTypes.func,
  getRecipeResults: PropTypes.func
};

export default connect(
  mapState,
  actions
)(withRouter(RecipeResults));
