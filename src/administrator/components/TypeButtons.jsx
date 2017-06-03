import React, { Component } from 'react';
import Auth from '../../modules/Auth';

class TypeButtons extends Component {
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
        {
          (Auth.getUser().role === "administrator") ? (
            <div className="card-action right-align horizontal">
              <a href={`/administrator/edit-type/${this.props.id}`}><i className="material-icons">mode_edit</i></a>
              <a onClick={this.deleteType}><i className="material-icons">delete_forever</i></a>
            </div>
          ) : (
            null
          )
        }
      </div>
    );
  }
}

export default TypeButtons;
