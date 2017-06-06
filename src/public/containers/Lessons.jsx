import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import TeacherCreateLesson from '../../teacher/containers/CreateLesson.jsx';
import AdministratorLessonButtons from '../../administrator/components/LessonButtons.jsx';

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
      locations: null
    };

    this.getLessonsList = this.getLessonsList.bind(this);
    this.getTeachersList = this.getTeachersList.bind(this);
    this.getTypesList = this.getTypesList.bind(this);
    this.getLocationsList = this.getLocationsList.bind(this);
  }

  componentDidMount() {
    this.getLessonsList();
    this.getTeachersList();
    this.getTypesList();
    this.getLocationsList();

    // Display stored message by setting state and remove it from local storage
    this.setState({
      message: localStorage.getItem('lesson')
    });
    localStorage.removeItem('lesson');
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
        {this.state.lessons == null || this.state.teachers == null || this.state.types == null || this.state.locations == null? (
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
                      {/* Search through array of teachers, class types and location in state using findIndex and the _id */}
                      <span className="card-title">Teacher: {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id==lesson.user_id))].firstName} {this.state.teachers[(this.state.teachers.findIndex(teacher => teacher._id==lesson.user_id))].lastName}</span>
                      <p>Class Type: {this.state.types[(this.state.types.findIndex(type => type._id==lesson.type_id))].name}</p>
                      <p>Location: {this.state.locations[(this.state.locations.findIndex(location => location._id==lesson.location_id))].name}</p>
                    </div>
                  </div>
                </div>
                {/* Admin section to edit class type */}
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
      </div>
    );
  }
}

export default Lessons;
