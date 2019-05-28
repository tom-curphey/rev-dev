import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextInput from '../../utils/input/TextInput';
import SelectInput from '../../utils/input/SelectInput';
import { addOrEditVenue } from './venueActions';
import {
  calcCostToSeconds,
  calcCostPerSecondToCostPerUnit,
  roundNumber
} from '../../utils/utilityFunctions';

class AddVenue extends Component {
  state = {
    displayName: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    chefCost: '',
    chefUnitCost: 'hour',
    rentCost: '',
    rentUnitCost: 'month',
    waterCost: '',
    waterUnitCost: 'year',
    powerCost: '',
    powerUnitCost: 'year',
    insuranceCost: '',
    insuranceUnitCost: 'year',
    councilCost: '',
    councilUnitCost: 'year',
    weeksOpenPerYear: '',
    errors: {},
    displayAdvanced: true
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  handleOnChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCostChange = e => {
    let value = e.target.value;
    if (value !== '') {
      if (!isNaN(value)) {
        let checkDecimal = value.search(/\./);
        console.log('checkDecimal: ', checkDecimal);
        if (checkDecimal !== -1) {
          value = e.target.value;
        }
        this.setState({ [e.target.name]: value });
      }
    } else {
      this.setState({ [e.target.name]: value });
    }

    console.log('Vlaue', value);
  };

  handleOnSubmit = e => {
    e.preventDefault();

    const venueData = {
      displayName: this.state.displayName,
      email: this.state.email,
      phone: this.state.phone,
      address: this.state.address,
      website: this.state.website,
      chefCost: calcCostToSeconds(
        this.state.chefCost,
        this.state.chefUnitCost
      ),
      chefUnitCost: this.state.chefUnitCost,
      rentCost: calcCostToSeconds(
        this.state.rentCost,
        this.state.rentUnitCost
      ),
      rentUnitCost: this.state.rentUnitCost,
      waterCost: calcCostToSeconds(
        this.state.waterCost,
        this.state.waterUnitCost
      ),
      waterUnitCost: this.state.waterUnitCost,
      powerCost: calcCostToSeconds(
        this.state.powerCost,
        this.state.powerUnitCost
      ),
      powerUnitCost: this.state.powerUnitCost,
      insuranceCost: calcCostToSeconds(
        this.state.insuranceCost,
        this.state.insuranceUnitCost
      ),
      insuranceUnitCost: this.state.insuranceUnitCost,
      councilCost: calcCostToSeconds(
        this.state.councilCost,
        this.state.councilUnitCost
      ),
      councilUnitCost: this.state.councilUnitCost,
      weeksOpenPerYear: this.state.weeksOpenPerYear
    };

    // console.log('venueData: ', venueData);

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
      weeksOpenPerYear,
      errors,
      displayAdvanced
    } = this.state;

    const timeOptions = [
      { label: 'Year', value: 'year' },
      { label: 'Month', value: 'month' },
      { label: 'Week', value: 'week' },
      { label: 'Day', value: 'day' },
      { label: 'Hour', value: 'hour' }
    ];

    let advancedInputs;
    if (displayAdvanced) {
      advancedInputs = (
        <React.Fragment>
          <TextInput
            name="chefCost"
            type="chefCost"
            value={chefCost}
            onChange={this.handleCostChange}
            label="Chef Cost per hour"
            error={errors.chefCost}
          />
          <div className="textSelectWrapper">
            <TextInput
              name="rentCost"
              type="rentCost"
              value={rentCost.toString()}
              onChange={this.handleCostChange}
              label="Rent Cost"
              error={errors.rentCost}
              labelClass="textSelect"
            />
            <SelectInput
              name="rentUnitCost"
              value={rentUnitCost}
              options={timeOptions}
              onChange={this.handleOnChange}
              labelClass="textSelectSelect"
            />
          </div>
          <div className="textSelectWrapper">
            <TextInput
              name="waterCost"
              type="waterCost"
              value={roundNumber(waterCost, 2).toString()}
              onChange={this.handleOnChange}
              label="Water Cost"
              error={errors.waterCost}
              labelClass="textSelect"
            />
            <SelectInput
              name="waterUnitCost"
              value={waterUnitCost}
              options={timeOptions}
              onChange={this.handleOnChange}
              labelClass="textSelectSelect"
            />
          </div>
          <div className="textSelectWrapper">
            <TextInput
              name="powerCost"
              type="powerCost"
              value={roundNumber(powerCost, 2).toString()}
              onChange={this.handleOnChange}
              label="Electricity Cost"
              error={errors.powerCost}
              labelClass="textSelect"
            />
            <SelectInput
              name="powerUnitCost"
              value={powerUnitCost}
              options={timeOptions}
              onChange={this.handleOnChange}
              labelClass="textSelectSelect"
            />
          </div>
          <div className="textSelectWrapper">
            <TextInput
              name="insuranceCost"
              type="insuranceCost"
              value={roundNumber(insuranceCost, 2).toString()}
              onChange={this.handleOnChange}
              label="Insurance Cost"
              error={errors.insuranceCost}
              labelClass="textSelect"
            />
            <SelectInput
              name="insuranceUnitCost"
              value={insuranceUnitCost}
              options={timeOptions}
              onChange={this.handleOnChange}
              labelClass="textSelectSelect"
            />
          </div>
          <div className="textSelectWrapper">
            <TextInput
              name="councilCost"
              type="councilCost"
              value={roundNumber(councilCost, 2).toString()}
              onChange={this.handleOnChange}
              label="Council Cost"
              error={errors.councilCost}
              labelClass="textSelect"
            />
            <SelectInput
              name="councilUnitCost"
              value={councilUnitCost}
              options={timeOptions}
              onChange={this.handleOnChange}
              labelClass="textSelectSelect"
            />
          </div>
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
          <TextInput
            name="weeksOpenPerYear"
            type="weeksOpenPerYear"
            value={weeksOpenPerYear}
            onChange={this.handleCostChange}
            label="Weeks open per year"
            error={errors.weeksOpenPerYear}
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
