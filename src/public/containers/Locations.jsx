import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import AdministratorCreateLocation from '../../administrator/containers/CreateLocation.jsx';
import AdministratorLocationButtons from '../../administrator/components/LocationButtons.jsx';

class Locations extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      locations: null,
      message: ''
    };
  }

  componentDidMount() {
    this.getLocationsList();

    // Display stored message by setting state and remove it from local storage
    this.setState({
      message: localStorage.getItem('location')
    });
    localStorage.removeItem('location');
  }

  getLocationsList() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://server.greenyoga.com.au/api/v1/locations');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // success
      // change the component-container state
      this.setState({
        errors: {},
        locations: xhr.response.locations
      });
    });
    xhr.send();
  }

  render() {
    return (
      <div>
        <div className="section"></div>
        <p className="message center-align">{this.state.message}</p>
        <h4>Locations</h4>
        <h6>Listed below are the locations the classes are held at.</h6>
        <div className="section"></div>
        {/* Admin section to create class type */}
        {
          (Auth.isUserAuthenticated()) ? (
            <AdministratorCreateLocation />
          ) : (
            null
          )
        }
        {this.state.locations == null ? (
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        ) : (
          this.state.locations.map((location, i) =>
          <div key={i} className="col s12 m12">
            <div className="card">
              <div className="card-stacked">
                <div className="card-content">
                  <div className="row valign-wrapper">
                    <div className="col s3">
                      <p>{location.address}</p>
                    </div>
                    <div className="col s9">
                      <span className="card-title">{location.name}</span>
                      <p>{location.description}</p>
                    </div>
                  </div>
                </div>
                {/* Admin section to edit class type */}
                {
                  (Auth.isUserAuthenticated()) ? (
                    <AdministratorLocationButtons id={location._id} />
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

export default Locations;
