import React, { Component } from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Auth from '../../modules/Auth';

class HomePage extends Component {
  componentDidMount() {
    // update authenticated state on logout
    this.props.toggleAuthenticateStatus()
  }

  render() {
    return (
      <div>
        <Card className="container">
          <CardTitle title="React Application" subtitle="This is the home page." />
            {Auth.isUserAuthenticated() ? (
              <CardText style={{ fontSize: '16px', color: 'green' }}>Welcome! You are logged in.</CardText>
            ) : (
              <CardText style={{ fontSize: '16px', color: 'green' }}>You are not logged in.</CardText>
            )}
        </Card>
      </div>
    )
  }
};

export default HomePage;
