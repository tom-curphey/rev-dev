import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../authActions';
import TextInput from '../../../utils/input/TextInput';

class Register extends Component {
  state = {
    firstName: '',
    lastName: '',
    position: '',
    mobile: '',
    email: '',
    password: '',
    passwordMatch: '',
    errors: {}
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

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

    const newUser = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      email: this.state.email,
      mobile: this.state.mobile,
      position: this.state.position,
      password: this.state.password,
      passwordMatch: this.state.passwordMatch
    };
    console.log(newUser);

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      mobile,
      position,
      password,
      passwordMatch,
      errors
    } = this.state;

    return (
      <section className="register">
        <h1>Register</h1>
        <form action="post">
          <TextInput
            placeholder="Please provide your fullname"
            name="firstName"
            type="text"
            value={firstName}
            onChange={this.handleOnChange}
            label="First Name"
            error={errors.firstName}
          />
          <TextInput
            placeholder="Please provide your fullname"
            // info="Please provide your fullname"
            name="lastName"
            type="text"
            value={lastName}
            onChange={this.handleOnChange}
            label="Last Name"
            error={errors.lastName}
          />
          <TextInput
            placeholder="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={this.handleOnChange}
            label="Email"
            error={errors.email}
          />
          <TextInput
            placeholder="To verify your account"
            name="mobile"
            value={mobile}
            onChange={this.handleOnChange}
            label="Mobile"
            error={errors.mobile}
          />
          <TextInput
            placeholder="Chef, Manager, Venue Owner"
            name="position"
            value={position}
            onChange={this.handleOnChange}
            label="Job Position"
            error={errors.position}
          />
          <TextInput
            placeholder="Password"
            name="password"
            type="password"
            value={password}
            onChange={this.handleOnChange}
            label="Password"
            error={errors.password}
          />
          <TextInput
            placeholder="Match Password"
            name="passwordMatch"
            type="password"
            value={passwordMatch}
            onChange={this.handleOnChange}
            label="Password Match"
            error={errors.passwordMatch}
          />
          <button onClick={this.handleOnSubmit} type="submit">
            Register
          </button>
        </form>
      </section>
    );
  }
}

const actions = {
  registerUser
};

const mapState = state => ({
  auth: state.auth,
  errors: state.errors
});

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(withRouter(Register));
