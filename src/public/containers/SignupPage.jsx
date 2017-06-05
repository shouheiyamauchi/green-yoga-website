import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

class SignupPage extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        password: '',
        role: '',
        firstName: '',
        lastName: '',
        dob: moment(),
        line1: '',
        line2: '',
        suburb: '',
        state: '',
        pcode: '',
        description: ''
      }
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.changeDate = this.changeDate.bind(this);
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
        localStorage.setItem('user', xhr.response.message);

        // redirect user after sign up to login page
        this.props.history.push('/login');
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

  changeDate(event, date) {
    this.setState({
      user: {
        dob: date
      }
    });
  }

  formatDate(date){
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  }

  _onFocus(e){
      e.currentTarget.type = "date";
  }

  _onBlur(e){
      e.currentTarget.type = "text";
      e.currentTarget.placeholder = "D.O.B.";
  }

  render() {
    return (
      <div>
        <div className="section"></div>
        <h4>Sign up</h4>
        <h6>Start your yoga adventure by signing up.</h6>
        <div className="section"></div>
        <div className="card">
          <div className="section"></div>
          <div className="container">
            <div className="row">
              <form action="/" onSubmit={this.processForm}>


                {this.state.errors.summary && <p className="error-message-main">{this.state.errors.summary}</p>}

                <div className="input-field col s12 m6 l6">
                  <input name="firstName" type="text" onChange={this.changeUser} value={this.state.user.firstName} />
                  <label>First Name</label>
                  {this.state.errors.firstName && <p className="error-message-field">{this.state.errors.firstName}</p>}
                </div>

                <div className="input-field col s12 m6 l6">
                  <input name="lastName" type="text" onChange={this.changeUser} value={this.state.user.lastName} />
                  <label>Last Name</label>
                  {this.state.errors.lastName && <p className="error-message-field">{this.state.errors.lastName}</p>}
                </div>

                <div className="input-field col s12 m6 l6">
                  <input name="dob" type="date" onChange={this.changeUser} value={this.state.user.dob} onFocus={this._onFocus}  onBlur={this._onBlur} />
                </div>

                <div className="input-field col s12 m6 l6">
                  <input name="role" type="text" onChange={this.changeUser} value={this.state.user.role} />
                  <label>Role</label>
                  {this.state.errors.role && <p className="error-message-field">{this.state.errors.role}</p>}
                </div>

                <div className="input-field col s12 m12 l12">
                  <input name="email" type="text" onChange={this.changeUser} value={this.state.user.email} />
                  <label>Email</label>
                  {this.state.errors.email && <p className="error-message-field">{this.state.errors.email}</p>}
                </div>

                <div className="input-field col s12 m12 l12">
                  <input name="password" type="password" onChange={this.changeUser} value={this.state.user.password} />
                  <label>Password</label>
                  {this.state.errors.password && <p className="error-message-field">{this.state.errors.password}</p>}
                </div>

                <div className="input-field col s12 m12 l12">
                  <input name="line1" type="text" onChange={this.changeUser} value={this.state.user.line1} />
                  <label>Address Line 1</label>
                  {this.state.errors.line1 && <p className="error-message-field">{this.state.errors.line1}</p>}
                </div>

                <div className="input-field col s12 m12 l12">
                  <input name="line2" type="text" onChange={this.changeUser} value={this.state.user.line2} />
                  <label>Address Line 2</label>
                  {this.state.errors.line2 && <p className="error-message-field">{this.state.errors.line2}</p>}
                </div>

                <div className="input-field col s12 m12 l12">
                  <input name="suburb" type="text" onChange={this.changeUser} value={this.state.user.suburb} />
                  <label>Suburb</label>
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
                  <label>Post Code</label>
                  {this.state.errors.pcode && <p className="error-message-field">{this.state.errors.pcode}</p>}
                </div>

                <div className="input-field col s12 m12 l12">
                  <textarea name="description" className="materialize-textarea" onChange={this.changeUser} value={this.state.user.description} />
                  <label>Description</label>
                  {this.state.errors.description && <p className="error-message-field">{this.state.errors.description}</p>}
                </div>

                <div className="section"></div>
                <div className="button-line center-align">
                  <button className="btn waves-effect waves-light" type="submit" name="action">
                    Create New Account
                  </button>
                </div>
                <p className="center-align">Already have an account? <Link to={'/login'} className="link">Log in</Link>.</p>
                <div className="section"></div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SignupPage;
