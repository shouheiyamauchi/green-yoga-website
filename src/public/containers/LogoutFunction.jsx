import { Component } from 'react';
import Auth from '../../modules/Auth';

class LogoutFunction extends Component {
  componentDidMount() {
    // deauthenticate user, remove details from local storage
    Auth.deauthenticateUser();
    Auth.removeUser();
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
