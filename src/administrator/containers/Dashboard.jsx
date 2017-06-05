import React, {Component} from 'react';
import Auth from '../../modules/Auth';
import PropTypes from 'prop-types';
import { Card, CardTitle, CardText } from 'material-ui/Card';

class AdministratorDashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      secretData: ''
    };
  }

  componentDidMount() {
    const xhr = new XMLHttpRequest();
    xhr.open('get', 'http://server.greenyoga.com.au/api/v1/administrator/dashboard');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          secretData: xhr.response.message
        });
      } else if (xhr.status === 401) {
        this.setState({
          secretData: 'You\'re not an authorized administrator'
        });
      }
    });
    xhr.send();
  }

  render() {
    return (
      <Card className="container">
        <CardTitle
          title="Administrator"
          subtitle="You should get access to this page only after authentication."
        />
      {<CardText style={{ fontSize: '16px', color: 'green' }}>Welcome <strong>{this.props.user.firstName} {this.props.user.lastName}</strong> ({this.props.user.role})!<br />{this.state.secretData}</CardText>}
      </Card>
    );
  }
}

AdministratorDashboard.propTypes = {
  user: PropTypes.object.isRequired
};

export default AdministratorDashboard;
