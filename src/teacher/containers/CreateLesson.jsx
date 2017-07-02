import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import Collapsible from 'react-collapsible';
import Modal from 'react-awesome-modal';

const header = <div className="collapsible-header"><i className="material-icons">add_circle_outline</i>Add Class</div>

class CreateLesson extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      lesson: {
        date: '',
        startTimeHH: '',
        startTimeMM: '',
        endTimeHH: '',
        endTimeMM: '',
        user_id: '',
        type_id: '',
        location_id: ''
      },
      teachers: null,
      types: null,
      locations: null,
      modalVisible: false,
      modalContent: ''
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

  openModal(modalContent) {
    this.setState({
      modalVisible : true,
      modalContent
    });
  }

  closeModal() {
    this.setState({
      modalVisible : false,
      modalContent: ''
    });
  }

  getTeachersList() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://server.greenyoga.com.au/api/v1/teachers');
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
    xhr.open('GET', 'https://server.greenyoga.com.au/api/v1/types');
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
    xhr.open('GET', 'https://server.greenyoga.com.au/api/v1/locations');
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
    const startTime = encodeURIComponent(this.state.lesson.startTimeHH + ":" + this.state.lesson.startTimeMM);
    const endTime = encodeURIComponent(this.state.lesson.endTimeHH + ":" + this.state.lesson.endTimeMM);
    const user_id = encodeURIComponent(this.state.lesson.user_id);
    const type_id = encodeURIComponent(this.state.lesson.type_id);
    const location_id = encodeURIComponent(this.state.lesson.location_id);
    let formData = `date=${date}&startTime=${startTime}&endTime=${endTime}&user_id=${user_id}&type_id=${type_id}&location_id=${location_id}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://server.greenyoga.com.au/api/v1/lessons');
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
        this.openModal(xhr.response.message);
        this.props.getLessonsList();
      } else {
        // failed to submit form - display the errors
        const errors = xhr.response.errors ? xhr.response.errors : {};
        this.setState({
          errors
        });
        this.openModal(xhr.response.message);
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
        <Modal visible={this.state.modalVisible} effect="fadeInUp" onClickAway={() => this.closeModal()}>
          <div className="spacer center-align">
            <p>{this.state.modalContent}</p>
            <button onClick={() => this.closeModal()} className="btn waves-effect waves-light grey darken-1">
              Okay
            </button>
          </div>
        </Modal>
        {
          (Auth.getUser().role === "administrator" || Auth.getUser().role === "teacher") ? (
            <div className="collapsible">
              <Collapsible trigger={header}>
                <div className="section"></div>
                {this.state.errors.summary && <p className="error-message-main">{this.state.errors.summary}</p>}

                {(this.state.teachers == null || this.state.types == null || this.state.locations == null) ? (
                  <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                  </div>
                ) : (
                  <div>
                    <form action="/" onSubmit={this.processForm}>
                      <div className="container">
                        <div className="row">
                          <div className="input-field col s12 m12 l12">
                            <select className="browser-default" name="user_id" onChange={this.changeLesson} value={this.state.lesson.user_id}>
                              <option value="" disabled>Teacher</option>
                              {this.state.teachers.map((teacher, i) =>
                                <option key={"teacher" + i} value={teacher._id}>{teacher.firstName} {teacher.lastName}</option>
                              )}
                            </select>
                            {this.state.errors.user_id && <p className="error-message-dropdown">{this.state.errors.user_id}</p>}
                            <div className="section"></div>
                          </div>

                          <div className="input-field col s12 m6 l6">
                            <select className="browser-default" name="type_id" onChange={this.changeLesson} value={this.state.lesson.type_id}>
                              <option value="" disabled>Class Type</option>
                              {this.state.types.map((type, i) =>
                                <option key={"type" + i} value={type._id}>{type.name}</option>
                              )}
                            </select>
                            {this.state.errors.type_id && <p className="error-message-dropdown">{this.state.errors.type_id}</p>}
                            <div className="section"></div>
                          </div>

                          <div className="input-field col s12 m6 l6">
                            <select className="browser-default" name="location_id" onChange={this.changeLesson} value={this.state.lesson.location_id}>
                              <option value="" disabled>Location</option>
                              {this.state.locations.map((location, i) =>
                                <option key={"location" + i} value={location._id}>{location.name}</option>
                              )}
                            </select>
                            {this.state.errors.location_id && <p className="error-message-dropdown">{this.state.errors.location_id}</p>}
                            <div className="section"></div>
                          </div>

                          <div className="input-field col s12 m4 l4">
                            <input name="date" type="text" onChange={this.changeLesson} value={this.state.lesson.date} />
                            <label>Date (DD/MM/YYYY)</label>
                            {this.state.errors.date && <p className="error-message-field">{this.state.errors.date}</p>}
                          </div>

                          <div className="col s12 m4 m4">
                            <div className="input-field col s6 m6 l6">
                              <select className="browser-default" name="startTimeHH" onChange={this.changeLesson} value={this.state.lesson.startTimeHH}>
                                <option value="" disabled>Start HH</option>
                                <option value="04">04</option>
                                <option value="05">05</option>
                                <option value="06">06</option>
                                <option value="07">07</option>
                                <option value="08">08</option>
                                <option value="09">09</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                                <option value="18">18</option>
                                <option value="19">19</option>
                                <option value="20">20</option>
                                <option value="21">21</option>
                              </select>
                            </div>

                            <div className="input-field col s6 m6 l6">
                              <select className="browser-default" name="startTimeMM" onChange={this.changeLesson} value={this.state.lesson.startTimeMM}>
                                <option value="" disabled>Start MM</option>
                                <option value="00">00</option>
                                <option value="05">05</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="25">25</option>
                                <option value="30">30</option>
                                <option value="35">35</option>
                                <option value="40">40</option>
                                <option value="45">45</option>
                                <option value="50">50</option>
                                <option value="55">55</option>
                              </select>
                            </div>
                            {this.state.errors.startTime && <p className="error-message-dropdown">{this.state.errors.startTime}</p>}
                          </div>

                          <div className="col s12 m4 m4">
                            <div className="input-field col s6 m6 l6">
                              <select className="browser-default" name="endTimeHH" onChange={this.changeLesson} value={this.state.lesson.endTimeHH}>
                                <option value="" disabled>End HH</option>
                                <option value="04">04</option>
                                <option value="05">05</option>
                                <option value="06">06</option>
                                <option value="07">07</option>
                                <option value="08">08</option>
                                <option value="09">09</option>
                                <option value="10">10</option>
                                <option value="11">11</option>
                                <option value="12">12</option>
                                <option value="13">13</option>
                                <option value="14">14</option>
                                <option value="15">15</option>
                                <option value="16">16</option>
                                <option value="17">17</option>
                                <option value="18">18</option>
                                <option value="19">19</option>
                                <option value="20">20</option>
                                <option value="21">21</option>
                              </select>
                            </div>

                            <div className="input-field col s6 m6 l6">
                              <select className="browser-default" name="endTimeMM" onChange={this.changeLesson} value={this.state.lesson.endTimeMM}>
                                <option value="" disabled>End MM</option>
                                <option value="00">00</option>
                                <option value="05">05</option>
                                <option value="10">10</option>
                                <option value="15">15</option>
                                <option value="20">20</option>
                                <option value="25">25</option>
                                <option value="30">30</option>
                                <option value="35">35</option>
                                <option value="40">40</option>
                                <option value="45">45</option>
                                <option value="50">50</option>
                                <option value="55">55</option>
                              </select>
                            </div>
                            {this.state.errors.endTime && <p className="error-message-dropdown">{this.state.errors.endTime}</p>}
                          </div>
                        </div>
                        <div className="button-line center-align">
                          <button className="btn waves-effect waves-light green accent-4" type="submit" name="action">
                            Add Class
                          </button>
                        </div>
                        <div className="section"></div>
                      </div>
                    </form>
                  </div>
                )}
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
