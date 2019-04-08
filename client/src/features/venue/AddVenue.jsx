import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextInput from '../../utils/input/TextInput';
import { addOrEditVenue } from './venueActions';

class AddVenue extends Component {
  state = {
    name: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    chefPayPerHour: '',
    rentPerMonth: '',
    waterPerMonth: '',
    powerPerMonth: '',
    insurancePerYear: '',
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
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      address: this.state.address,
      website: this.state.website,
      chefPayPerHour: this.state.chefPayPerHour,
      rentPerMonth: this.state.rentPerMonth,
      waterPerMonth: this.state.waterPerMonth,
      powerPerMonth: this.state.powerPerMonth,
      insurancePerYear: this.state.insurancePerYear
    };

    console.log(venueData);

    // This.props.history uses withRouter to push history into the actions files
    this.props.addOrEditVenue(venueData, this.props.history);
  };

  render() {
    const {
      name,
      email,
      phone,
      address,
      website,
      chefPayPerHour,
      rentPerMonth,
      waterPerMonth,
      powerPerMonth,
      insurancePerYear,
      errors,
      displayAdvanced
    } = this.state;

    let advancedInputs;

    if (displayAdvanced) {
      advancedInputs = (
        <React.Fragment>
          <TextInput
            name="chefPayPerHour"
            type="chefPayPerHour"
            value={chefPayPerHour}
            onChange={this.handleOnChange}
            label="Cost of chef per hour"
            error={errors.chefPayPerHour}
          />
          <TextInput
            name="rentPerMonth"
            type="rentPerMonth"
            value={rentPerMonth}
            onChange={this.handleOnChange}
            label="Cost of rent per month"
            error={errors.rentPerMonth}
          />
          <TextInput
            name="waterPerMonth"
            type="waterPerMonth"
            value={waterPerMonth}
            onChange={this.handleOnChange}
            label="Cost of water per month"
            error={errors.waterPerMonth}
          />
          <TextInput
            name="powerPerMonth"
            type="powerPerMonth"
            value={powerPerMonth}
            onChange={this.handleOnChange}
            label="Cost of electricity per month"
            error={errors.powerPerMonth}
          />
          <TextInput
            name="insurancePerYear"
            type="insurancePerYear"
            value={insurancePerYear}
            onChange={this.handleOnChange}
            label="Cost of insurance per year"
            error={errors.insurancePerYear}
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
            name="name"
            type="text"
            value={name}
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
