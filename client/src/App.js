import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {
  setCurrentUser,
  logoutUser
} from './features/auth/authActions';
import { clearCurrentVenue } from './features/venue/venueActions';
import { Provider } from 'react-redux';
import store from './redux/store';
import PrivateRoute from './utils/PrivateRoute';

import Navbar from './features/nav/Navbar';
import Home from './features/home/Home';
import Login from './features/auth/login/Login';
import Register from './features/auth/register/Register';
import Dashboard from './features/dashboard/Dashboard';
import Test from './features/test/Test';
import TestSelect from './features/test/TestSelect';
import Password from './features/password/Password';
import AddVenue from './features/venue/AddVenue';
import EditVenue from './features/venue/EditVenue';
import AddRecipe from './features/recipe/AddRecipe';
import Recipes from './features/recipe/Recipes';
import Ingredient from './features/ingredient/Ingredient';

import './App.css';

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user data
  const decodedData = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decodedData));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decodedData.exp < currentTime) {
    store.dispatch(logoutUser());
    // TODO: Clear current venue
    store.dispatch(clearCurrentVenue());
    // Redirect to Login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/test" component={TestSelect} />
            <Switch>
              <PrivateRoute
                exact
                path="/dashboard"
                component={Dashboard}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/add-venue"
                component={AddVenue}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/edit-venue"
                component={EditVenue}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/add-recipe"
                component={AddRecipe}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/recipes"
                component={Recipes}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/ingredient"
                component={Ingredient}
              />
            </Switch>
            <Route exact path="/crud" component={Test} />
            <Route exact path="/passwords" component={Password} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
