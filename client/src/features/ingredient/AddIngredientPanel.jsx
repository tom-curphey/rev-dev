import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInput from '../../utils/input/TextInput';
import capitalizeFirstLetter from '../../utils/functions/capitalizeFirstLetter';
import {
  addNewIngredient,
  closeAddIngredientPanel
} from './ingredientActions';

class AddIngredientPanel extends Component {
  state = {
    newIngredient: {
      displayName: '',
      cup: '',
      whole: ''
    },
    errors: {}
  };

  componentDidMount() {
    if (this.props.selectedIngredient) {
      console.log(
        'this.props.selectedIngredient: ',
        this.props.selectedIngredient
      );
      this.setState(prevState => ({
        newIngredient: {
          ...prevState.newIngredient,
          displayName: this.props.selectedIngredient.displayName
        }
      }));
      document.getElementById('add-ingredient-name').focus();
    }
  }

  componentDidUpdate(prevProps) {
    // console.log('componentDidUpdate: prevProps', prevProps);
    // console.log('componentDidUpdate: this.props', this.props);
    // console.log('componentDidUpdate: state', state);

    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  handleIngredientChange = e => {
    console.log('name: ', e.target);
    let input = e.target.value;
    if (e.target.name === 'displayName') {
      input = capitalizeFirstLetter(e.target.value);
    }

    e.persist();
    this.setState(prevState => ({
      newIngredient: {
        ...prevState.newIngredient,
        [e.target.name]: input
      }
    }));
  };

  handleCancelAddIngredient = e => {
    e.preventDefault();
    this.props.closeAddIngredientPanel(true);
  };

  handleAddIngredient = e => {
    e.preventDefault();
    console.log(this.state.newIngredient);
    this.props.addNewIngredient(this.state.newIngredient);
  };

  render() {
    const { newIngredient, errors } = this.state;
    let content = null;
    if (newIngredient === null) {
      content = '<p>Loading</p>';
    } else {
      content = (
        <form>
          <TextInput
            label="Ingredient Name"
            name="displayName"
            value={newIngredient.displayName}
            onChange={this.handleIngredientChange}
            id="add-ingredient-name"
            error={errors.displayName}
          />
          <hr />
          <h3>Ingredient Metrics</h3>
          <p>Ingredeint in metric grams</p>
          <TextInput
            label="Cup"
            name="cup"
            value={newIngredient.cup}
            onChange={this.handleIngredientChange}
            error={errors.cup}
          />
          <TextInput
            label="Whole"
            name="whole"
            value={newIngredient.whole}
            onChange={this.handleIngredientChange}
            error={errors.whole}
          />
          <ul className="supplier_buttons">
            <li>
              <button
                type="submit"
                onClick={this.handleCancelAddIngredient}
              >
                cancel
              </button>
            </li>
            <li>
              <button
                type="submit"
                onClick={this.handleAddIngredient}
              >
                + Add Ingredient
              </button>
            </li>
          </ul>
        </form>
      );
    }

    return (
      <section className="side_panel">
        <section
          className="cover"
          onClick={this.handleCancelAddIngredient}
        />
        <section className="panel">
          <h1>Add New Ingredient</h1>
          {content}
        </section>
      </section>
    );
  }
}

const mapState = state => ({
  selectedIngredient: state.ingredient.selectedIngredient,
  errors: state.errors
});

const actions = {
  closeAddIngredientPanel,
  addNewIngredient
};

AddIngredientPanel.propTypes = {
  selectedIngredient: PropTypes.object,
  closeAddIngredientPanel: PropTypes.func.isRequired,
  addNewIngredient: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(AddIngredientPanel);
