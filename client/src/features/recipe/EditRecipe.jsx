import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getCurrentVenue } from '../venue/venueActions';
import { getSelectedRecipeByID } from './recipeActions';
import Spinner from '../../utils/spinner/Spinner';
import capitalizeFirstLetter from '../../utils/functions/capitalizeFirstLetter';
import RecipeDetails from './RecipeDetails';
import RecipeIngredients from './RecipeIngredients';
import RecipeResults from './RecipeResults';

class EditRecipe extends Component {
  state = {
    toggle: 'details'
    // recipeDetails: true,
    // recipeIngredients: false,
    // recipeResults: false
  };

  componentDidMount() {
    this.props.getSelectedRecipeByID(
      this.props.match.params.recipe_id
    );
    this.props.getCurrentVenue();
    // if (this.props.recipe.selectedRecipe === null) {
    //   this.props.history.push('/recipes');
    // } else {
    //   this.setState({
    //     selectedRecipe: this.props.recipe.selectedRecipe
    //   });
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    // console.log('prevProps: ', prevProps.recipe);
    // console.log('this.props: ', this.props.recipe);
  }

  handleChangeToggle = selectedToggle => {
    this.setState({ toggle: selectedToggle });
  };

  render() {
    const { selectedRecipe, loading } = this.props.recipe;
    const { toggle } = this.state;

    let recipeContent;
    let recipeTitle;
    let recipeToggleButtons;
    if (loading === true || selectedRecipe === null) {
      recipeTitle = <h1>Edit Recipe</h1>;
    } else {
      recipeTitle = (
        <h1>
          {selectedRecipe.displayName} Recipe{' '}
          {capitalizeFirstLetter(toggle)}
        </h1>
      );
      recipeToggleButtons = (
        <div>
          <button onClick={() => this.handleChangeToggle('details')}>
            Details
          </button>
          <button
            onClick={() => this.handleChangeToggle('ingredients')}
          >
            Ingredients
          </button>
          <button onClick={() => this.handleChangeToggle('results')}>
            Results
          </button>
        </div>
      );

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
    }

    return <section className="editRecipe">{recipeContent}</section>;
  }
}

const actions = {
  getSelectedRecipeByID,
  getCurrentVenue
};

const mapState = state => ({
  recipe: state.recipe,
  errors: state.errors
});

EditRecipe.propTypes = {
  recipe: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  getCurrentVenue: PropTypes.func.isRequired,
  getSelectedRecipeByID: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(EditRecipe);
