import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../../utils/spinner/Spinner';
import TextInput from '../../utils/input/TextInput';
import RecipeComparison from './RecipeComparison';
import isEmpty from '../../utils/validation/is.empty';
import { isNumber } from 'util';
import {
  calcTotalIngredientCost,
  calcVenueCost,
  calcStaffCost,
  calcProfitPerServe,
  calcProfitPerYear,
  recommendedSalesPrice,
  roundNumber,
  calcRecipeProfit,
  calcRecipeRevenue,
  calcProfitMargin,
  calcRecipeMarkup,
  calcRecipeGrams,
  calcRecipeGramsPerServe
} from '../../utils/utilityFunctions';
import twoDecimalNumber from '../utils/twoDecimalNumber';

class RecipeResults extends Component {
  state = {
    errors: {},
    selectedRecipe: {},
    recipeResults: {}
  };

  componentDidMount() {
    if (this.props.recipe.selectedRecipe !== null) {
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
      console.log('PROP CHANGE');

      if (Object.keys(this.props.recipe.selectedRecipe).length > 0) {
        const { selectedRecipe } = this.props.recipe;
        const { venue } = this.props.venue;
        const recipeResults = {};

        recipeResults.totalIngredientCost = calcTotalIngredientCost(
          selectedRecipe
        );

        recipeResults.staffCost = calcStaffCost(
          selectedRecipe,
          venue
        );
        recipeResults.venueCost = calcVenueCost(
          selectedRecipe,
          venue
        );

        let totalCost =
          recipeResults.totalIngredientCost +
          recipeResults.staffCost +
          recipeResults.venueCost;

        recipeResults.profitPerServe = calcProfitPerServe(
          selectedRecipe,
          totalCost
        );

        recipeResults.profitPerYear = calcProfitPerYear(
          selectedRecipe,
          recipeResults.profitPerServe,
          venue
        );

        recipeResults.recommendedSalesPrice = recommendedSalesPrice(
          selectedRecipe.serves,
          totalCost
        );

        recipeResults.recipeProfit = calcRecipeProfit(
          selectedRecipe,
          totalCost
        );

        recipeResults.recipeRevenue = calcRecipeRevenue(
          selectedRecipe
        );

        recipeResults.profitMargin = calcProfitMargin(
          recipeResults.recipeProfit,
          recipeResults.recipeRevenue
        );

        recipeResults.recipeMarkup = calcRecipeMarkup(
          recipeResults.recipeProfit,
          totalCost
        );

        recipeResults.recipeGrams = calcRecipeGrams(
          selectedRecipe.ingredients
        );

        recipeResults.recipeGramsPerServe = calcRecipeGramsPerServe(
          selectedRecipe.ingredients,
          selectedRecipe.serves
        );

        this.setState({ recipeResults: recipeResults });
      }
    }
    if (prevState.selectedRecipe !== this.state.selectedRecipe) {
      console.log('STATE CHANGE');
      if (Object.keys(this.state.selectedRecipe).length > 0) {
        const { selectedRecipe } = this.state;
        const { venue } = this.props.venue;
        const recipeResults = {};

        recipeResults.totalIngredientCost = calcTotalIngredientCost(
          selectedRecipe
        );

        recipeResults.staffCost = calcStaffCost(
          selectedRecipe,
          venue
        );
        recipeResults.venueCost = calcVenueCost(
          selectedRecipe,
          venue
        );

        let totalCost =
          recipeResults.totalIngredientCost +
          recipeResults.staffCost +
          recipeResults.venueCost;

        recipeResults.profitPerServe = calcProfitPerServe(
          selectedRecipe,
          totalCost
        );

        recipeResults.profitPerYear = calcProfitPerYear(
          selectedRecipe,
          recipeResults.profitPerServe,
          venue
        );

        recipeResults.recommendedSalesPrice = recommendedSalesPrice(
          selectedRecipe.serves,
          totalCost
        );

        recipeResults.recipeProfit = calcRecipeProfit(
          selectedRecipe,
          totalCost
        );

        recipeResults.recipeRevenue = calcRecipeRevenue(
          selectedRecipe
        );

        recipeResults.profitMargin = calcProfitMargin(
          recipeResults.recipeProfit,
          recipeResults.recipeRevenue
        );

        recipeResults.recipeMarkup = calcRecipeMarkup(
          recipeResults.recipeProfit,
          totalCost
        );

        recipeResults.recipeGrams = calcRecipeGrams(
          selectedRecipe.ingredients
        );

        recipeResults.recipeGramsPerServe = calcRecipeGramsPerServe(
          selectedRecipe.ingredients,
          selectedRecipe.serves
        );

        this.setState({ recipeResults: recipeResults });
      }
    }
  }

  handleOnChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    if (value !== '') {
      if (!isNaN(value)) {
        let checkDecimal = value.search(/\./);
        // let checkDecimal = value.search(/^\d*\.?\d*$/);
        // let checkDecimal = value.search(/^\d+(\.\d{1,2})?$/);
        // console.log('checkDecimal: ', checkDecimal);
        if (checkDecimal !== -1) {
          value = e.target.value;
        }
        this.setState(prevState => ({
          selectedRecipe: {
            ...prevState.selectedRecipe,
            [name]: value
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

  render() {
    const { selectedRecipe, errors, recipeResults } = this.state;
    const recipeLoading = this.props.recipe.loading;
    const { venue } = this.props.venue;
    const venueLoading = this.props.venue.loading;
    const { profile } = this.props;

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
          <TextInput
            placeholder="Confirm Sales Price"
            name="salePricePerServe"
            type="text"
            value={selectedRecipe.salePricePerServe}
            onChange={this.handleOnChange}
            label="Confirm Sales Price"
            error={errors.salePricePerServe}
          />
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

    console.log('recipeResults', recipeResults);

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
        <li>Cost Per Serve</li>
        <li>Recipe Cost</li>
        <li>Ingredient Cost</li>
        <li>Staff Cost</li>
        <li>Venue Cost</li>
        <li>Packaging Cost</li>
      </ul>
    );

    let profitProjections = (
      <ul>
        <li>Profit Per Week</li>
        <li>Profit Per Month</li>
        <li>Profit Per Year</li>
        <li>Revenue Per Week</li>
        <li>Revenue Per Month</li>
        <li>Revenue Per Year</li>
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
          <section className="recipeResults">
            {recipeAnalysis}
            {recipeCosts}
            {profitProjections}
          </section>
        </React.Fragment>
      );
    }

    return <section className="">{recipeContent}</section>;
  }
}

const actions = {};

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
  errors: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(RecipeResults);
