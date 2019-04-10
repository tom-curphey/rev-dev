import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getCurrentVenue, deleteVenue } from '../venue/venueActions';
import { reactivateUser } from '../auth/authActions';
import { getUserProfile } from '../profile/profileActions';
import Spinner from '../../utils/spinner/Spinner';

class Dashboard extends Component {
  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
    this.props.getCurrentVenue();
    this.props.getUserProfile();
  }

  handleDeleteVenue = () => {
    this.props.deleteVenue();
  };
  handleReactivate = () => {
    this.props.reactivateUser();
  };

  render() {
    const {
      profile: { profile },
      auth: { user }
    } = this.props;
    const { venue, loading } = this.props.venue;

    let dashboardContent;

    if (venue === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      // Check if user has venue data
      // This gets the keys of an object
      // then we are checking if there are any keys
      if (Object.keys(venue).length > 0) {
        dashboardContent = (
          <div>
            <h1>Welcome {user.name}</h1>
            <Link to="/edit-venue">Edit Venue</Link>
            <Link to="/add-recipe">Add Recipe</Link>
            <Link to="/ingredient">Ingredients</Link>
            <button onClick={this.handleDeleteVenue}>
              Delete Account
            </button>
          </div>
        );
      } else {
        // console.log(profile.profile.firstName);
        console.log(profile.firstName);

        if (!profile.active) {
          dashboardContent = (
            <div>
              <h1>Welcome back {profile.firstName}</h1>
              <p>Would you like to reactive the account?</p>
              <button onClick={this.handleReactivate}>
                + Reactivate Account
              </button>
            </div>
          );
        } else {
          // User is logged in but has no venue
          dashboardContent = (
            <div>
              <h1>Hi {profile.firstName}</h1>
              <p>
                First we need to know what venue you are optimising
                your recipes for..
              </p>
              <Link to="/add-venue">+ Add Venue</Link>
              <Link to="/add-recipe">Add Recipe</Link>
            </div>
          );
        }
      }
    }

    return (
      <section className="dashboard">{dashboardContent}</section>
    );
  }
}

const actions = {
  getCurrentVenue,
  getUserProfile,
  deleteVenue,
  reactivateUser
};

const mapState = state => ({
  auth: state.auth,
  venue: state.venue,
  profile: state.profile
});

Dashboard.propTypes = {
  getCurrentVenue: PropTypes.func.isRequired,
  deleteVenue: PropTypes.func.isRequired,
  reactivateUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,

  venue: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(Dashboard);
