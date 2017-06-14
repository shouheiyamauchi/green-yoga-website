import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import { Link } from 'react-router-dom';

class LessonButtons extends Component {
  constructor(props, context) {
    super(props, context);
    this.deleteLesson = this.deleteLesson.bind(this);
  }

  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  deleteLesson() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', `https://server.greenyoga.com.au/api/v1/lessons/${this.props.id}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // set a success message
        localStorage.setItem('lesson', xhr.response.message)

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
              <Link to={`/administrator/edit-lesson/${this.props.id}`}><i className="material-icons">mode_edit</i></Link>
              <a onClick={this.deleteLesson}><i className="material-icons">delete_forever</i></a>
            </div>
          ) : (
            null
          )
        }
      </div>
    );
  }
}

export default LessonButtons;
