import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getCurrentVenue } from '../venue/venueActions';
import {
  getSelectedRecipeByID,
  addSuppliersToRecipeIngredients,
  removeSelectedRecipe
} from './recipeActions';
import { getIngredients } from '../ingredient/ingredientActions';
import capitalizeFirstLetter from '../../utils/functions/capitalizeFirstLetter';
import RecipeDetails from './RecipeDetails';
import RecipeIngredients from './RecipeIngredients';
import RecipeResults from './RecipeResults';

class EditRecipe extends Component {
  state = {
    toggle: 'details',
    selectedRecipe: {}
  };

  async componentDidMount() {
    this.props.getCurrentVenue();
    this.props.getIngredients();

    if (this.props.recipe.selectedRecipe === null) {
      this.props.getSelectedRecipeByID(
        this.props.match.params.recipe_id
      );
    }
    if (this.props.match.params.recipe_toggle) {
      this.setState({
        toggle: this.props.match.params.recipe_toggle
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    if (
      prevProps.match.params.recipe_toggle !==
      this.props.match.params.recipe_toggle
    ) {
      this.setState({
        toggle: this.props.match.params.recipe_toggle
      });
    }
  }

  handleChangeToggle = selectedToggle => {
    this.setState({ toggle: selectedToggle });
  };

  render() {
    const { selectedRecipe, loading } = this.props.recipe;
    const { toggle } = this.state;
    const { recipe_name } = this.props.match.params;

    let recipeContent;
    let recipeTitle;
    let recipeToggleButtons;
    if (loading === true || selectedRecipe === null) {
      recipeTitle = (
        <h1>
          {capitalizeFirstLetter(recipe_name)}{' '}
          {capitalizeFirstLetter(toggle)}
        </h1>
      );
    } else {
      recipeTitle = (
        <h1>
          {selectedRecipe.displayName} {capitalizeFirstLetter(toggle)}
        </h1>
      );
      recipeToggleButtons = (
        <div>
          <Link
            style={{ cursor: 'pointer' }}
            to={`/edit-recipe/${selectedRecipe._id}/${
              selectedRecipe.urlName
            }/details`}
          >
            Details
          </Link>
          <Link
            style={{ cursor: 'pointer' }}
            to={`/edit-recipe/${selectedRecipe._id}/${
              selectedRecipe.urlName
            }/ingredients`}
          >
            Ingredients
          </Link>
          <Link
            style={{ cursor: 'pointer' }}
            to={`/edit-recipe/${selectedRecipe._id}/${
              selectedRecipe.urlName
            }/results`}
          >
            Results
          </Link>
        </div>
      );
    }

    recipeContent = (
      <React.Fragment>
        <section className="recipeNav">
          {recipeTitle}
          {recipeToggleButtons}
        </section>
        {toggle === 'details' && <RecipeDetails />}
        {toggle === 'ingredients' && <RecipeIngredients />}
        {toggle === 'results' && <RecipeResults />}
      </React.Fragment>
    );

    return <section className="editRecipe">{recipeContent}</section>;
  }
}

const actions = {
  getSelectedRecipeByID,
  getCurrentVenue,
  getIngredients,
  addSuppliersToRecipeIngredients,
  removeSelectedRecipe
};

const mapState = state => ({
  recipe: state.recipe,
  ingredient: state.ingredient,
  errors: state.errors
});

EditRecipe.propTypes = {
  recipe: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getCurrentVenue: PropTypes.func.isRequired,
  getSelectedRecipeByID: PropTypes.func.isRequired,
  getIngredients: PropTypes.func.isRequired,
  removeSelectedRecipe: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(EditRecipe);
