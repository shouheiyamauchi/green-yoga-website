import React from 'react';
import PropTypes from 'prop-types';
import Auth from '../modules/Auth';


class LogoutFunction extends React.Component {

  componentDidMount() {
    // deauthenticate user, remove details from local storage
    Auth.deauthenticateUser();
    Auth.removeUser();
    // change the current URL to / after logout
    this.props.history.push('/');
  }

  render() {
    return (
      <div>
        <p>Logging out...</p>
      </div>
    )
  }
}

LogoutFunction.contextTypes = {
  router: PropTypes.object.isRequired
};

export default LogoutFunction;
