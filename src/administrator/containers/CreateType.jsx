import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import RaisedButton from 'material-ui/RaisedButton';
import Collapsible from 'react-collapsible';

const header = <div className="collapsible-header"><i className="material-icons">add_circle_outline</i>Add Class Type</div>

class CreateType extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      type: {
        name: '',
        description: '',
        image: ''
      },
      uploading: false
    };

    this.processForm = this.processForm.bind(this);
    this.changeType = this.changeType.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.getSignedRequest = this.getSignedRequest.bind(this);
    this.initUpload = this.initUpload.bind(this);
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
    xhr.open('POST', 'http://server.greenyoga.com.au/api/v1/types');
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
        localStorage.setItem('type', xhr.response.message)

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

  // functions for uploading file

  initUpload(event){
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    const files = document.getElementById('file-input').files;
    const file = files[0];
    if(file == null){
      return alert('No file selected.');
    }
    this.setState({
      uploading: true
    });
    this.getSignedRequest(file);
  }

  getSignedRequest(file){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://server.greenyoga.com.au/api/v1/sign-s3?file-name=types/${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          const response = JSON.parse(xhr.responseText);
          this.uploadFile(file, response.signedRequest, response.url);
        }
        else{
          alert('Could not get signed URL.');
        }
      }
    };
    xhr.send();
  }

  uploadFile(file, signedRequest, url){
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          this.setState({
            type: {
              name: this.state.type.name,
              description: this.state.type.description,
              image: url
            },
            uploading: false
          })
        }
        else{
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }

  render() {
    return (
      <div>
        {
          (Auth.getUser().role === "administrator") ? (
            <div className="collapsible">
              <Collapsible trigger={header}>
                <div className="container">
                  <form action="/" onSubmit={this.processForm}>
                    {this.state.errors.summary && <p className="error-message-main">{this.state.errors.summary}</p>}

                    <div className="input-field col s12">
                      <input name="name" type="text" onChange={this.changeType} value={this.state.type.name} />
                      <label>Type Name</label>
                      {this.state.errors.name && <p className="error-message-field">{this.state.errors.name}</p>}
                    </div>

                    <div className="input-field col s12">
                      <textarea name="description" className="materialize-textarea" onChange={this.changeType} value={this.state.type.description} />
                      <label>Description</label>
                      {this.state.errors.description && <p className="error-message-field">{this.state.errors.description}</p>}
                    </div>

                    {this.state.uploading ? (
                      <div className="spinner">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                      </div>
                    ) : (
                      null
                    )}
                    {(this.state.type.image === '') ? (
                      null
                    ) : (
                      <div className="center-align">
                        <img className="preview" src={this.state.type.image} />
                      </div>
                    )}

                    <div className="file-field input-field">
                      <div className="btn">
                        <span>Image</span>
                        <input type="file" id="file-input" onChange={this.initUpload} />
                      </div>
                      <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                      </div>
                      {this.state.errors.image && <p className="error-message-field">{this.state.errors.image}</p>}
                    </div>

                    <div className="button-line right-align">
                      <button className="btn waves-effect waves-light" type="submit" name="action">
                        Add Class Type
                      </button>
                    </div>
                  </form>
                  <div className="section"></div>
              </div>
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

export default CreateType;
