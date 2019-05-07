import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
    if (this.props.recipe.selectedRecipe === null) {
      this.props.history.push('/recipes');
    } else {
      this.setState({
        selectedRecipe: this.props.recipe.selectedRecipe
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    console.log('prevProps: ', prevProps.recipe);
    console.log('this.props: ', this.props.recipe);

    if (
      prevProps.recipe.selectedRecipe !==
      this.props.recipe.selectedRecipe
    ) {
      this.setState({
        selectedRecipe: this.props.recipe.selectedRecipe
      });
    }
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
      recipeContent = <Spinner />;
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

const actions = {};

const mapState = state => ({
  recipe: state.recipe,
  errors: state.errors
});

EditRecipe.propTypes = {
  recipe: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(EditRecipe);
