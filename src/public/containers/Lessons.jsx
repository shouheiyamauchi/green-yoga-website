import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import TeacherCreateLesson from '../../teacher/containers/CreateLesson.jsx';
import AdministratorLessonButtons from '../../administrator/components/LessonButtons.jsx';
import _ from 'lodash'
import Collapsible from 'react-collapsible';
import moment from 'moment'

class Lessons extends Component {
  constructor(props, context) {
    super(props, context);

    // set the initial component state
    this.state = {
      errors: {},
      lessons: null,
      message: '',
      teachers: null,
      types: null,
      locations: null,
      filters: {
        startDate: "07/06/2017",
        dates: '',
        user_id: '',
        type_id: '',
        location_id:'',
      },
      filteredLessons: null,
      attendances: null
    };

    this.getLessonsList = this.getLessonsList.bind(this);
    this.getTeachersList = this.getTeachersList.bind(this);
    this.getTypesList = this.getTypesList.bind(this);
    this.getLocationsList = this.getLocationsList.bind(this);
    this.filterLessons = this.filterLessons.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.setDates = this.setDates.bind(this);
    this.bookLesson = this.bookLesson.bind(this);
    this.unbookLesson = this.unbookLesson.bind(this);
    this.getAttendances = this.getAttendances.bind(this);
  }

  componentDidMount() {
    this.getLessonsList();
    this.getTeachersList();
    this.getTypesList();
    this.getLocationsList();
    this.getAttendances();

    // Display stored message by setting state and remove it from local storage
    this.setState({
      message: localStorage.getItem('lesson')
    });
    localStorage.removeItem('lesson');
  }

