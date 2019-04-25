import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../authActions';
import TextInput from '../../../utils/input/TextInput';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  componentDidUpdate(prevProps, state) {
    // console.log('componentDidUpdate: prevProps', prevProps);
    // console.log('componentDidUpdate: this.props', this.props);
    // console.log('componentDidUpdate: state', state);

    if (
      prevProps.auth.isAuthenticated !==
      this.props.auth.isAuthenticated
    ) {
      this.props.history.push('/dashboard');
    }

    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   console.log(nextProps);

  //   if (nextProps.auth.isAuthenticated) {
  //     this.props.history.push('/dashboard');
  //   }
  //   if (nextProps) {
  //     this.setState({ errors: nextProps.errors });
  //   }
  // }

  handleOnChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOnSubmit = e => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData);
  };

  render() {
    const { email, password, errors } = this.state;
    return (
      <section className="login">
        <h1>Login</h1>
        <form action="post">
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
          <button onClick={this.handleOnSubmit} type="submit">
            Login
          </button>
        </form>
      </section>
    );
  }
}

const actions = {
  loginUser
};

const mapState = state => ({
  auth: state.auth,
  errors: state.errors
});

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

export default connect(
  mapState,
  actions
)(Login);
