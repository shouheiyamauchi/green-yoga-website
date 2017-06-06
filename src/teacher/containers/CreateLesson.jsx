import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import Collapsible from 'react-collapsible';

const header = <div className="collapsible-header"><i className="material-icons">add_circle_outline</i>Add Class</div>

class CreateLesson extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      lesson: {
        date: '',
        startTime: '',
        endTime: '',
        user_id: '',
        type_id: '',
        location_id: ''
      },
      teachers: null,
      types: null,
      locations: null
    };

    this.processForm = this.processForm.bind(this);
    this.changeLesson = this.changeLesson.bind(this);
    this.getTeachersList = this.getTeachersList.bind(this);
    this.getTypesList = this.getTypesList.bind(this);
    this.getLocationsList = this.getLocationsList.bind(this);
  }

  componentDidMount() {
    this.getTeachersList();
    this.getTypesList();
    this.getLocationsList();
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
    xhr.open('POST', 'http://server.greenyoga.com.au/api/v1/lessons');
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
        {
          (Auth.getUser().role === "administrator" || Auth.getUser().role === "teacher") ? (
            <div className="collapsible">
              <Collapsible trigger={header}>
                <div className="section"></div>
                <div className="container">
                  <div className="row">
                    <form action="/" onSubmit={this.processForm}>
                      {this.state.errors.summary && <p className="error-message-main">{this.state.errors.summary}</p>}

                      <div className="input-field col s12 m4 l4">
                        <input name="date" type="text" onChange={this.changeLesson} value={this.state.lesson.date} />
                        <label>Class Date</label>
                        {this.state.errors.date && <p className="error-message-field">{this.state.errors.date}</p>}
                      </div>

                      <div className="input-field col s12 m4 l4">
                        <input name="startTime" type="text" onChange={this.changeLesson} value={this.state.lesson.startTime} />
                        <label>Start Time</label>
                        {this.state.errors.startTime && <p className="error-message-field">{this.state.errors.startTime}</p>}
                      </div>

                      <div className="input-field col s12 m4 l4">
                        <input name="endTime" type="text" onChange={this.changeLesson} value={this.state.lesson.endTime} />
                        <label>End Time</label>
                        {this.state.errors.endTime && <p className="error-message-field">{this.state.errors.endTime}</p>}
                      </div>

                      {this.state.teachers == null ? (
                        <div className="spinner">
                          <div className="bounce1"></div>
                          <div className="bounce2"></div>
                          <div className="bounce3"></div>
                        </div>
                      ) : (
                        <div className="input-field col s12 m4 l4">
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
                        <div className="input-field col s12 m4 l4">
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
                        <div className="input-field col s12 m4 l4">
                          <select className="browser-default" name="location_id" onChange={this.changeLesson} value={this.state.lesson.location_id}>
                            <option value="" disabled selected>Location</option>
                            {this.state.locations.map((location) =>
                              <option value={location._id}>{location.name}</option>
                            )}
                          </select>
                          <div className="section"></div>
                        </div>
                      )}

                      {/*

                      <div className="input-field col s12 m12 l12">
                        <input name="user_id" type="text" onChange={this.changeLesson} value={this.state.lesson.user_id} />
                        <label>Teacher</label>
                        {this.state.errors.user_id && <p className="error-message-field">{this.state.errors.user_id}</p>}
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <input name="type_id" type="text" onChange={this.changeLesson} value={this.state.lesson.type_id} />
                        <label>Class Type</label>
                        {this.state.errors.type_id && <p className="error-message-field">{this.state.errors.type_id}</p>}
                      </div>

                      <div className="input-field col s12 m12 l12">
                        <input name="location_id" type="text" onChange={this.changeLesson} value={this.state.lesson.location_id} />
                        <label>Location</label>
                        {this.state.errors.location_id && <p className="error-message-field">{this.state.errors.location_id}</p>}
                      </div>

                      */}

                      <div className="section"></div>
                      <div className="button-line center-align">
                        <button className="btn waves-effect waves-light" type="submit" name="action">
                          Add Class
                        </button>
                      </div>
                    </form>
                  </div>
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

export default CreateLesson;
