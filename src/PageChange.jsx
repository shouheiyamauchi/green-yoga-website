import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Auth from './modules/Auth';

class PageChange extends Component {
  // functions to run on router page change
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (Auth.getUser() == null) {
        Auth.deauthenticateUser();
      };

      window.scrollTo(0, 0);

      // get current pathname without the slash and set header image
      const path = (window.location.pathname).substring(1,(window.location.pathname).length);
      this.props.setHeaderImage(path);

      // check if user is logged in on refresh
      this.props.toggleAuthenticateStatus();
    }
  }

  render() {
    return this.props.children
  }
}

export default withRouter(PageChange)
