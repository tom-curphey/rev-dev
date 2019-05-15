import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from '../auth/authActions';
import { clearCurrentVenue } from '../venue/venueActions';

class Navbar extends Component {
  handleLogout = e => {
    e.preventDefault();
    this.props.clearCurrentVenue();
    this.props.logoutUser();
  };

  render() {
    const { isAuthenticated } = this.props.auth;
    const { profile } = this.props.profile;

    // console.log('PROFILE: ', profile);

    const authLinks = (
      <section className="navbar">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/crud">Crud</Link>
        <Link to="/passwords">Passwords</Link>
        <a href="!#" onClick={this.handleLogout}>
          Logout {profile.firstName}
        </a>
      </section>
    );

    const guestLinks = (
      <section className="navbar">
        <Link to="/">Home</Link>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </section>
    );

    return <div>{isAuthenticated ? authLinks : guestLinks}</div>;
  }
}

const actions = {
  logoutUser,
  clearCurrentVenue
};

const mapState = state => ({
  auth: state.auth,
  profile: state.profile
});

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  clearCurrentVenue: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(Navbar);
