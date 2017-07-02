import React, { Component } from 'react';
import Auth from '../../modules/Auth';

class ContactForm extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      text: {
        name: '',
        email: '',
        message: ''
      },
      message: ''
    };

    this.processForm = this.processForm.bind(this);
    this.changeText = this.changeText.bind(this);
  }

  componentDidMount() {
    // Display stored message by setting state and remove it from local storage
    this.setState({
      message: localStorage.getItem('message')
    });
    localStorage.removeItem('message');
  }

  // submission of form
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message
    const name = encodeURIComponent(this.state.text.name);
    const email = encodeURIComponent(this.state.text.email);
    const message = encodeURIComponent(this.state.text.message);
    let formData = `name=${name}&email=${email}&message=${message}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://server.greenyoga.com.au/api/v1/contact');
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
        localStorage.setItem('message', "Thank you for your message! I will get back to you ASAP.")

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
  changeText(event) {
    const field = event.target.name;
    const text = this.state.text;
    text[field] = event.target.value;

    this.setState({
      text
    });
  }

  render() {
    return (
      <div className="container">
        <div className="card">
          <div className="section"></div>
          <p className="message center-align">{this.state.message}</p>
          <h4>Contact Me</h4>
          <div className="container">
            <div className="row">
              <form className="col s12" action="/" onSubmit={this.processForm}>
                <div className="row">
                  {this.state.errors.summary && <p className="error-message-main">{this.state.errors.summary}</p>}

                  <div className="input-field col s12 m6 l6">
                    <input name="name" type="text" onChange={this.changeText} value={this.state.text.name} />
                    <label>Name</label>
                    {this.state.errors.name && <p className="error-message-field">{this.state.errors.name}</p>}
                  </div>

                  <div className="input-field col s12 m6 l6">
                    <input name="email" type="text" onChange={this.changeText} value={this.state.text.email} />
                    <label>Email</label>
                    {this.state.errors.email && <p className="error-message-field">{this.state.errors.email}</p>}
                  </div>
                </div>
                <div className="row">
                  <div className="input-field col s12 m12 l12">
                    <textarea name="message" onChange={this.changeText} value={this.state.text.message} className="materialize-textarea"></textarea>
                    <label>Message</label>
                    {this.state.errors.message && <p className="error-message-field">{this.state.errors.message}</p>}
                  </div>
                </div>
                <div className="button-line center-align">
                  <button className="btn waves-effect waves-light green accent-4" type="submit" name="action">
                    Send
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="center-align footer-icon">
            <i className="fa fa-facebook-square" aria-hidden="true"></i>&nbsp;&nbsp;<i className="fa fa-instagram" aria-hidden="true"></i>
          </div>
          <div className="section"></div>
        </div>
      </div>
    );
  }
}

export default ContactForm;
