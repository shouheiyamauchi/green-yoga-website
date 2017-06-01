import React from 'react';
import PropTypes from 'prop-types';
import SignUpForm from '../components/SignUpForm.jsx';


class SignUpPage extends React.Component {

  /**
   * Class constructor.
   */
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
        dob: '',
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

  /**
   * Render the component.
   */
  render() {
    return (
      <SignUpForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );
  }

}

SignUpPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default SignUpPage;
