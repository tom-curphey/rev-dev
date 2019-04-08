import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCurrentVenue } from './venueActions';

class VenueDetails extends Component {
  componentDidMount() {
    this.props.getCurrentVenue();
  }

  render() {
    return (
      <div>
        <h3>Venue</h3>
      </div>
    );
  }
}

const actions = {
  getCurrentVenue
};

VenueDetails.propTypes = {
  getCurrentVenue: PropTypes.func.isRequired
};

export default connect(
  null,
  actions
)(VenueDetails);
