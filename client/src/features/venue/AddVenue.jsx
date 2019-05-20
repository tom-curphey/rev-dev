import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextInput from '../../utils/input/TextInput';
import { addOrEditVenue } from './venueActions';

class AddVenue extends Component {
  state = {
    displayName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    chefCost: '',
    chefUnitCost: '',
    rentCost: '',
    rentUnitCost: '',
    waterCost: '',
    waterUnitCost: '',
    powerCost: '',
    powerUnitCost: '',
    insuranceCost: '',
    insuranceUnitCost: '',
    councilCost: '',
    councilUnitCost: '',
    errors: {},
    displayAdvanced: false
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  handleOnChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOnSubmit = e => {
    e.preventDefault();

    const venueData = {
      displayName: this.state.displayName,
      email: this.state.email,
      phone: this.state.phone,
      address: this.state.address,
      website: this.state.website,
      chefCost: this.state.chefCost,
      chefUnitCost: this.state.chefUnitCost,
      rentCost: this.state.rentCost,
      rentUnitCost: this.state.rentUnitCost,
      waterCost: this.state.waterCost,
      waterUnitCost: this.state.waterUnitCost,
      powerCost: this.state.powerCost,
      powerUnitCost: this.state.powerUnitCost,
      insuranceCost: this.state.insuranceCost,
      insuranceUnitCost: this.state.insuranceUnitCost,
      councilCost: this.state.councilCost,
      councilUnitCost: this.state.councilUnitCost
    };

    console.log('venueData: ', venueData);

    // This.props.history uses withRouter to push history into the actions files
    this.props.addOrEditVenue(venueData, this.props.history);
  };

  render() {
    const {
      displayName,
      email,
      phone,
      address,
      website,
      chefCost,
      chefUnitCost,
      rentCost,
      rentUnitCost,
      waterCost,
      waterUnitCost,
      powerCost,
      powerUnitCost,
      insuranceCost,
      insuranceUnitCost,
      councilCost,
      councilUnitCost,
      errors,
      displayAdvanced
    } = this.state;

    let advancedInputs;

    if (displayAdvanced) {
      advancedInputs = (
        <React.Fragment>
          <TextInput
            name="chefCost"
            type="chefCost"
            value={chefCost}
            onChange={this.handleOnChange}
            label="Chef Cost"
            error={errors.chefCost}
          />
          <TextInput
            name="rentCost"
            type="rentCost"
            value={rentCost}
            onChange={this.handleOnChange}
            label="Rent Cost"
            error={errors.rentCost}
          />
          <TextInput
            name="waterCost"
            type="waterCost"
            value={waterCost}
            onChange={this.handleOnChange}
            label="Water Cost"
            error={errors.waterCost}
          />
          <TextInput
            name="powerCost"
            type="powerCost"
            value={powerCost}
            onChange={this.handleOnChange}
            label="Electricity Cost"
            error={errors.powerCost}
          />
          <TextInput
            name="insuranceCost"
            type="insuranceCost"
            value={insuranceCost}
            onChange={this.handleOnChange}
            label="Insurance Cost"
            error={errors.insuranceCost}
          />
          <TextInput
            name="councilCost"
            type="councilCost"
            value={councilCost}
            onChange={this.handleOnChange}
            label="Council Cost"
            error={errors.councilCost}
          />
        </React.Fragment>
      );
    }
    return (
      <section className="venue">
        <h1>Add Venue</h1>
        <hr />
        <form onSubmit={this.handleOnSubmit}>
          <TextInput
            placeholder="Please provide your Venue Name"
            name="displayName"
            type="text"
            value={displayName}
            onChange={this.handleOnChange}
            label="Venue Name"
            error={errors.name}
          />
          <TextInput
            name="email"
            type="email"
            value={email}
            onChange={this.handleOnChange}
            label="Venue Email"
            error={errors.email}
          />
          <TextInput
            name="phone"
            type="phone"
            value={phone}
            onChange={this.handleOnChange}
            label="Venue Phone"
            error={errors.phone}
          />
          <TextInput
            name="address"
            type="address"
            value={address}
            onChange={this.handleOnChange}
            label="Venue Address"
            error={errors.address}
          />
          <TextInput
            name="website"
            type="website"
            value={website}
            onChange={this.handleOnChange}
            label="Venue Website"
            error={errors.website}
          />
          <button
            onClick={() => {
              this.setState(prevState => ({
                displayAdvanced: !prevState.displayAdvanced
              }));
            }}
            type="button"
          >
            Advanced Options
          </button>
          <small>Optional</small>

          {advancedInputs}
        </form>
        <button onClick={this.handleOnSubmit} type="button">
          + Add Venue
        </button>
      </section>
    );
  }
}

const actions = {
  addOrEditVenue
};

const mapState = state => ({
  venue: state.venue,
  errors: state.errors
});

AddVenue.propTypes = {
  venue: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addOrEditVenue: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(withRouter(AddVenue));
