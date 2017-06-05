import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import { Link } from 'react-router-dom';

class LoginPage extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      user: {
        email: '',
        password: ''
      },
      message: ''
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  componentDidMount() {
    // update authenticated state
    this.props.toggleAuthenticateStatus()

    // Display stored message by setting state and remove it from local storage
    this.setState({
      message: localStorage.getItem('user')
    });
    localStorage.removeItem('user');
  }

  // submission of form
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `email=${email}&password=${password}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', 'http://server.greenyoga.com.au/api/v1/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // save the token into local storage
        Auth.authenticateUser(xhr.response.token);

        // save user details into local storage
        Auth.storeUser(JSON.stringify(xhr.response.user));

        // update authenticated state
        this.props.toggleAuthenticateStatus()

        // redirect signed in user to dashboard
        this.props.history.push('/dashboard');
      } else {
        // failure

        // change the component state
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

  render() {
    return (
      <div>
        <div className="section"></div>
        <p className="message center-align">{this.state.message}</p>
        <h4>Log in</h4>
        <h6>Start your yoga adventure by logging in.</h6>
        <div className="section"></div>
        <div className="card">
          <div className="section"></div>
          <div className="container">
            <form action="/" onSubmit={this.processForm}>
              {this.state.errors.summary && <p className="error-message-main">{this.state.errors.summary}</p>}

              <div className="input-field col s12">
                <input name="email" type="text" onChange={this.changeUser} value={this.state.user.email} />
                <label>Email</label>
                {this.state.errors.email && <p className="error-message-field">{this.state.errors.email}</p>}
              </div>

              <div className="input-field col s12">
                <input name="password" type="password" onChange={this.changeUser} value={this.state.user.password} />
                <label>Password</label>
                {this.state.errors.password && <p className="error-message-field">{this.state.errors.password}</p>}
              </div>
              <div className="section"></div>
              <div className="button-line center-align">
                <button className="btn waves-effect waves-light" type="submit" name="action">
                  Log in
                </button>
              </div>
              <p className="center-align">Don't have an account? <Link to={'/signup'} className="link">Create one</Link>.</p>
              <div className="section"></div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginPage;
