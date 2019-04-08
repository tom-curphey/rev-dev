import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { registerUser } from '../authActions';
import TextInput from '../../../utils/input/TextInput';

class Register extends Component {
  state = {
    name: '',
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
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordMatch: this.state.passwordMatch
    };
    console.log(newUser);

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const {
      name,
      email,
      password,
      passwordMatch,
      errors
    } = this.state;

    return (
      <section className="register">
        <h1>Register</h1>
        <form action="post">
          <TextInput
            info="Please provide your fullname"
            name="name"
            type="text"
            value={name}
            onChange={this.handleOnChange}
            label="Name"
            error={errors.name}
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
