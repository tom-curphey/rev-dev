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
      const venue = nextProps.venue.venue;
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
        venue.chefPayPerHour = !isEmpty(venue.costs.chefPayPerHour)
          ? venue.costs.chefPayPerHour
          : '';
        venue.rentPerMonth = !isEmpty(venue.costs.rentPerMonth)
          ? venue.costs.rentPerMonth
          : '';
        venue.waterPerMonth = !isEmpty(venue.costs.waterPerMonth)
          ? venue.costs.waterPerMonth
          : '';
        venue.powerPerMonth = !isEmpty(venue.costs.powerPerMonth)
          ? venue.costs.powerPerMonth
          : '';
        venue.insurancePerYear = !isEmpty(
          venue.costs.insurancePerYear
        )
          ? venue.costs.insurancePerYear
          : '';
      } else {
        venue.chefPayPerHour = '';
        venue.rentPerMonth = '';
        venue.waterPerMonth = '';
        venue.powerPerMonth = '';
        venue.insurancePerYear = '';
      }

      this.setState({
        name: venue.displayName,
        email: venue.email,
        phone: venue.phone,
        address: venue.address,
        website: venue.website,
        chefPayPerHour: venue.chefPayPerHour.toString(),
        rentPerMonth: venue.rentPerMonth.toString(),
        waterPerMonth: venue.waterPerMonth.toString(),
        powerPerMonth: venue.powerPerMonth.toString(),
        insurancePerYear: venue.insurancePerYear.toString()
      });
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
    const { venue, loading } = this.props.venue;

    let advancedInputs;
    if (displayAdvanced) {
      advancedInputs = (
        <React.Fragment>
          <TextInput
            name="chefPayPerHour"
            type="number"
            value={`${chefPayPerHour}`}
            onChange={this.handleOnChange}
            label="Cost of chef per hour"
            error={errors.chefPayPerHour}
          />
          <TextInput
            name="rentPerMonth"
            type="number"
            value={`${rentPerMonth}`}
            onChange={this.handleOnChange}
            label="Cost of rent per month"
            error={errors.rentPerMonth}
          />
          <TextInput
            name="waterPerMonth"
            type="number"
            value={`${waterPerMonth}`}
            onChange={this.handleOnChange}
            label="Cost of water per month"
            error={errors.waterPerMonth}
          />
          <TextInput
            name="powerPerMonth"
            type="number"
            value={`${powerPerMonth}`}
            onChange={this.handleOnChange}
            label="Cost of electricity per month"
            error={errors.powerPerMonth}
          />
          <TextInput
            name="insurancePerYear"
            type="number"
            value={`${insurancePerYear}`}
            onChange={this.handleOnChange}
            label="Cost of insurance per year"
            error={errors.insurancePerYear}
          />
        </React.Fragment>
      );
    }

    let VenueForm = (
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
