import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
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

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
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
    xhr.open('post', 'https://green-yoga-server.herokuapp.com/api/v1/auth/signup');
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
        localStorage.setItem('successMessage', xhr.response.message);

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

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
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

  render() {
    return (
      <Card className="container">
        <form action="/" onSubmit={this.processForm}>
          <h2 className="card-heading">Sign Up</h2>

          {this.state.errors.summary && <p className="error-message">{this.state.errors.summary}</p>}


          <TextField
            floatingLabelText="First Name"
            name="firstName"
            errorText={this.state.errors.firstName}
            onChange={this.changeUser}
            value={this.state.user.firstName}
          />

          <div className="field-line">
            <TextField
              floatingLabelText="Last Name"
              name="lastName"
              errorText={this.state.errors.lastName}
              onChange={this.changeUser}
              value={this.state.user.lastName}
            />
          </div>

          <div className="field-line">
            <TextField
              floatingLabelText="Role"
              name="role"
              errorText={this.state.errors.role}
              onChange={this.changeUser}
              value={this.state.user.role}
            />
          </div>

          <div className="field-line">
            <TextField
              floatingLabelText="Email"
              name="email"
              errorText={this.state.errors.email}
              onChange={this.changeUser}
              value={this.state.user.email}
            />
          </div>

          <div className="field-line">
            <TextField
              floatingLabelText="Password"
              type="password"
              name="password"
              onChange={this.changeUser}
              errorText={this.state.errors.password}
              value={this.state.user.password}
            />
          </div>

            <br />
            <DatePicker
              hintText="D.O.B."
              onChange={this.changeDate}
              value={this.state.user.dob}
              formatDate={this.formatDate}
            />

          <div className="field-line">
            <TextField
              floatingLabelText="Address Line 1"
              name="line1"
              errorText={this.state.errors.line1}
              onChange={this.changeUser}
              value={this.state.user.line1}
            />
          </div>

          <div className="field-line">
            <TextField
              floatingLabelText="Address Line 2"
              name="line2"
              errorText={this.state.errors.line2}
              onChange={this.changeUser}
              value={this.state.user.line2}
            />
          </div>

          <div className="field-line">
            <TextField
              floatingLabelText="Suburb"
              name="suburb"
              errorText={this.state.errors.suburb}
              onChange={this.changeUser}
              value={this.state.user.suburb}
            />
          </div>

          <div className="field-line">
            <TextField
              floatingLabelText="State"
              name="state"
              errorText={this.state.errors.state}
              onChange={this.changeUser}
              value={this.state.user.state}
            />
          </div>

          <div className="field-line">
            <TextField
              floatingLabelText="Post Code"
              name="pcode"
              errorText={this.state.errors.pcode}
              onChange={this.changeUser}
              value={this.state.user.pcode}
            />
          </div>

          <div className="field-line">
            <TextField
              floatingLabelText="Description"
              name="description"
              errorText={this.state.errors.description}
              onChange={this.changeUser}
              value={this.state.user.description}
            />
          </div>

          <div className="button-line">
            <RaisedButton type="submit" label="Create New Account" primary />
          </div>

          <CardText>Already have an account? <Link to={'/login'}>Log in</Link></CardText>
        </form>
      </Card>
    );
  }
}

export default SignupPage;
