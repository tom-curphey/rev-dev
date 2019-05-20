import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextInput from '../../utils/input/TextInput';
import { addOrEditVenue, getCurrentVenue } from './venueActions';
import isEmpty from '../../utils/validation/is.empty';
import Spinner from '../../utils/spinner/Spinner';

class EditVenue extends Component {
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

  componentDidMount() {
    this.props.getCurrentVenue();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
    // console.log('nextProps.errors: ', nextProps.errors);
    // console.log('State Check: ', this.state);
    const errorCheck = isEmpty(nextProps.errors);
    // console.log('errorOutsideCheck: ', errorCheck);

    if (nextProps.venue.venue && errorCheck) {
      const venue = { ...nextProps.venue.venue };
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
        venue.chefCost = !isEmpty(venue.costs.chefCost)
          ? venue.costs.chefCost.toString()
          : '';
        venue.chefUnitCost = !isEmpty(venue.costs.chefUnitCost)
          ? venue.costs.chefUnitCost.toString()
          : '';
        venue.rentCost = !isEmpty(venue.costs.rentCost)
          ? venue.costs.rentCost.toString()
          : '';
        venue.rentUnitCost = !isEmpty(venue.costs.rentUnitCost)
          ? venue.costs.rentUnitCost.toString()
          : '';
        venue.waterCost = !isEmpty(venue.costs.waterCost)
          ? venue.costs.waterCost.toString()
          : '';
        venue.waterUnitCost = !isEmpty(venue.costs.waterUnitCost)
          ? venue.costs.waterUnitCost.toString()
          : '';
        venue.powerCost = !isEmpty(venue.costs.powerCost)
          ? venue.costs.powerCost.toString()
          : '';
        venue.powerUnitCost = !isEmpty(venue.costs.powerUnitCost)
          ? venue.costs.powerUnitCost.toString()
          : '';
        venue.insuranceCost = !isEmpty(venue.costs.insuranceCost)
          ? venue.costs.insuranceCost.toString()
          : '';
        venue.insuranceUnitCost = !isEmpty(
          venue.costs.insuranceUnitCost
        )
          ? venue.costs.insuranceUnitCost.toString()
          : '';
        venue.councilCost = !isEmpty(venue.costs.councilCost)
          ? venue.costs.councilCost.toString()
          : '';
        venue.councilUnitCost = !isEmpty(venue.costs.councilUnitCost)
          ? venue.costs.councilUnitCost.toString()
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
        councilUnitCost: venue.councilUnitCost
      });
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
    const { venue, loading } = this.props.venue;

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

    let VenueForm = (
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
