import React, { Component } from 'react';
import Auth from '../../modules/Auth';

class HomePage extends Component {
  componentDidMount() {
    // update authenticated state on logout
    this.props.toggleAuthenticateStatus()
  }

  render() {
    return (
      <div>
        <div className="section"></div>
        <h4>Home Page</h4>
        <h6>Welcome to my home page. Here I will display information about myself.</h6>
        <div className="section"></div>
        <div className="card">
          <div className="section"></div>
          {Auth.isUserAuthenticated() ? (
            <p className="message center-align">Welcome! You are logged in.</p>
          ) : (
            <p className="message center-align">You are not logged in.</p>
          )}
          <div className="section"></div>
        </div>
      </div>
    )
  }
};

export default HomePage;
