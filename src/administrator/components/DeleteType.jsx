import React, { Component } from 'react';
import Auth from '../../modules/Auth';

class DeleteType extends Component {
  constructor(props, context) {
    super(props, context);
    this.deleteType = this.deleteType.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  deleteType() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `https://green-yoga-server.herokuapp.com/api/v1/types/${this.props.id}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // refresh page after deleting type
        window.location.reload();
      }
    });
    xhr.send();
  }

  render() {
    return (
      <div>
        <a className="btn-floating red" onClick={this.deleteType}><i className="material-icons">insert_chart</i></a>
      </div>

    );
  }
}

export default DeleteType;
