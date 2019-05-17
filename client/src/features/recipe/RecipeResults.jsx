import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Spinner from '../../utils/spinner/Spinner';
import RecipeComparison from './RecipeComparison';

class RecipeResults extends Component {
  state = {};

  componentDidMount() {}

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

  render() {
    const { selectedRecipe, loading } = this.props.recipe;

    let recipeContent;
    if (loading === true || selectedRecipe === null) {
      recipeContent = <Spinner />;
    } else {
      recipeContent = (
        <React.Fragment>
          <RecipeComparison selectedRecipe={selectedRecipe} />
        </React.Fragment>
      );
    }

    return (
      <section className="recipeResults">{recipeContent}</section>
    );
  }
}

const actions = {};

const mapState = state => ({
  recipe: state.recipe,
  errors: state.errors
});

RecipeResults.propTypes = {
  recipe: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(RecipeResults);
