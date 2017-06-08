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
      users: null
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
      message: localStorage.getItem('lesson')
    });
    localStorage.removeItem('lesson');
  }

  componentDidUpdate() {
    // update the filtered lessons state
    this.filterUsers()
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
        localStorage.setItem('lesson', xhr.response.message);

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
        localStorage.setItem('lesson', xhr.response.message);

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
      // filter the lessons based on conditions supplied
      const filtered = (this.state.users).filter(function(user){
        return (user.firstName).toLowerCase().includes(firstName.toLowerCase()) && (user.lastName).toLowerCase().includes(lastName.toLowerCase())
      });

      // only update state if the previous filtered lessons and the new one differs (prevent infinite loop)
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

  // get attendances for current logged in user
  getAttendances() {
    if (Auth.isUserAuthenticated()) {
      // create an AJAX request
      const xhr = new XMLHttpRequest();
      xhr.open('GET', `http://server.greenyoga.com.au/api/v1/attendances/user/${Auth.getUser().id}`);
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        // success
        // change the component-container state
        if (xhr.response.attendances === []) {
          this.setState({
            errors: {},
            attendances: xhr.response.attendances
          });
        } else {
          // Store only the lesson_id in state
          const attendances = [];
          (xhr.response.attendances).forEach(function(attendance) {
            attendances.push(attendance.lesson_id)
          });
          this.setState({
            errors: {},
            attendances: attendances
          });
        }
      });
      xhr.send();
    } else {
      this.setState({
        errors: {},
        attendances: []
      });
    }
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
        {/* <h4>Classes</h4> */}
        <h6>Edit user details and sign in users to classes from here:</h6>
        <div className="section"></div>

        {(this.state.lessons == null || this.state.teachers == null || this.state.types == null || this.state.locations == null || this.state.filteredUsers == null || this.state.attendances == null || this.state.users == null) ? (
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
                    <div className="col s12 m6 l6">
                      Address
                    </div>
                    <div className="col s12 m1 l1">
                    </div>
                  </div>
                    }></Collapsible>
              </div>
              {this.state.filteredUsers.map((user, i) =>
                <div key={i}>
                  <div className={(i%2 === 0) ? ("userseven") : ("usersodd")}>
                    <Collapsible trigger={
                      <div className="row">
                        <div className="col s12 m2 l2">
                          {user.dob}
                        </div>
                        <div className="col s12 m3 l3">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="col s12 m6 l6">
                          {user.line1} {(user.line2 !== null) ? (`${user.line2}`) : (null)} {user.suburb} {user.state} {user.pcode}
                        </div>
                        <div className="col s12 m1 l1">
                          <Link to={"#"}><i className="material-icons">mode_edit</i></Link>
                        </div>
                      </div>
                      }></Collapsible>
                  </div>
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
