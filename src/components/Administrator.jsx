import React from 'react';
import { Card, CardTitle, CardText } from 'material-ui/Card';
import Auth from '../modules/Auth';

class Administrator extends React.Component {
  render() {
    return (
      <Card className="container">
        <CardTitle title="React Application" subtitle="This is the home page." />
        <CardText style={{ fontSize: '16px', color: 'green' }}>You're logged in as an administrator.</CardText>
      </Card>
    )
  }
};

export default Administrator;
