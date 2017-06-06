import React, { Component } from 'react';
import Auth from '../../modules/Auth';

class EditLesson extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      lesson: null,
      uploading: false
    };

    this.processForm = this.processForm.bind(this);
    this.changeLesson = this.changeLesson.bind(this);
    this.getLesson = this.getLesson.bind(this);
  }

  componentDidMount() {
    this.getLesson();
  }

  getLesson() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `http://server.greenyoga.com.au/api/v1/lessons/${this.props.match.params.id}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // success
      // change the component-container state
      this.setState({
        errors: {},
        lesson: xhr.response.lesson
      });
    });
    xhr.send();
  }

  // submission of form
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message

    const date = encodeURIComponent(this.state.lesson.date);
    const startTime = encodeURIComponent(this.state.lesson.startTime);
    const endTime = encodeURIComponent(this.state.lesson.endTime);
    const user_id = encodeURIComponent(this.state.lesson.user_id);
    const type_id = encodeURIComponent(this.state.lesson.type_id);
    const location_id = encodeURIComponent(this.state.lesson.location_id);
    let formData = `date=${date}&startTime=${startTime}&endTime=${endTime}&user_id=${user_id}&type_id=${type_id}&location_id=${location_id}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `http://server.greenyoga.com.au/api/v1/lessons/${this.props.match.params.id}`);
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
        localStorage.setItem('lesson', xhr.response.message)

        // redirect to class lessons after edit
        this.props.history.push('/lessons');
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

  // update the state as the user types
  changeLesson(event) {
    const field = event.target.name;
    const lesson = this.state.lesson;
    lesson[field] = event.target.value;

    this.setState({
      lesson
    });
  }

  render() {
    return (
      <div>
        <div className="section"></div>
        {
          (this.state.lesson === null) ? (
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
            ) : (
            <div className="collapsible">
              <div className="collapsible-header"><i className="material-icons">mode_edit</i>Edit Class</div>
                <div className="section"></div>
                <form action="/" onSubmit={this.processForm}>
                  <div className="container">
                    <div className="row">
                      {this.state.errors.summary && <p className="error-message-main">{this.state.errors.summary}</p>}

                      <div className="input-field col s12 m4 l4">
                        <input name="date" type="text" onChange={this.changeLesson} value={this.state.lesson.date} />
                        <label className="active">Date (DD/MM/YYYY)</label>
                        {this.state.errors.date && <p className="error-message-field">{this.state.errors.date}</p>}
                      </div>

                      <div className="input-field col s12 m4 l4">
                        <input name="startTime" type="text" onChange={this.changeLesson} value={this.state.lesson.startTime} />
                        <label className="active">Start Time</label>
                        {this.state.errors.startTime && <p className="error-message-field">{this.state.errors.startTime}</p>}
                      </div>

                      <div className="input-field col s12 m4 l4">
                        <input name="endTime" type="text" onChange={this.changeLesson} value={this.state.lesson.endTime} />
                        <label className="active">End Time</label>
                        {this.state.errors.endTime && <p className="error-message-field">{this.state.errors.endTime}</p>}
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <input name="user_id" type="text" onChange={this.changeLesson} value={this.state.lesson.user_id} />
                        <label className="active">Teacher</label>
                        {this.state.errors.user_id && <p className="error-message-field">{this.state.errors.user_id}</p>}
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <input name="type_id" type="text" onChange={this.changeLesson} value={this.state.lesson.type_id} />
                        <label className="active">Class Type</label>
                        {this.state.errors.type_id && <p className="error-message-field">{this.state.errors.type_id}</p>}
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <input name="location_id" type="text" onChange={this.changeLesson} value={this.state.lesson.location_id} />
                        <label className="active">Location</label>
                        {this.state.errors.location_id && <p className="error-message-field">{this.state.errors.location_id}</p>}
                      </div>
                    </div>
                  </div>
                  <div className="button-line center-align">
                    <button className="btn waves-effect waves-light" type="submit" name="action">
                      Edit Class
                    </button>
                  </div>
                </form>
                <div className="section"></div>
              </div>
            )
        }
      </div>
    );
  }
}

export default EditLesson;
