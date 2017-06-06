import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../modules/Auth';
import Collapsible from 'react-collapsible';

const timetableHeader = <div className="collapsible-header"><i className="material-icons">event_note</i>My Timetable</div>
const passesHeader = <div className="collapsible-header"><i className="material-icons">card_membership</i>My Current Passes</div>
const purchasesHeader = <div className="collapsible-header"><i className="material-icons">attach_money</i>My Purchase History</div>
const detailsHeader = <div className="collapsible-header"><i className="material-icons">person_pin</i>My Details</div>

class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      secretData: '',
      user: {},
      message: ''
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  // submission of form
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message

    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const role = encodeURIComponent(this.state.user.role);
    const firstName = encodeURIComponent(this.state.user.firstName);
    const lastName = encodeURIComponent(this.state.user.lastName);
    const dob = encodeURIComponent(this.state.user.dob);
    const line1 = encodeURIComponent(this.state.user.line1);
    const line2 = encodeURIComponent(this.state.user.line2);
    const suburb = encodeURIComponent(this.state.user.suburb);
    const state = encodeURIComponent(this.state.user.state);
    const pcode = encodeURIComponent(this.state.user.pcode);
    const description = encodeURIComponent(this.state.user.description);
    let formData = `email=${email}&password=${password}&role=${role}&firstName=${firstName}&lastName=${lastName}&dob=${dob}&line1=${line1}&line2=${line2}&suburb=${suburb}&state=${state}&pcode=${pcode}&description=${description}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', 'http://server.greenyoga.com.au/api/v1/auth/signup');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // set a message
        localStorage.setItem('dashboard', xhr.response.message);

        // save user details into local storage
        Auth.storeUser(JSON.stringify(xhr.response.user));

        // redirect user after sign up to login page
        this.props.history.push('/dashboard');
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
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  componentDidMount() {
    // Display stored message by setting state and remove it from local storage
    this.setState({
      message: localStorage.getItem('dashboard')
    });
    localStorage.removeItem('dashboard');

    this.setState ({
      user: Auth.getUser()
    });
    const xhr = new XMLHttpRequest();
    xhr.open('get', 'http://server.greenyoga.com.au/api/v1/user/dashboard');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        this.setState({
          secretData: xhr.response.message
        });
      }
    });
    xhr.send();
  }

  render() {
    return (
      <div>
        <div className="section"></div>
        <p className="message center-align">{this.state.message}</p>
        <h4>Dashboard</h4>
        <h6>Hi {this.state.user.firstName}! How are you today?</h6>
        <div className="section"></div>
        <div className="collapsible">
          <Collapsible trigger={timetableHeader}>
            <div className="section"></div>
            <div className="container">
              <div className="row">

              </div>
              <div className="section"></div>
          </div>
          </Collapsible>
        </div>
        <div className="collapsible">
          <Collapsible trigger={passesHeader}>
            <div className="section"></div>
            <div className="container">
              <div className="row">

              </div>
              <div className="section"></div>
          </div>
          </Collapsible>
        </div>
        <div className="collapsible">
          <Collapsible trigger={purchasesHeader}>
            <div className="section"></div>
            <div className="container">
              <div className="row">

              </div>
              <div className="section"></div>
          </div>
          </Collapsible>
        </div>
        <div className="collapsible">
          <Collapsible trigger={detailsHeader}>
            <div className="section"></div>
            <div className="container">
              <div className="row">
                <form action="/" onSubmit={this.processForm}>
                  {this.state.errors.summary && <p className="error-message-main">{this.state.errors.summary}</p>}

                  <div className="input-field col s12 m6 l6">
                    <input name="firstName" type="text" onChange={this.changeUser} value={this.state.user.firstName} />
                    <label className="active">First Name</label>
                    {this.state.errors.firstName && <p className="error-message-field">{this.state.errors.firstName}</p>}
                  </div>

                  <div className="input-field col s12 m6 l6">
                    <input name="lastName" type="text" onChange={this.changeUser} value={this.state.user.lastName} />
                    <label className="active">Last Name</label>
                    {this.state.errors.lastName && <p className="error-message-field">{this.state.errors.lastName}</p>}
                  </div>

                  <div className="input-field col s12 m6 l6">
                    <input name="dob" type="text" onChange={this.changeUser} value={this.state.user.dob} />
                    <label className="active">D.O.B. (DD/MM/YYYY)</label>
                    {this.state.errors.dob && <p className="error-message-field">{this.state.errors.dob}</p>}
                  </div>

                  <div className="input-field col s12 m6 l6">
                    <input name="role" type="text" onChange={this.changeUser} value={this.state.user.role} />
                    <label className="active">Role</label>
                    {this.state.errors.role && <p className="error-message-field">{this.state.errors.role}</p>}
                  </div>

                  <div className="input-field col s12 m12 l12">
                    <input name="email" type="text" onChange={this.changeUser} value={this.state.user.email} />
                    <label className="active">Email</label>
                    {this.state.errors.email && <p className="error-message-field">{this.state.errors.email}</p>}
                  </div>

                  <div className="input-field col s12 m12 l12">
                    <input name="password" type="password" onChange={this.changeUser} value={this.state.user.password} />
                    <label className="active">Password</label>
                    {this.state.errors.password && <p className="error-message-field">{this.state.errors.password}</p>}
                  </div>

                  <div className="input-field col s12 m12 l12">
                    <input name="line1" type="text" onChange={this.changeUser} value={this.state.user.line1} />
                    <label className="active">Address Line 1</label>
                    {this.state.errors.line1 && <p className="error-message-field">{this.state.errors.line1}</p>}
                  </div>

                  <div className="input-field col s12 m12 l12">
                    <input name="line2" type="text" onChange={this.changeUser} value={this.state.user.line2} />
                    <label className="active">Address Line 2</label>
                    {this.state.errors.line2 && <p className="error-message-field">{this.state.errors.line2}</p>}
                  </div>

                  <div className="input-field col s12 m12 l12">
                    <input name="suburb" type="text" onChange={this.changeUser} value={this.state.user.suburb} />
                    <label className="active">Suburb</label>
                    {this.state.errors.suburb && <p className="error-message-field">{this.state.errors.suburb}</p>}
                  </div>

                  <div className="input-field col s12 m6 l6">
                    <select className="browser-default" name="state" onChange={this.changeUser} value={this.state.user.state}>
                      <option value="" disabled selected>State</option>
                      <option value="ACT">Australian Capital Territory</option>
                      <option value="NSW">New South Wales</option>
                      <option value="NT">Northern Territory</option>
                      <option value="QLD">Queensland</option>
                      <option value="SA">South Australia</option>
                      <option value="TAS">Tasmania</option>
                      <option value="VIC">Victoria</option>
                      <option value="WA">Western Australia</option>
                    </select>
                  </div>

                  <div className="input-field col s12 m6 l6">
                    <input name="pcode" type="text" onChange={this.changeUser} value={this.state.user.pcode} />
                    <label className="active">Post Code</label>
                    {this.state.errors.pcode && <p className="error-message-field">{this.state.errors.pcode}</p>}
                  </div>

                  <div className="input-field col s12 m12 l12">
                    <textarea name="description" className="materialize-textarea" onChange={this.changeUser} value={this.state.user.description} />
                    <label className="active">Description</label>
                    {this.state.errors.description && <p className="error-message-field">{this.state.errors.description}</p>}
                  </div>

                  <div className="section"></div>
                  <div className="button-line center-align">
                    <button className="btn waves-effect waves-light" type="submit" name="action">
                      Edit Account Details
                    </button>
                  </div>
                </form>
              </div>
              <div className="section"></div>
          </div>
          </Collapsible>
        </div>
      </div>
    );
  }

}

export default DashboardPage;
