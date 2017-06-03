import { Component } from 'react';
import Auth from '../../modules/Auth';

class LogoutFunction extends Component {
  componentDidMount() {
    // deauthenticate user, remove details from local storage
    Auth.deauthenticateUser();
    Auth.removeUser();
    // change the current URL to / after logout
    this.props.history.push('/');
  }

  render() {
    return (
      null
    )
  }
}

export default LogoutFunction;
