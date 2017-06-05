import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import AdministratorCreateType from '../../administrator/containers/CreateType.jsx';
import AdministratorTypeButtons from '../../administrator/components/TypeButtons.jsx';

class Types extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      types: null,
      message: ''
    };
  }

  componentDidMount() {
    this.getTypesList();

    // Display stored message by setting state and remove it from local storage
    this.setState({
      message: localStorage.getItem('type')
    });
    localStorage.removeItem('type');
  }

  getTypesList() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://server.greenyoga.com.au/api/v1/types');
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
    });
    xhr.send();
  }

  render() {
    return (
      <div>
        <div className="section"></div>
        <p className="message center-align">{this.state.message}</p>
        <h4>Class Types</h4>
        <h6>Listed below are the types of classes you can take at Green Yoga.</h6>
        <div className="section"></div>
        {/* Admin section to create class type */}
        {
          (Auth.isUserAuthenticated()) ? (
            <AdministratorCreateType />
          ) : (
            null
          )
        }
        {this.state.types == null ? (
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        ) : (
          this.state.types.map((type, i) =>
          <div key={i} className="col s12 m12">
            <div className="card">
              <div className="card-stacked">
                <div className="card-content">
                  <div className="row valign-wrapper">
                    <div className="col s3">
                      <img src={type.image} alt="" className="circle responsive-img" />
                    </div>
                    <div className="col s9">
                      <span className="card-title">{type.name}</span>
                      <p>{type.description}</p>
                    </div>
                  </div>
                </div>
                {/* Admin section to edit class type */}
                {
                  (Auth.isUserAuthenticated()) ? (
                    <AdministratorTypeButtons id={type._id} />
                  ) : (
                    null
                  )
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default Types;
