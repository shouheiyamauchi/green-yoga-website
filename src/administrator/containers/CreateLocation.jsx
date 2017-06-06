import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import Collapsible from 'react-collapsible';

const header = <div className="collapsible-header"><i className="material-icons">add_circle_outline</i>Add Location</div>

class CreateLocation extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      location: {
        name: '',
        address: '',
        longitude: '',
        latitude: '',
        description: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeLocation = this.changeLocation.bind(this);
  }

  // submission of form
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.location.name);
    const address = encodeURIComponent(this.state.location.address);
    const longitude = encodeURIComponent(this.state.location.longitude);
    const latitude = encodeURIComponent(this.state.location.latitude);
    const description = encodeURIComponent(this.state.location.description);
    let formData = `name=${name}&address=${address}&longitude=${longitude}&latitude=${latitude}&description=${description}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://server.greenyoga.com.au/api/v1/locations');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // set a success message
        localStorage.setItem('location', xhr.response.message)

        // redirect user after creation of type
        window.location.reload();
      } else {
        // failed to submit form - display the errors

        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  // update the state as the user types
  changeLocation(event) {
    const field = event.target.name;
    const location = this.state.location;
    location[field] = event.target.value;

    this.setState({
      location
    });
  }

  render() {
    return (
      <div>
        {
          (Auth.getUser().role === "administrator") ? (
            <div className="collapsible">
              <Collapsible trigger={header}>
                <div className="section"></div>
                <form action="/" onSubmit={this.processForm}>
                  <div className="container">
                    <div className="row">
                      {this.state.errors.summary && <p className="error-message-main">{this.state.errors.summary}</p>}

                      <div className="input-field col s12 m12 l12">
                        <input name="name" type="text" onChange={this.changeLocation} value={this.state.location.name} />
                        <label>Location Name</label>
                        {this.state.errors.name && <p className="error-message-field">{this.state.errors.name}</p>}
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <input name="address" type="text" onChange={this.changeLocation} value={this.state.location.address} />
                        <label>Address</label>
                        {this.state.errors.address && <p className="error-message-field">{this.state.errors.address}</p>}
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <input name="latitude" type="text" onChange={this.changeLocation} value={this.state.location.latitude} />
                        <label>Latitude</label>
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <input name="longitude" type="text" onChange={this.changeLocation} value={this.state.location.longitude} />
                        <label>Longitude</label>
                        {this.state.errors.latlon && <p className="error-message-field">{this.state.errors.latlon}</p>}
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <textarea name="description" className="materialize-textarea" onChange={this.changeLocation} value={this.state.location.description} />
                        <label>Description</label>
                        {this.state.errors.description && <p className="error-message-field">{this.state.errors.description}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="button-line center-align">
                    <button className="btn waves-effect waves-light" type="submit" name="action">
                      Add Location
                    </button>
                  </div>
                </form>
                <div className="section"></div>
              </Collapsible>
            </div>
            ) : (
              null
            )
        }
      </div>
    );
  }
}

export default CreateLocation;
