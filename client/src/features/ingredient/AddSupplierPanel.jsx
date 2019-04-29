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
      displayName: '',
      email: '',
      phone: '',
      website: '',
      address: ''
    },
    errors: {}
  };

  componentDidMount() {
    if (this.props.selectedIngredientSupplier) {
      console.log(
        'this.props.selectedIngredientSupplier: ',
        this.props.selectedIngredientSupplier
      );
      this.setState(prevState => ({
        newSupplier: {
          ...prevState.newSupplier,
          displayName: this.props.selectedIngredientSupplier.supplier
            .displayName
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

  handleSupplierChange = e => {
    console.log('name: ', e.target);

    const capInput = capitalizeFirstLetter(e.target.value);
    e.persist();
    this.setState(prevState => ({
      newSupplier: {
        ...prevState.newSupplier,
        [e.target.name]: capInput
      }
    }));
  };

  handleCancelAddSupplier = e => {
    e.preventDefault();
    console.log('Cancel');
    this.props.closeAddSupplierPanel(true);
  };

  handleAddSupplier = e => {
    e.preventDefault();
    this.props.addNewSupplier(
      this.state.newSupplier,
      this.props.selectedIngredient
    );
  };

  render() {
    const { newSupplier, errors } = this.state;
    const { selectedIngredient } = this.props;
    console.log('newSupplier: ', newSupplier);

    let content = null;
    content = (
      <form>
        <TextInput
          label="Supplier Name"
          name="displayName"
          value={newSupplier.displayName}
          onChange={this.handleSupplierChange}
          id="add-ingredient-name"
          error={errors.displayName}
        />
        <TextInput
          label="Email"
          name="email"
          value={newSupplier.email}
          onChange={this.handleSupplierChange}
          error={errors.email}
        />
        <TextInput
          label="Phone"
          name="phone"
          value={newSupplier.phone}
          onChange={this.handleSupplierChange}
          error={errors.phone}
        />
        <TextInput
          label="Website"
          name="website"
          value={newSupplier.website}
          onChange={this.handleSupplierChange}
          error={errors.website}
        />
        <TextInput
          label="Address"
          name="address"
          value={newSupplier.address}
          onChange={this.handleSupplierChange}
          error={errors.address}
        />
        <ul className="supplier_buttons">
          <li>
            <button
              type="submit"
              onClick={this.handleCancelAddSupplier}
            >
              cancel
            </button>
          </li>
          <li>
            <button type="submit" onClick={this.handleAddSupplier}>
              + Add Supplier
            </button>
          </li>
        </ul>
      </form>
    );

    return (
      <section className="side_panel">
        <section
          className="cover"
          onClick={this.handleCancelAddSupplier}
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
  selectedIngredientSupplier:
    state.ingredient.selectedIngredientSupplier,
  selectedIngredient: state.ingredient.selectedIngredient,
  errors: state.errors
});

const actions = {
  addNewSupplier,
  closeAddSupplierPanel
};

AddSupplierPanel.propTypes = {
  selectedIngredientSupplier: PropTypes.object.isRequired,
  selectedIngredient: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(AddSupplierPanel);
