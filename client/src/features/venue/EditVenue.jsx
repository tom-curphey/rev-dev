import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextInput from '../../utils/input/TextInput';
import SelectInput from '../../utils/input/SelectInput';
import { addOrEditVenue, getCurrentVenue } from './venueActions';
import isEmpty from '../../utils/validation/is.empty';
import Spinner from '../../utils/spinner/Spinner';
import {
  calcCostToSeconds,
  calcCostPerSecondToCostPerUnit,
  roundNumber
} from '../../utils/utilityFunctions';

class EditVenue extends Component {
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
    waterUnitCost: 'month',
    powerCost: '',
    powerUnitCost: 'month',
    insuranceCost: '',
    insuranceUnitCost: 'year',
    councilCost: '',
    councilUnitCost: 'year',
    weeksOpenPerYear: '',
    errors: {},
    displayAdvanced: true
  };

  componentDidMount() {
    this.props.getCurrentVenue();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }

    if (prevProps.venue.venue !== this.props.venue.venue) {
      const venue = { ...this.props.venue.venue };
      console.log('VENUE', venue);

      // Check if any fields are empty
      // If so make them an empty string
      venue.displayName = !isEmpty(venue.displayName)
        ? venue.displayName
        : '';
      venue.email = !isEmpty(venue.email) ? venue.email : '';
      venue.phone = !isEmpty(venue.phone) ? venue.phone : '';
      venue.address = !isEmpty(venue.address) ? venue.address : '';
      venue.website = !isEmpty(venue.website) ? venue.website : '';
      if (venue.costs) {
        venue.chefCost =
          !isEmpty(venue.costs.chefCost) || venue.costs.chefCost === 0
            ? calcCostPerSecondToCostPerUnit(
                venue.costs.chefCost,
                venue.costs.chefUnitCost
              ).toString()
            : '';
        venue.chefUnitCost = !isEmpty(venue.costs.chefUnitCost)
          ? venue.costs.chefUnitCost.toString()
          : '';
        venue.rentCost = !isEmpty(venue.costs.rentCost)
          ? calcCostPerSecondToCostPerUnit(
              venue.costs.rentCost,
              venue.costs.rentUnitCost
            ).toString()
          : '';
        venue.rentUnitCost = !isEmpty(venue.costs.rentUnitCost)
          ? venue.costs.rentUnitCost.toString()
          : '';
        venue.waterCost = !isEmpty(venue.costs.waterCost)
          ? calcCostPerSecondToCostPerUnit(
              venue.costs.waterCost,
              venue.costs.waterUnitCost
            ).toString()
          : '';
        venue.waterUnitCost = !isEmpty(venue.costs.waterUnitCost)
          ? venue.costs.waterUnitCost.toString()
          : '';
        venue.powerCost = !isEmpty(venue.costs.powerCost)
          ? calcCostPerSecondToCostPerUnit(
              venue.costs.powerCost,
              venue.costs.powerUnitCost
            ).toString()
          : '';
        venue.powerUnitCost = !isEmpty(venue.costs.powerUnitCost)
          ? venue.costs.powerUnitCost.toString()
          : '';
        venue.insuranceCost = !isEmpty(venue.costs.insuranceCost)
          ? calcCostPerSecondToCostPerUnit(
              venue.costs.insuranceCost,
              venue.costs.insuranceUnitCost
            ).toString()
          : '';
        venue.insuranceUnitCost = !isEmpty(
          venue.costs.insuranceUnitCost
        )
          ? venue.costs.insuranceUnitCost.toString()
          : '';
        venue.councilCost = !isEmpty(venue.costs.councilCost)
          ? calcCostPerSecondToCostPerUnit(
              venue.costs.councilCost,
              venue.costs.councilUnitCost
            ).toString()
          : '';
        venue.councilUnitCost = !isEmpty(venue.costs.councilUnitCost)
          ? venue.costs.councilUnitCost.toString()
          : '';
        venue.weeksOpenPerYear = !isEmpty(venue.weeksOpenPerYear)
          ? venue.weeksOpenPerYear.toString()
          : '';
      } else {
        venue.chefCost = '';
        venue.chefUnitCost = '';
        venue.rentCost = '';
        venue.rentUnitCost = '';
        venue.waterCost = '';
        venue.waterUnitCost = '';
        venue.powerCost = '';
        venue.powerUnitCost = '';
        venue.insuranceCost = '';
        venue.insuranceUnitCost = '';
        venue.councilCost = '';
        venue.councilUnitCost = '';
        venue.weeksOpenPerYear = '';
      }

      this.setState({
        displayName: venue.displayName,
        email: venue.email,
        phone: venue.phone,
        address: venue.address,
        website: venue.website,
        chefCost: venue.chefCost,
        chefUnitCost: venue.chefUnitCost,
        rentCost: venue.rentCost,
        rentUnitCost: venue.rentUnitCost,
        waterCost: venue.waterCost,
        waterUnitCost: venue.waterUnitCost,
        powerCost: venue.powerCost,
        powerUnitCost: venue.powerUnitCost,
        insuranceCost: venue.insuranceCost,
        insuranceUnitCost: venue.insuranceUnitCost,
        councilCost: venue.councilCost,
        councilUnitCost: venue.councilUnitCost,
        weeksOpenPerYear: venue.weeksOpenPerYear,
        displayAdvanced: true
      });
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

    console.log('STATE: ', this.state);

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

    console.log(venueData);

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
    const { venue, loading } = this.props.venue;

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

    let VenueForm = (
      <form onSubmit={this.handleOnSubmit}>
        <TextInput
          placeholder="Please provide your Venue Name"
          name="displayName"
          type="text"
          value={displayName}
          onChange={this.handleOnChange}
          label="Venue Name"
          error={errors.displayName}
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
          type="text"
          value={address}
          onChange={this.handleOnChange}
          label="Venue Address"
          error={errors.address}
        />
        <TextInput
          name="website"
          type="text"
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
        <button onClick={this.handleOnSubmit} type="button">
          Edit Venue
        </button>
      </form>
    );

    let dashboardContent;
    if (venue === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      dashboardContent = VenueForm;
    }

    return (
      <section className="venue">
        <h1>Edit Venue</h1>
        {dashboardContent}
      </section>
    );
  }
}

const actions = {
  addOrEditVenue,
  getCurrentVenue
};

const mapState = state => ({
  venue: state.venue,
  errors: state.errors
});

EditVenue.propTypes = {
  venue: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  addOrEditVenue: PropTypes.func.isRequired,
  getCurrentVenue: PropTypes.func.isRequired
};

export default connect(
  mapState,
  actions
)(withRouter(EditVenue));
