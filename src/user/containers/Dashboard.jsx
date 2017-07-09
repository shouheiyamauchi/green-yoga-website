import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import Collapsible from 'react-collapsible';
import BookedClasses from '../../public/components/BookedClasses.jsx'
import Modal from 'react-awesome-modal';

const timetableHeader = <div className="collapsible-header"><i className="material-icons">event_note</i>My Timetable</div>
const passesHeader = <div className="collapsible-header"><i className="material-icons">card_membership</i>My Current Passes</div>
const purchasesHeader = <div className="collapsible-header"><i className="material-icons">attach_money</i>My Purchase History</div>
const detailsHeader = <div className="collapsible-header"><i className="material-icons">person_pin</i>My Details</div>

class DashboardPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errors: {},
      secretData: '',
      user: {},
      lessons: null,
      message: '',
      teachers: null,
      types: null,
      locations: null,
      attendances: null,
      modalVisible: false,
      modalContent: ''
    };

    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.getAttendances = this.getAttendances.bind(this);
    this.getLessonsList = this.getLessonsList.bind(this);
    this.getTeachersList = this.getTeachersList.bind(this);
    this.getTypesList = this.getTypesList.bind(this);
    this.getLocationsList = this.getLocationsList.bind(this);
    this.unbookLesson = this.unbookLesson.bind(this);
  }

  componentDidMount() {
    // fill out user information in state
    this.setState ({
      user: Auth.getUser()
    });
    this.getLessonsList();
    this.getTeachersList();
    this.getTypesList();
    this.getLocationsList();
    this.getAttendances();
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

  // get attendances for current logged in user
  getAttendances() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://server.greenyoga.com.au/api/v1/attendances/user/${Auth.getUser().id}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // success
      // change the component-container state
      this.setState({
        errors: {},
        attendances: xhr.response.attendances
      });
    });
    xhr.send();
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

  getLessonsList() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://server.greenyoga.com.au/api/v1/lessons');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // success
      // change the component-container state
      this.setState({
        errors: {},
        lessons: xhr.response.lessons
      });
    });
    xhr.send();
  }

  unbookLesson(user_id, lesson_id) {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('delete', `https://server.greenyoga.com.au/api/v1/attendances/check?user_id=${user_id}&lesson_id=${lesson_id}`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        // change the component-container state
        this.setState({
          errors: {}
        });
        this.openModal(xhr.response.message);
        this.getAttendances();
      } else {
        // failure

        const errors = xhr.response.errors ? xhr.response.errors : {};
        this.setState({
          errors
        });
        this.openModal(xhr.response.message);
      }
    });
    xhr.send();
  }

  // submission of form
  processForm(event) {
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();

    // create a string for an HTTP body message

    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const role = encodeURIComponent(this.state.user.role);
    const firstName = encodeURIComponent(this.state.user.firstName);
    const lastName = encodeURIComponent(this.state.user.lastName);
    const dob = encodeURIComponent(this.state.user.dob);
    const line1 = encodeURIComponent(this.state.user.line1);
    const line2 = encodeURIComponent(this.state.user.line2);
    const suburb = encodeURIComponent(this.state.user.suburb);
    const state = encodeURIComponent(this.state.user.state);
    const pcode = encodeURIComponent(this.state.user.pcode);
    const description = encodeURIComponent(this.state.user.description);
    let formData = `email=${email}&password=${password}&role=${role}&firstName=${firstName}&lastName=${lastName}&dob=${dob}&line1=${line1}&line2=${line2}&suburb=${suburb}&state=${state}&pcode=${pcode}&description=${description}`;

    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', 'https://server.greenyoga.com.au/api/v1/auth/signup');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // set a message
        localStorage.setItem('dashboard', xhr.response.message);

        // save user details into local storage
        Auth.storeUser(JSON.stringify(xhr.response.user));

        // redirect user after sign up to login page
        this.props.history.push('/dashboard');
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
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  render() {
    return (
      <div>
        <Modal visible={this.state.modalVisible} effect="fadeInUp" onClickAway={() => this.closeModal()}>
          <div className="modal-container center-align">
            <p>{this.state.modalContent}</p>
            <button onClick={() => this.closeModal()} className="btn waves-effect waves-light grey darken-1">
              Okay
            </button>
          </div>
        </Modal>
        <div className="section"></div>
        <p className="message center-align">{this.state.message}</p>
        <h4>Dashboard</h4>
        <div className="section"></div>
        <div className="collapsible">
          <Collapsible trigger={timetableHeader} open={(this.state.lessons == null || this.state.teachers == null || this.state.types == null || this.state.locations == null || this.state.attendances == null) ? (false) : (true)}>
            <div className="section"></div>
            <div className="dashboard-container">
              <div>
                {(this.state.lessons == null || this.state.teachers == null || this.state.types == null || this.state.locations == null || this.state.attendances == null) ? (
                  <div className="spinner">
                    <div className="bounce1"></div>
                    <div className="bounce2"></div>
                    <div className="bounce3"></div>
                  </div>
                ) : (
                  <BookedClasses user_id={Auth.getUser().id} attendances={this.state.attendances} lessons={this.state.lessons} types={this.state.types} teachers={this.state.teachers} locations={this.state.locations} unbookLesson={(user_id, lesson_id) => this.unbookLesson(user_id, lesson_id)} />
                )}
              </div>
              <div className="section"></div>
          </div>
          </Collapsible>
        </div>
        <div className="collapsible">
          <Collapsible trigger={passesHeader}>
            <div className="section"></div>
            <div className="container">
              <div className="row">

              </div>
              <div className="section"></div>
          </div>
          </Collapsible>
        </div>
        <div className="collapsible">
          <Collapsible trigger={purchasesHeader}>
            <div className="section"></div>
            <div className="container">
              <div className="row">

              </div>
              <div className="section"></div>
          </div>
          </Collapsible>
        </div>
        <div className="collapsible">
          <Collapsible trigger={detailsHeader}>
            <div className="section"></div>
            <form action="/" onSubmit={this.processForm}>
              <div className="container">
                <div className="row">
                  {this.state.errors.summary && <p className="error-message-main">{this.state.errors.summary}</p>}

                  <div className="input-field col s12 m6 l6">
                    <input name="firstName" type="text" onChange={this.changeUser} value={this.state.user.firstName} />
                    <label className="active">First Name</label>
                    {this.state.errors.firstName && <p className="error-message-field">{this.state.errors.firstName}</p>}
                  </div>

                  <div className="input-field col s12 m6 l6">
                    <input name="lastName" type="text" onChange={this.changeUser} value={this.state.user.lastName} />
                    <label className="active">Last Name</label>
                    {this.state.errors.lastName && <p className="error-message-field">{this.state.errors.lastName}</p>}
                  </div>

                  <div className="input-field col s12 m6 l6">
                    <input name="dob" type="text" onChange={this.changeUser} value={this.state.user.dob} />
                    <label className="active">D.O.B. (DD/MM/YYYY)</label>
                    {this.state.errors.dob && <p className="error-message-field">{this.state.errors.dob}</p>}
                  </div>

                  <div className="input-field col s12 m6 l6">
                    <input name="role" type="text" onChange={this.changeUser} value={this.state.user.role} />
                    <label className="active">Role</label>
                    {this.state.errors.role && <p className="error-message-field">{this.state.errors.role}</p>}
                  </div>

                  <div className="input-field col s12 m12 l12">
                    <input name="email" type="text" onChange={this.changeUser} value={this.state.user.email} />
                    <label className="active">Email</label>
                    {this.state.errors.email && <p className="error-message-field">{this.state.errors.email}</p>}
                  </div>

                  <div className="input-field col s12 m12 l12">
                    <input name="password" type="password" onChange={this.changeUser} value={this.state.user.password} />
                    <label className="active">Password</label>
                    {this.state.errors.password && <p className="error-message-field">{this.state.errors.password}</p>}
                  </div>

                  <div className="input-field col s12 m12 l12">
                    <input name="line1" type="text" onChange={this.changeUser} value={this.state.user.line1} />
                    <label className="active">Address Line 1</label>
                    {this.state.errors.line1 && <p className="error-message-field">{this.state.errors.line1}</p>}
                  </div>

                  <div className="input-field col s12 m12 l12">
                    <input name="line2" type="text" onChange={this.changeUser} value={this.state.user.line2} />
                    <label className="active">Address Line 2</label>
                    {this.state.errors.line2 && <p className="error-message-field">{this.state.errors.line2}</p>}
                  </div>

                  <div className="input-field col s12 m12 l12">
                    <input name="suburb" type="text" onChange={this.changeUser} value={this.state.user.suburb} />
                    <label className="active">Suburb</label>
                    {this.state.errors.suburb && <p className="error-message-field">{this.state.errors.suburb}</p>}
                  </div>

                  <div className="input-field col s12 m6 l6">
                    <select className="browser-default" name="state" onChange={this.changeUser} value={this.state.user.state}>
                      <option value="" disabled>State</option>
                      <option value="ACT">Australian Capital Territory</option>
                      <option value="NSW">New South Wales</option>
                      <option value="NT">Northern Territory</option>
                      <option value="QLD">Queensland</option>
                      <option value="SA">South Australia</option>
                      <option value="TAS">Tasmania</option>
                      <option value="VIC">Victoria</option>
                      <option value="WA">Western Australia</option>
                    </select>
                  </div>

                  <div className="input-field col s12 m6 l6">
                    <input name="pcode" type="text" onChange={this.changeUser} value={this.state.user.pcode} />
                    <label className="active">Post Code</label>
                    {this.state.errors.pcode && <p className="error-message-field">{this.state.errors.pcode}</p>}
                  </div>

                  <div className="input-field col s12 m12 l12">
                    <textarea name="description" className="materialize-textarea" onChange={this.changeUser} value={this.state.user.description} />
                    <label className="active">Description</label>
                    {this.state.errors.description && <p className="error-message-field">{this.state.errors.description}</p>}
                  </div>
                </div>
              </div>
              <div className="button-line center-align">
                <button className="btn waves-effect waves-light" type="submit" name="action">
                  Edit Account Details
                </button>
              </div>
            </form>
            <div className="section"></div>
          </Collapsible>
        </div>
      </div>
    );
  }

}

export default DashboardPage;
