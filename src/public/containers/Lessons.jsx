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
      message: ''
    };
  }

  componentDidMount() {
    this.getLessonsList();

    // Display stored message by setting state and remove it from local storage
    this.setState({
      message: localStorage.getItem('lesson')
    });
    localStorage.removeItem('lesson');
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
        {this.state.lessons == null ? (
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
                      <span className="card-title">Teacher: {lesson.user_id}</span>
                      <p>Class Type: {lesson.type_id}</p>
                      <p>Location: {lesson.location_id}</p>
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
