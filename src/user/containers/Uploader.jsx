import React, { Component } from 'react';
import Auth from '../../modules/Auth';

class Uploader extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      image: ''
    }
    this.uploadFile = this.uploadFile.bind(this);
    this.getSignedRequest = this.getSignedRequest.bind(this);
    this.initUpload = this.initUpload.bind(this);
  }

  uploadFile(file, signedRequest, url){
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    xhr.onreadystatechange = () => {
      if(xhr.readyState === 4){
        if(xhr.status === 200){
          this.setState({
            image: url
          })
        }
        else{
          alert('Could not upload file.');
        }
      }
    };
    xhr.send(file);
  }

  getSignedRequest(file){
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://green-yoga-server.herokuapp.com/api/v1/sign-s3?file-name=uploader/${file.name}&file-type=${file.type}`);
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

  initUpload(event){
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    const files = document.getElementById('file-input').files;
    const file = files[0];
    if(file == null){
      return alert('No file selected.');
    }
    this.getSignedRequest(file);
  }

  render() {
    return (
      <div>
        <form action="/" onSubmit={this.initUpload}>
          <input type="file" id="file-input" />

          <hr />
          <h2>Save changes</h2>

          <input type="submit" value="Update profile" />
        </form>
        {(this.state.image === '') ? (
          null
        ) : (
          <img src={this.state.image} />
        )}
      </div>
    );
  }
}

export default Uploader;
