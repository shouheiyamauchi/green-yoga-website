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
        startDate: '',
        dates: '',
        user_id: '',
        type_id: '',
        location_id:'',
      },
      filteredLessons: null
    };

    this.getLessonsList = this.getLessonsList.bind(this);
    this.getTeachersList = this.getTeachersList.bind(this);
    this.getTypesList = this.getTypesList.bind(this);
    this.getLocationsList = this.getLocationsList.bind(this);
    this.filterLessons = this.filterLessons.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
  }

  componentDidMount() {
    this.getLessonsList();
    this.getTeachersList();
    this.getTypesList();
    this.getLocationsList();
    this.setDates()

    // Display stored message by setting state and remove it from local storage
    this.setState({
      message: localStorage.getItem('lesson')
    });
    localStorage.removeItem('lesson');
  }

  componentDidUpdate() {
    // update the filtered lessons state
    this.filterLessons()
  }

  setDates() {
    const dateFormat = "DD/MM/YYYY";
    const startDate = moment();
    const endDate = moment().add(6, 'days');
    const days = [];
    let day = startDate;
    console.log("start date: ",startDate, " end date: ",endDate)
    while (day <= endDate) {
        days.push(day.format(dateFormat));
        console.log(day.format(dateFormat))
        day = day.clone().add(1, 'd');
    }
    const filters = this.state.filters
    filters.dates = days
    this.setState({
      filters
    })
  }

  filterLessons() {
    // only run when all data has been loaded
    if (this.state.lessons == null || this.state.teachers == null || this.state.types == null || this.state.locations == null) {
      null
    } else {
      // set up variables holding the filters
      const user_id = this.state.filters.user_id
      const date = this.state.filters.date //  && (lesson.date).includes(date)
      const type_id = this.state.filters.type_id
      const location_id = this.state.filters.location_id
      // filter the lessons based on conditions supplied
      const filtered = (this.state.lessons).filter(function(lesson){
        return (lesson.user_id).includes(user_id) && (lesson.type_id).includes(type_id) && (lesson.location_id).includes(location_id)
      });

      const dates = this.state.filters.dates
      const dateFiltered = []

      dates.forEach(function(date) {
          dateFiltered.push(filtered.filter(function(lesson){ return lesson.date === date}))
      });

      // only update state if the previous filtered lessons and the new one differs (prevent infinite loop)
      if (!_.isEqual(this.state.filteredLessons, filtered)) {
        this.setState({
          filteredLessons: filtered
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

        {(this.state.lessons == null || this.state.teachers == null || this.state.types == null || this.state.locations == null || this.state.filteredLessons == null) ? (
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        ) : (
          <div>
            <div className="row">
              <div className="input-field col s12 m4 l4">
                <select className="browser-default" name="user_id" onChange={this.changeFilter} value={this.state.filters.user_id}>
                  <option value="">Select Teacher:</option>
                  {this.state.teachers.map((teacher, i) =>
                    <option key={"teacher" + i} value={teacher._id}>{teacher.firstName} {teacher.lastName}</option>
                  )}
                </select>
                <div className="section"></div>
              </div>
              <div className="input-field col s12 m4 l4">
                <select className="browser-default" name="type_id" onChange={this.changeFilter} value={this.state.filters.type_id}>
                  <option value="">Select Class Type:</option>
                  {this.state.types.map((type, i) =>
                    <option key={"type" + i} value={type._id}>{type.name}</option>
                  )}
                </select>
                <div className="section"></div>
              </div>
              <div className="input-field col s12 m4 l4">
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


                <div className="classestitle">
                  <Collapsible trigger={"TITLE"}></Collapsible>
                </div>

                

              {this.state.filteredLessons.map((lesson, i) =>
                <div key={i} className={(i%2 == 0) ? ("classeseven") : ("classesodd")}>
                  <Collapsible trigger={
                    <div className="row">
                      <div className="col s6 m2 l2">
                        {lesson.date}<br />
                        {lesson.startTime} ~ {lesson.endTime}
                      </div>
                      {/* Search through array of teachers, class types and location in state using findIndex and the _id */}
                      <div className="col s6 m3 l3">
                        {this.state.types[(this.state.types.findIndex(type => type._id===lesson.type_id))].name}<br />
                      </div>
                      <div className="col s6 m3 l3">
                        {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].firstName} {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].lastName}
                      </div>
                      <div className="col s6 m3 l3">
                        {this.state.locations[(this.state.locations.findIndex(location => location._id===lesson.location_id))].name}
                      </div>
                      <div className="col s6 m1 l1">
                        <button className="btn booking-btn waves-effect waves-light" type="submit" name="action">
                          Book
                        </button>
                      </div>
                    </div>
                    }>
                    <div className="row">
                      <div className="col s6 m2 l2">
                      </div>
                      <div className="col s6 m9 l9">
                        {this.state.types[(this.state.types.findIndex(type => type._id===lesson.type_id))].name}<br />
                        {this.state.types[(this.state.types.findIndex(type => type._id===lesson.type_id))].description}<br /><br />
                        Meet {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].firstName}<br />
                      {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id===lesson.user_id))].description}
                      </div>
                      <div className="col s6 m1 l1">
                      </div>
                    </div>

                    {
                      (Auth.isUserAuthenticated()) ? (
                        <AdministratorLessonButtons id={lesson._id} />
                      ) : (
                        null
                      )
                    }
                  </Collapsible>
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
