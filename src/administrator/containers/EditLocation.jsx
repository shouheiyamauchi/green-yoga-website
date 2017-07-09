import React, { Component } from 'react';
import Auth from '../../modules/Auth';

class EditLocation extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      location: null
    };

    this.processForm = this.processForm.bind(this);
    this.changeLocation = this.changeLocation.bind(this);
    this.getLocation = this.getLocation.bind(this);
  }

  componentDidMount() {
    this.getLocation();
  }

  getLocation() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://server.greenyoga.com.au/api/v1/locations/${this.props.match.params.id}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // success
      // change the component-container state
      this.setState({
        errors: {},
        location: xhr.response.location
      });
    });
    xhr.send();
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
    xhr.open('POST', `https://server.greenyoga.com.au/api/v1/locations/${this.props.match.params.id}`);
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

        // redirect to class types after edit
        this.props.history.push('/locations');
      } else {
        // failure

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
        <div className="section"></div>
        {
          (this.state.location === null) ? (
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
            ) : (
            <div className="collapsible">
              <div className="collapsible-header"><i className="material-icons">mode_edit</i>Edit Class Type</div>
                <div className="section"></div>
                <form action="/" onSubmit={this.processForm}>
                  <div className="container">
                    <div className="row">
                      {this.state.errors.summary && <p className="error-message-main">{this.state.errors.summary}</p>}

                      <div className="input-field col s12 m12 l12">
                        <input name="name" type="text" onChange={this.changeLocation} value={this.state.location.name} />
                        <label className="active">Location Name</label>
                        {this.state.errors.name && <p className="error-message-field">{this.state.errors.name}</p>}
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <input name="address" type="text" onChange={this.changeLocation} value={this.state.location.address} />
                        <label className="active">Address</label>
                        {this.state.errors.address && <p className="error-message-field">{this.state.errors.address}</p>}
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <input name="latitude" type="text" onChange={this.changeLocation} value={this.state.location.latitude} />
                        <label className="active">Latitude</label>
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <input name="longitude" type="text" onChange={this.changeLocation} value={this.state.location.longitude} />
                        <label className="active">Longitude</label>
                        {this.state.errors.latlon && <p className="error-message-field">{this.state.errors.latlon}</p>}
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <textarea name="description" className="materialize-textarea" onChange={this.changeLocation} value={this.state.location.description} />
                        <label className="active">Description</label>
                        {this.state.errors.description && <p className="error-message-field">{this.state.errors.description}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="button-line center-align">
                    <button className="btn waves-effect waves-light teal lighten-2" type="submit" name="action">
                      Edit Location
                    </button>
                  </div>
                </form>
                <div className="section"></div>
              </div>
            )
        }
      </div>
    );
  }
}

export default EditLocation;
