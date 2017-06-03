import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import AdministratorCreateType from '../../administrator/containers/CreateType.jsx';
import AdministratorDeleteType from '../../administrator/components/DeleteType.jsx';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';

class Types extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      types: []
    };
  }

  componentDidMount() {
    this.getTypesList()
  }

  getTypesList() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://green-yoga-server.herokuapp.com/api/v1/types');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // success
      // change the component-container state
      this.setState({
        errors: {},
        types: xhr.response.types
      });

      // set a message
      localStorage.setItem('successMessage', xhr.response.message);
    });
    xhr.send();
  }

  render() {
    return (
      <div>
        <h4>Class Types</h4>
        <h6>Listed below are the types of classes you can take at Green Yoga.</h6>
        {/* Admin section to create class type */}
        <AdministratorCreateType />
        {this.state.types.length < 1 ? (
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        ) : (
          this.state.types.map((type, i) =>
          <div key={i} className="col s12 m12">
            <div className="card horizontal">
              <div className="card-image">
                <img src="http://lorempixel.com/100/190/nature/6" />
              </div>
              <div className="card-stacked">
                <div className="card-content">
                  <span className="card-title">{type.name}</span>
                  <p>{type.description}</p>
                </div>
                <div className="card-action">
                  <AdministratorDeleteType id={type._id} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Types;
