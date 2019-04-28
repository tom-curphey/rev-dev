import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextInput from '../../utils/input/TextInput';
import capitalizeFirstLetter from '../../utils/capitalizeFirstLetter';
import {
  addNewSupplier,
  closeAddSupplierPanel
} from './supplierActions';

class AddSupplierPanel extends Component {
  state = {
    newSupplier: {
      displayName: ''
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

    const capInput = capitalizeFirstLetter(e.target.value);
    e.persist();
    this.setState(prevState => ({
      newIngredient: {
        ...prevState.newIngredient,
        [e.target.name]: capInput
      }
    }));
  };

  handleCancelAddIngredient = e => {
    e.preventDefault();
    console.log('Cancel');
    this.props.closeAddIngredientPanel(true);
  };

  handleAddIngredient = e => {
    e.preventDefault();
    console.log(this.state.newIngredient);
    this.props.addNewIngredient(this.state.newIngredient);
  };

  render() {
    const { newIngredient, errors } = this.state;
    console.log('newIngredient: ', newIngredient);

    let content = null;
    if (newIngredient === null) {
      content = '<p>Loading</p>';
    } else {
      content = (
        <form>
          <TextInput
            label="Supplier Name"
            name="displayName"
            value={newIngredient.displayName}
            onChange={this.handleIngredientChange}
            id="add-ingredient-name"
            error={errors.displayName}
          />
          {/* <hr />
          <h3>Ingredient Metrics</h3>
          <p>Ingredeint in metric grams</p>
          <TextInput
            label="Cup"
            name="cup"
            value={newIngredient.cup}
            onChange={this.handleIngredientChange}
            error={errors.cup}
          /> */}
          <ul className="supplier_buttons">
            <li>
              <button
                type="submit"
                // onClick={this.handleCancelAddIngredient}
              >
                cancel
              </button>
            </li>
            <li>
              <button
                type="submit"
                // onClick={this.handleAddIngredient}
              >
                + Add Supplier
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
          // onClick={this.handleCancelAddIngredient}
        />
        <section className="panel">
          <h1>Add New Supplier</h1>
          {content}
        </section>
      </section>
    );
  }
}

const mapState = state => ({
  // selectedIngredient: state.ingredient.selectedIngredient,
  // errors: state.errors
});

const actions = {};

// AddSuppplierPanel.propTypes = {};

export default connect(
  mapState,
  actions
)(AddSupplierPanel);
