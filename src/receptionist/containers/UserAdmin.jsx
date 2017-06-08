import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import TeacherCreateLesson from '../../teacher/containers/CreateLesson.jsx';
import AdministratorLessonButtons from '../../administrator/components/LessonButtons.jsx';
import _ from 'lodash'
import Collapsible from 'react-collapsible';
import moment from 'moment'
import { Link } from 'react-router-dom';

class UserAdmin extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      message: '',
      lessons: null,
      teachers: null,
      types: null,
      locations: null,
      filters: {
        firstName: '',
        lastName: ''
      },
      filteredUsers: null,
      attendances: null,
      users: null,
      lessonsToday: null,
      lesson_id: {}
    };

    this.getLessonsList = this.getLessonsList.bind(this);
    this.getTeachersList = this.getTeachersList.bind(this);
    this.getTypesList = this.getTypesList.bind(this);
    this.getLocationsList = this.getLocationsList.bind(this);
    this.filterUsers = this.filterUsers.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.bookLesson = this.bookLesson.bind(this);
    this.unbookLesson = this.unbookLesson.bind(this);
    this.getAttendances = this.getAttendances.bind(this);
    this.getUsersList = this.getUsersList.bind(this);
    this.getLessonsToday = this.getLessonsToday.bind(this);
    this.changeLesson = this.changeLesson.bind(this);
  }

  componentDidMount() {
    this.getLessonsList();
    this.getTeachersList();
    this.getTypesList();
    this.getLocationsList();
    this.getAttendances();
    this.getUsersList();

    // Display stored message by setting state and remove it from local storage
    this.setState({
      message: localStorage.getItem('useradmin')
    });
    localStorage.removeItem('useradmin');
  }

  componentDidUpdate() {
    // update the filtered lessons state
    this.filterUsers();
    // get today's lessons
    this.getLessonsToday();
  }

  bookLesson(user_id, lesson_id) {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', `http://server.greenyoga.com.au/api/v1/attendances?user_id=${user_id}&lesson_id=${lesson_id}`);
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
        localStorage.setItem('useradmin', xhr.response.message);

        // redirect user after making booking to lessons page
        window.location.reload();
      } else {
        // failure

        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send();
  }

  unbookLesson(user_id, lesson_id) {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('delete', `http://server.greenyoga.com.au/api/v1/attendances/check?user_id=${user_id}&lesson_id=${lesson_id}`);
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
        localStorage.setItem('useradmin', xhr.response.message);

        // redirect user after making booking to lessons page
        window.location.reload();
      } else {
        // failure

        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send();
  }

  // filter lessons based on user input
  filterUsers() {
    // only run when all data has been loaded
    if (this.state.lessons == null || this.state.teachers == null || this.state.types == null || this.state.locations == null || this.state.users == null) {
      null
    } else {
      // set up variables holding the filters
      const firstName = this.state.filters.firstName
      const lastName = this.state.filters.lastName
      // filter the users based on conditions supplied
      const filtered = (this.state.users).filter(function(user){
        return (user.firstName).toLowerCase().includes(firstName.toLowerCase()) && (user.lastName).toLowerCase().includes(lastName.toLowerCase())
      });

      // only update state if the previous filtered users and the new one differs (prevent infinite loop)
      if (!_.isEqual(this.state.filteredUsers, filtered)) {
        this.setState({
          filteredUsers: filtered
        })
      }
    }
  }

  // update the filter as the user selects
  changeFilter(event) {
    const field = event.target.name;
    const filters = this.state.filters;
    filters[field] = event.target.value;

    this.setState({
      filters
    });
  }

  // update the class_id as the user selects
  changeLesson(event) {
    const user_id = event.target.name;
    const lesson_id = this.state.lesson_id;
    lesson_id[user_id] = event.target.value;

    this.setState({
      lesson_id
    });
  }

  // get attendances for current logged in user
  getAttendances() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://server.greenyoga.com.au/api/v1/attendances');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // success

      // organise the attendances JSON for each user to have an array of attendances stored to their key
      const attendances = {};
      (xhr.response.attendances).forEach((attendance) => {
        if (attendances[attendance.user_id] == null) {
          attendances[attendance.user_id] = [attendance.lesson_id]
        } else {
          attendances[attendance.user_id].push(attendance.lesson_id)
        }
      });
      // change the component-container state
      this.setState({
        errors: {},
        attendances
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

  getLessonsList() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://server.greenyoga.com.au/api/v1/lessons');
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

  getLessonsToday() {
    if (this.state.lessons == null) {
      null
    } else {
      // set up string for today as filter
      const today = moment().format("DD/MM/YYYY")
      // filter for today's lesson only
      const filtered = (this.state.lessons).filter(function(lesson){
        return (lesson.date === today)
      });

      // only update state if the previous filtered lessons and the new one differs (prevent infinite loop)
      if (!_.isEqual(this.state.lessonsToday, filtered)) {
        this.setState({
          lessonsToday: filtered
        })
      }
    }
  }

  getUsersList() {
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://server.greenyoga.com.au/api/v1/users');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    // set the authorization HTTP header
    xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      // success
      // change the component-container state
      this.setState({
        errors: {},
        users: xhr.response.users
      });
    });
    xhr.send();
  }

  render() {
    return (
      <div>
        <div className="section"></div>
        <p className="message center-align">{this.state.message}</p>
        <h4>User Administration</h4>
        <h6>Edit user details and sign in users to classes from here:</h6>
        <div className="section"></div>

        {(this.state.lessons == null || this.state.teachers == null || this.state.types == null || this.state.locations == null || this.state.filteredUsers == null || this.state.attendances == null || this.state.users == null || this.state.lessonsToday == null) ? (
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        ) : (
          <div>
            <div className="row">
              <div className="input-field col s12 m6 l6">
                <input name="firstName" type="text" onChange={this.changeFilter} value={this.state.filters.firstName} />
                <label className="active">First Name</label>
              </div>
              <div className="input-field col s12 m6 l6">
                <input name="lastName" type="text" onChange={this.changeFilter} value={this.state.filters.lastName} />
                <label className="active">Last Name</label>
              </div>
            </div>
            <div className="row">
              <div className="userstitle">
                <Collapsible trigger={
                  <div className="row">
                    <div className="col s12 m2 l2">
                      D.O.B.
                    </div>
                    <div className="col s12 m3 l3">
                      Full Name
                    </div>
                    <div className="col s12 m5 l5">
                      Email
                    </div>
                    <div className="col s12 m2 l2">
                    </div>
                  </div>
                    }></Collapsible>
              </div>
              {this.state.filteredUsers.map((user, i) =>
                <div key={i} className={(i%2 === 0) ? ("userseven") : ("usersodd")}>
                  <Collapsible trigger={
                    <div className="row">
                      <div className="col s12 m2 l2">
                        {user.dob}
                      </div>
                      <div className="col s12 m3 l3">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="col s12 m5 l5">
                        {user.email}
                      </div>
                      <div className="col s12 m2 l2">
                        <button className="btn booking-btn waves-effect waves-light">
                          Manage
                        </button>
                      </div>
                    </div>
                    }>
                    <div className="row">
                      <div className="col s12 m12 l12 center-align">
                        <h5>Sign in/sign out from class:</h5><br />
                      </div>
                      <div className="col s12 m8 l8 center-align">
                        <select name={user._id} className="browser-default" onChange={this.changeLesson} value={this.state.lesson_id[user._id]}>
                          <option value="">Select Class:</option>
                            {this.state.lessonsToday.map((lesson, i) =>
                              (this.state.attendances[user._id] == null) ? (
                                <option key={"lesson" + i} value={"+" + lesson._id}>{this.state.locations[(this.state.locations.findIndex(location => location._id===lesson.location_id))].name} - {lesson.startTime} ({this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].firstName} {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].lastName})</option>
                              ) : (
                                (this.state.attendances[user._id].indexOf(lesson._id) === -1) ? (
                                  <option key={"lesson" + i} value={"+" + lesson._id}>{this.state.locations[(this.state.locations.findIndex(location => location._id===lesson.location_id))].name} - {lesson.startTime} ({this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].firstName} {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].lastName})</option>
                                ) : (
                                  <option key={"lesson" + i} value={"-" + lesson._id}>{this.state.locations[(this.state.locations.findIndex(location => location._id===lesson.location_id))].name} - {lesson.startTime} ({this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].firstName} {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].lastName}) - Booked</option>
                                )
                              )
                            )}
                        </select>
                      </div>
                      <div className="col s12 m4 l4 center-align">
                        {(this.state.lesson_id[user._id] == null || this.state.lesson_id[user._id] == "") ? (
                          <a className="btn disabled">Select Booking</a>
                        ) : (
                          (this.state.lesson_id[user._id].substring(0, 1) === "+") ? (
                            <button className="btn waves-effect waves-light" onClick={() => { this.bookLesson((user._id), ((this.state.lesson_id[user._id]).substring(1, (this.state.lesson_id[user._id]).length))) }}>
                              Sign into Class
                            </button>
                          ) : (
                            <button className="btn waves-effect waves-light red accent-1" onClick={() => { this.unbookLesson((user._id), ((this.state.lesson_id[user._id]).substring(1, (this.state.lesson_id[user._id]).length))) }}>
                              Cancel Booking
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  </Collapsible>
                </div>
              )}
            </div>
          </div>

        )}
      </div>
    );
  }
}

export default UserAdmin;
