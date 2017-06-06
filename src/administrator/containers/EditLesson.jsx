import React, { Component } from 'react';
import Auth from '../../modules/Auth';

class EditLesson extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      lesson: null,
      teachers: null,
      types: null,
      locations: null
    };

    this.processForm = this.processForm.bind(this);
    this.changeLesson = this.changeLesson.bind(this);
    this.getLesson = this.getLesson.bind(this);
    this.getTeachersList = this.getTeachersList.bind(this);
    this.getTypesList = this.getTypesList.bind(this);
    this.getLocationsList = this.getLocationsList.bind(this);
  }

  componentDidMount() {
    this.getLesson();
    this.getTeachersList();
    this.getTypesList();
    this.getLocationsList();
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

  getTeachersList() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://server.greenyoga.com.au/api/v1/teachers');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // success
      // change the component-container state
      this.setState({
        errors: {},
        teachers: xhr.response.teachers
      });
    });
    xhr.send();
  }

  getTypesList() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://server.greenyoga.com.au/api/v1/types');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // success
      // change the component-container state
      this.setState({
        errors: {},
        types: xhr.response.types
      });
    });
    xhr.send();
  }

  getLocationsList() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://server.greenyoga.com.au/api/v1/locations');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // success
      // change the component-container state
      this.setState({
        errors: {},
        locations: xhr.response.locations
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

                      {this.state.teachers == null ? (
                        <div className="spinner">
                          <div className="bounce1"></div>
                          <div className="bounce2"></div>
                          <div className="bounce3"></div>
                        </div>
                      ) : (
                        <div className="input-field col s12 m12 l12">
                          <select className="browser-default" name="user_id" onChange={this.changeLesson} value={this.state.lesson.user_id}>
                            <option value="" disabled selected>Teacher</option>
                            {this.state.teachers.map((teacher) =>
                              <option value={teacher._id}>{teacher.firstName} {teacher.lastName}</option>
                            )}
                          </select>
                          <div className="section"></div>
                        </div>
                      )}

                      {this.state.types == null ? (
                        <div className="spinner">
                          <div className="bounce1"></div>
                          <div className="bounce2"></div>
                          <div className="bounce3"></div>
                        </div>
                      ) : (
                        <div className="input-field col s12 m6 l6">
                          <select className="browser-default" name="type_id" onChange={this.changeLesson} value={this.state.lesson.type_id}>
                            <option value="" disabled selected>Class Type</option>
                            {this.state.types.map((type) =>
                              <option value={type._id}>{type.name}</option>
                            )}
                          </select>
                          <div className="section"></div>
                        </div>
                      )}

                      {this.state.locations == null ? (
                        <div className="spinner">
                          <div className="bounce1"></div>
                          <div className="bounce2"></div>
                          <div className="bounce3"></div>
                        </div>
                      ) : (
                        <div className="input-field col s12 m6 l6">
                          <select className="browser-default" name="location_id" onChange={this.changeLesson} value={this.state.lesson.location_id}>
                            <option value="" disabled selected>Location</option>
                            {this.state.locations.map((location) =>
                              <option value={location._id}>{location.name}</option>
                            )}
                          </select>
                          <div className="section"></div>
                        </div>
                      )}

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
