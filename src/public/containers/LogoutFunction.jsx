import { Component } from 'react';
import Auth from '../../modules/Auth';

class LogoutFunction extends Component {
  componentDidMount() {
    // deauthenticate user, remove details from local storage
    Auth.deauthenticateUser();
    Auth.removeUser();

    // set a success message
    localStorage.setItem('user', 'You have been successfully logged out.')

    // redirect to login screen after logout
    this.props.history.push('/login');
  }

  render() {
    return (
      null
    )
  }
}

export default LogoutFunction;