  componentDidUpdate() {
    // update the filtered lessons state
    this.setDates()
    this.filterLessons()
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

  // function to set up array of filter dates
  setDates() {
    const dateFormat = "DD/MM/YYYY";
    if (moment(this.state.filters.startDate, dateFormat).isValid()) {
      const startDate = moment(this.state.filters.startDate, dateFormat);
      const days = [];
      let day = startDate;
      for (let i = 0; i < 7; i++) {
          days.push(day.format(dateFormat));
          day = day.clone().add(1, 'd');
      }
      const filters = this.state.filters
      filters.dates = days
      // only update state if the previous filtered lessons and the new one differs (prevent infinite loop)
      if (!_.isEqual(this.state.filters.dates, days)) {
        this.setState({
          filters
        })
      }
    }
  }

  // filter lessons based on user input
  filterLessons() {
    // only run when all data has been loaded
    if (this.state.lessons == null || this.state.teachers == null || this.state.types == null || this.state.locations == null) {
      null
    } else {
      // set up variables holding the filters
      const user_id = this.state.filters.user_id
      const type_id = this.state.filters.type_id
      const location_id = this.state.filters.location_id
      // filter the lessons based on conditions supplied
      const filtered = (this.state.lessons).filter(function(lesson){
        return (lesson.user_id).includes(user_id) && (lesson.type_id).includes(type_id) && (lesson.location_id).includes(location_id)
      });

      // apply the date filter
      // get array of dates
      const dates = this.state.filters.dates
      const dateFiltered = []

      const dateFormat = "DD/MM/YYYY";

      // add to a new array the events matching the dates as per the dates array
      dates.forEach(function(date) {
        const details = {
          date: moment(date, dateFormat).format('ddd MMM DD'),
          events: []
        };
        details.events = (filtered.filter(function(lesson){ return lesson.date === date}));
        dateFiltered.push(details);
      });

      // only update state if the previous filtered lessons and the new one differs (prevent infinite loop)
      if (!_.isEqual(this.state.filteredLessons, dateFiltered)) {
        this.setState({
          filteredLessons: dateFiltered
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

  render() {
    return (
      <div>
        <div className="section"></div>
        <p className="message center-align">{this.state.message}</p>
        <h4>Classes</h4>
        <h6>You can book your classes through here.</h6>
        <div className="section"></div>

        {/* Admin section to create class type */}
        {
          (Auth.isUserAuthenticated()) ? (
            <TeacherCreateLesson />
          ) : (
            null
          )
        }

        {(this.state.lessons == null || this.state.teachers == null || this.state.types == null || this.state.locations == null || this.state.filteredLessons == null || this.state.attendances == null) ? (
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        ) : (
          <div>
            <div className="row">
              <div className="input-field col s12 m3 l3">
                <input name="startDate" type="text" onChange={this.changeFilter} value={this.state.filters.startDate} />
                <label className="active">Start Date</label>
              </div>

              <div className="input-field col s12 m3 l3">
                <select className="browser-default" name="user_id" onChange={this.changeFilter} value={this.state.filters.user_id}>
                  <option value="">Select Teacher:</option>
                  {this.state.teachers.map((teacher, i) =>
                    <option key={"teacher" + i} value={teacher._id}>{teacher.firstName} {teacher.lastName}</option>
                  )}
                </select>
                <div className="section"></div>
              </div>
              <div className="input-field col s12 m3 l3">
                <select className="browser-default" name="type_id" onChange={this.changeFilter} value={this.state.filters.type_id}>
                  <option value="">Select Class Type:</option>
                  {this.state.types.map((type, i) =>
                    <option key={"type" + i} value={type._id}>{type.name}</option>
                  )}
                </select>
                <div className="section"></div>
              </div>
              <div className="input-field col s12 m3 l3">
                <select className="browser-default" name="location_id" onChange={this.changeFilter} value={this.state.filters.location_id}>
                  <option value="">Select Location:</option>
                  {this.state.locations.map((location, i) =>
                    <option key={"location" + i} value={location._id}>{location.name}</option>
                  )}
                </select>
                <div className="section"></div>
              </div>
            </div>
            <div className="row">
              {this.state.filteredLessons.map((lessonObj, i) =>
                <div key={i}>
                  <div className="classestitle">
                    <Collapsible trigger={lessonObj.date}></Collapsible>
                  </div>
                  {(lessonObj.events.length === 0) ? (
                    <div className="classeseven">
                      <Collapsible trigger={
                        <div className="row">
                          <div className="col s12 m12 l12 center-align">
                            No Classes
                          </div>
                        </div>
                      }/>
                    </div>
                    ) : (
                    lessonObj.events.map((lesson, i) =>
                      <div key={lesson._id} className={(i%2 === 0) ? ("classeseven") : ("classesodd")}>
                        <Collapsible trigger={
                          <div className="row">
                            <div className="col s6 m2 l2">
                              {lesson.startTime} ~ {lesson.endTime}
                            </div>
                            {/* Search through array of teachers, class types and location in state using findIndex and the _id */}
                            <div className="col s6 m3 l3">
                              {this.state.types[(this.state.types.findIndex(type => type._id===lesson.type_id))].name}<br />
                            </div>
                            <div className="col s6 m3 l3">
                              {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].firstName} {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].lastName}
                            </div>
                            <div className="col s6 m2 l2">
                              {this.state.locations[(this.state.locations.findIndex(location => location._id===lesson.location_id))].name}
                            </div>
                            <div className="col s12 m2 l2">
                              <div className="center-align">
                                {(this.state.attendances.indexOf(lesson._id) === -1) ? (
                                  <button className="btn booking-btn waves-effect waves-light">
                                    Book
                                  </button>
                                ) : (
                                  <button className="btn booking-btn waves-effect waves-light red accent-1">
                                    Cancel
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          }>
                          <div className="row">
                            <div className="col s3 m2 l2">
                              <img src={this.state.types[(this.state.types.findIndex(type => type._id===lesson.type_id))].image} alt="" className="circle responsive-img" />
                            </div>
                            <div className="col s9 m9 l9">
                              {this.state.types[(this.state.types.findIndex(type => type._id===lesson.type_id))].name}<br />
                              {this.state.types[(this.state.types.findIndex(type => type._id===lesson.type_id))].description}<br /><br />
                            </div>
                            <div className="col s0 m1 l1">
                            </div>
                          </div>
                          <div className="row">
                            <div className="col s3 m2 l2">
                              {/* Insert avatar of teacher here */}
                            </div>
                            <div className="col s9 m9 l9">
                              Meet {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].firstName}<br />
                              {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].description}
                            </div>
                            <div className="col s0 m1 l1">
                            </div>
                          </div>
                          <div className="row">
                            <div className="col s12 m12 l12">
                              <div className="center-align">
                                {(this.state.attendances.indexOf(lesson._id) === -1) ? (
                                  <button className="btn waves-effect waves-light" onClick={() => { this.bookLesson((Auth.getUser().id), (lesson._id)) }}>
                                    Make a Booking
                                  </button>
                                ) : (
                                  <button className="btn waves-effect waves-light red accent-1" onClick={() => { this.unbookLesson((Auth.getUser().id), (lesson._id)) }}>
                                    Cancel a Booking
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {
                            (Auth.isUserAuthenticated()) ? (
                              <div>
                                <div className="divider"></div>
                                <AdministratorLessonButtons id={lesson._id} />
                              </div>
                            ) : (
                              null
                            )
                          }
                        </Collapsible>
                      </div>
                      )
                  )}
                  <div className="section"></div>
                </div>
              )}
            </div>
          </div>

        )}

        {/* Cards displaying all classes */}
        {/*
        {(this.state.lessons == null || this.state.teachers == null || this.state.types == null || this.state.locations == null) ? (
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        ) : (
          this.state.lessons.map((lesson, i) =>
          <div key={i} className="col s12 m12">
            <div className="card">
              <div className="card-stacked">
                <div className="card-content">
                  <div className="row valign-wrapper">
                    <div className="col s3">
                      <p>{lesson.date}</p>
                      <p>{lesson.startTime}, {lesson.endTime}</p>
                    </div>
                    <div className="col s9">
                      <span className="card-title">Teacher: {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].firstName} {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].lastName}</span>
                      <p>Class Type: {this.state.types[(this.state.types.findIndex(type => type._id===lesson.type_id))].name}</p>
                      <p>Location: {this.state.locations[(this.state.locations.findIndex(location => location._id===lesson.location_id))].name}</p>
                    </div>
                  </div>
                </div>
                {
                  (Auth.isUserAuthenticated()) ? (
                    <AdministratorLessonButtons id={lesson._id} />
                  ) : (
                    null
                  )
                }
              </div>
            </div>
          </div>
        ))}
        */}
      </div>
    );
  }
}

export default Lessons;
