import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';

const Dashboard = ({ secretData, user, test }) => (
  <div>
    <h4>Dashboard</h4>
    <h6>You should get access to this page only after authentication.</h6>
    <p>Welcome <strong>{user.firstName} {user.lastName}</strong> ({user.role})!<br />{secretData}</p>
  </div>
);

Dashboard.propTypes = {
  secretData: PropTypes.string.isRequired
};

export default Dashboard;
