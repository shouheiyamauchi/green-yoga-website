import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import RaisedButton from 'material-ui/RaisedButton';
import Collapsible from 'react-collapsible';

class EditType extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      type: null
    };

    this.processForm = this.processForm.bind(this);
    this.changeType = this.changeType.bind(this);
    this.getType = this.getType.bind(this);
  }

  componentDidMount() {
    this.getType();
  }

  getType() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://green-yoga-server.herokuapp.com/api/v1/types/${this.props.match.params.id}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // success
      // change the component-container state
      this.setState({
        errors: {},
        type: xhr.response.type
      });

      // set a message
      localStorage.setItem('successMessage', xhr.response.message);
    });
    xhr.send();
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

    const name = encodeURIComponent(this.state.type.name);
    const description = encodeURIComponent(this.state.type.description);
    const image = encodeURIComponent(this.state.type.image);
    let formData = `name=${name}&description=${description}&image=${image}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://green-yoga-server.herokuapp.com/api/v1/types/${this.props.match.params.id}`);
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

        // set a message
        localStorage.setItem('successMessage', xhr.response.message);

        // redirect to class types after edit
        this.props.history.push('/types');
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
  changeType(event) {
    const field = event.target.name;
    const type = this.state.type;
    type[field] = event.target.value;

    this.setState({
      type
    });
  }

  render() {
    return (
      <div>
        <div className="section"></div>
        {
          (this.state.type === null) ? (
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
            ) : (
              <div className="collapsible">
                <div className="collapsible-header"><i className="material-icons">mode_edit</i>Edit Class Type</div>
                  <div className="container">
                    <div className="section"></div>
                    <form action="/" onSubmit={this.processForm}>
                      {this.state.errors.summary && <p className="error-message-main">{this.state.errors.summary}</p>}

                      <div className="input-field col s12">
                        <input name="name" type="text" onChange={this.changeType} value={this.state.type.name} />
                        <label className="active">Type Name</label>
                        {this.state.errors.name && <p className="error-message-field">{this.state.errors.name}</p>}
                      </div>

                      <div className="input-field col s12">
                        <input name="description" type="text" onChange={this.changeType} value={this.state.type.description} />
                        <label className="active">Description</label>
                        {this.state.errors.description && <p className="error-message-field">{this.state.errors.description}</p>}
                      </div>

                      <div className="input-field col s12">
                        <input name="image" type="text" onChange={this.changeType} value={this.state.type.image} />
                        <label className="active">Image</label>
                        {this.state.errors.image && <p className="error-message-field">{this.state.errors.image}</p>}
                      </div>

                      <div className="button-line right-align">
                        <button className="btn waves-effect waves-light" type="submit" name="action">
                          Edit Class Type
                        </button>
                      </div>
                    </form>
                    <div className="section"></div>
                </div>
              </div>
            )
        }
      </div>
    );
  }
}

export default EditType;
