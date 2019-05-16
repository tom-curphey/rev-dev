import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getCurrentVenue } from '../venue/venueActions';
import {
  getSelectedRecipeByID,
  addSuppliersToRecipeIngredients
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
    this.props.getSelectedRecipeByID(
      this.props.match.params.recipe_id
    );
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

    if (
      this.props.recipe.selectedRecipe !== null &&
      this.props.ingredient.ingredients !== null &&
      this.props.profile !== null &&
      prevProps.recipe.selectedRecipe !==
        this.props.recipe.selectedRecipe
    ) {
      this.addSuppliersToRecipeIngredients(
        this.props.recipe.selectedRecipe,
        this.props.ingredient.ingredients,
        this.props.profile
      );
    }
    // console.log(this.props.match.params.recipe_toggle);
    // console.log('prevProps: ', prevProps.recipe);
    // console.log('this.props: ', this.props.recipe);
  }

  addSuppliersToRecipeIngredients = (
    selectedRecipe,
    ingredients,
    profile
  ) => {
    const updatedRecipe = {
      yo: 'you',
      ...selectedRecipe
    };
    this.setState({ selectedRecipe: updatedRecipe });
  };

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
  addSuppliersToRecipeIngredients
};

const mapState = state => ({
  recipe: state.recipe,
  profile: state.profile,
  ingredient: state.ingredient,
  errors: state.errors
});

EditRecipe.propTypes = {
  recipe: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getCurrentVenue: PropTypes.func.isRequired,
  getSelectedRecipeByID: PropTypes.func.isRequired,
  getIngredients: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(EditRecipe);
