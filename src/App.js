import React, { Component } from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect
} from 'react-router-dom'
import Slider from 'react-slick'

// import authentication storage functions
import Auth from './modules/Auth';

// import pages available to all visitors
import HomePage from './public/containers/HomePage.jsx';
import LoginPage from './public/containers/LoginPage.jsx';
import LogoutFunction from './public/containers/LogoutFunction.jsx';
import SignupPage from './public/containers/SignupPage.jsx';
import Lessons from './public/containers/Lessons.jsx';
import Locations from './public/containers/Locations.jsx';
import Types from './public/containers/Types.jsx';

// import pages available only for signed in users
import Dashboard from './user/containers/Dashboard.jsx';

// import pages available only for administrators
import AdministratorEditType from './administrator/containers/EditType.jsx';
import AdministratorEditLesson from './administrator/containers/EditLesson.jsx';
import AdministratorEditLocation from './administrator/containers/EditLocation.jsx';

// import pages available only for teachers

// import pages available only for receptionists
import ReceptionistUserAdmin from './receptionist/containers/UserAdmin.jsx';

// remove tap delay, essential for MaterialUI to work properly
injectTapEventPlugin();



// set up custom routes
// routes for any users (logged in or logged out)
const PropsRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <Component {...props} {...rest} />
  )}/>
)

// routes only for logged out users
const LoggedOutRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isUserAuthenticated() ? (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    ) : (
      <Component {...props} {...rest} />
    )
  )}/>
)

// routes only for logged in users
const UserRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isUserAuthenticated() ? (
      <Component {...props} {...rest} />
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

// routes only for receptionists (and teachers/administrators)
const ReceptionistRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    (Auth.getUser().role === "administrator" || Auth.getUser().role === "teacher" || Auth.getUser().role === "receptionist") ? (
      <Component {...props} {...rest} />
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

// routes only for teachers (and administrators)
const TeacherRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    (Auth.getUser().role === "administrator" || Auth.getUser().role === "teacher") ? (
      <Component {...props} {...rest} />
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

const AdministratorRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    (Auth.getUser().role === "administrator") ? (
      <Component {...props} {...rest} />
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      parallax: {
        image: "",
        header: "",
        description: ""
      },
      // set up the parallax content
      parallaxContent: {
        Header: {
          image: "banner1",
          header: "”The rhythm of the body, the melody of the mind & the harmony of the soul create the symphony of life.”",
          description: ""
        },
        loginHeader: {
          image: "banner2",
          header: "Log in",
          // description: "Donec posuere felis et dolor venenatis sagittis eu a erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris eros enim, porta id tincidunt et."
        },
        signupHeader: {
          image: "banner3",
          header: "Sign up",
          // description: "Donec posuere felis et dolor venenatis sagittis eu a erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris eros enim, porta id tincidunt et."
        },
        lessonsHeader: {
          image: "banner4",
          header: "Classes",
          // description: "Donec posuere felis et dolor venenatis sagittis eu a erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris eros enim, porta id tincidunt et."
        },
        typesHeader: {
          image: "banner5",
          header: "Class Types",
          // description: "Donec posuere felis et dolor venenatis sagittis eu a erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris eros enim, porta id tincidunt et."
        },
        locationsHeader: {
          image: "banner6",
          header: "Locations",
          // description: "Donec posuere felis et dolor venenatis sagittis eu a erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris eros enim, porta id tincidunt et."
        },
        dashboardHeader: {
          image: "banner7",
          header: "Dashboard",
          // description: "Donec posuere felis et dolor venenatis sagittis eu a erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris eros enim, porta id tincidunt et."
        },
        useradminHeader: {
          image: "banner8",
          header: "User administration",
          // description: "Donec posuere felis et dolor venenatis sagittis eu a erat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Mauris eros enim, porta id tincidunt et."
        }
      }
    }
  };

  componentDidMount() {
    if (Auth.getUser() == null) {
      Auth.deauthenticateUser();
    };

    // check if user is logged in on refresh
    this.toggleAuthenticateStatus();

    // get current pathname without the flash
    const path = (window.location.pathname).substring(1,(window.location.pathname).length)
    // set the parallax content to what's set in the key
    if (this.state.parallaxContent[path + "Header"] == null) {
      this.setState ({
        parallax: {
          image: this.state.parallaxContent["Header"].image,
          header: this.state.parallaxContent["Header"].header,
          description: this.state.parallaxContent["Header"].description
        }
      })
    } else {
      this.setState({
        parallax: {
          image: this.state.parallaxContent[path + "Header"].image,
          header: this.state.parallaxContent[path + "Header"].header,
          description: this.state.parallaxContent[path + "Header"].description
        }
      })
    }
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }

  changeImage(image, header, description) {
    this.setState({
      parallax: {
        image,
        header,
        description
      }
    })
  }



  render() {
    const settings = {
      dots: true,
      fade: true,
      infinite: true,
      speed: 1500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Router>
          <div>
            <nav>
              <div className="nav-wrapper green white">
                <Link className="brand-logo" to="/" onClick={() => { this.changeImage(this.state.parallaxContent.Header.image, this.state.parallaxContent.Header.header, this.state.parallaxContent.Header.description) }}>&nbsp;&nbsp;&nbsp;Green Yoga</Link>
                <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
                <ul className="right hide-on-med-and-down">
                  <li><Link to="/lessons" onClick={() => { this.changeImage(this.state.parallaxContent.lessonsHeader.image, this.state.parallaxContent.lessonsHeader.header, this.state.parallaxContent.lessonsHeader.description) }}>SCHEDULE</Link></li>
                  <li><Link to="/types" onClick={() => { this.changeImage(this.state.parallaxContent.typesHeader.image, this.state.parallaxContent.typesHeader.header, this.state.parallaxContent.typesHeader.description) }}>CLASS TYPES</Link></li>
                  <li><Link to="/locations" onClick={() => { this.changeImage(this.state.parallaxContent.locationsHeader.image, this.state.parallaxContent.locationsHeader.header, this.state.parallaxContent.locationsHeader.description) }}>LOCATIONS</Link></li>
                  {this.state.authenticated ? (
                    <span>
                      <li><Link to="/dashboard" onClick={() => { this.changeImage(this.state.parallaxContent.dashboardHeader.image, this.state.parallaxContent.dashboardHeader.header, this.state.parallaxContent.dashboardHeader.description) }}>DASHBOARD</Link></li>
                      {
                        (Auth.getUser().role === "administrator" || Auth.getUser().role === "teacher" || Auth.getUser().role === "receptionist") ? (
                            <li><Link to="/useradmin" onClick={() => { this.changeImage(this.state.parallaxContent.useradminHeader.image, this.state.parallaxContent.useradminHeader.header, this.state.parallaxContent.useradminHeader.description) }}>USER ADMIN</Link></li>
                          ) : (
                            null
                          )
                      }
                      <li><Link to="/logout" onClick={() => { this.changeImage(this.state.parallaxContent.loginHeader.image, this.state.parallaxContent.loginHeader.header, this.state.parallaxContent.loginHeader.description) }}>LOG OUT</Link></li>
                    </span>
                  ) : (
                    <span>
                      <li><Link to="/login" onClick={() => { this.changeImage(this.state.parallaxContent.loginHeader.image, this.state.parallaxContent.loginHeader.header, this.state.parallaxContent.loginHeader.description) }}>LOG IN</Link></li>
                      <li><Link to="/signup" onClick={() => { this.changeImage(this.state.parallaxContent.signupHeader.image, this.state.parallaxContent.signupHeader.header, this.state.parallaxContent.signupHeader.description) }}>SIGN UP</Link></li>
                    </span>
                  )}
                </ul>
                <ul className="side-nav" id="mobile-demo">
                  <li><Link to="/lessons" onClick={() => { this.changeImage(this.state.parallaxContent.lessonsHeader.image, this.state.parallaxContent.lessonsHeader.header, this.state.parallaxContent.lessonsHeader.description) }}>SCHEDULE</Link></li>
                  <li><Link to="/types" onClick={() => { this.changeImage(this.state.parallaxContent.typesHeader.image, this.state.parallaxContent.typesHeader.header, this.state.parallaxContent.typesHeader.description) }}>CLASS TYPES</Link></li>
                  <li><Link to="/locations" onClick={() => { this.changeImage(this.state.parallaxContent.locationsHeader.image, this.state.parallaxContent.locationsHeader.header, this.state.parallaxContent.locationsHeader.description) }}>LOCATIONS</Link></li>
                  {this.state.authenticated ? (
                    <span>
                      <li><Link to="/dashboard" onClick={() => { this.changeImage(this.state.parallaxContent.dashboardHeader.image, this.state.parallaxContent.dashboardHeader.header, this.state.parallaxContent.dashboardHeader.description) }}>DASHBOARD</Link></li>
                      {
                        (Auth.getUser().role === "administrator" || Auth.getUser().role === "teacher" || Auth.getUser().role === "receptionist") ? (
                            <li><Link to="/useradmin" onClick={() => { this.changeImage(this.state.parallaxContent.useradminHeader.image, this.state.parallaxContent.useradminHeader.header, this.state.parallaxContent.useradminHeader.description) }}>USER ADMIN</Link></li>
                          ) : (
                            null
                          )
                      }
                      <li><Link to="/logout" onClick={() => { this.changeImage(this.state.parallaxContent.loginHeader.image, this.state.parallaxContent.loginHeader.header, this.state.parallaxContent.loginHeader.description) }}>LOG OUT</Link></li>
                    </span>
                  ) : (
                    <span>
                      <li><Link to="/login" onClick={() => { this.changeImage(this.state.parallaxContent.loginHeader.image, this.state.parallaxContent.loginHeader.header, this.state.parallaxContent.loginHeader.description) }}>LOG IN</Link></li>
                      <li><Link to="/signup" onClick={() => { this.changeImage(this.state.parallaxContent.signupHeader.image, this.state.parallaxContent.signupHeader.header, this.state.parallaxContent.signupHeader.description) }}>SIGN UP</Link></li>
                    </span>
                  )}
                </ul>
              </div>
            </nav>

            {/*
            <div className="parallax-container">
              <div className="parallax"><img src={this.state.parallax.image} alt="" /></div>
                <div className="parallax-content valign-wrapper center-align">
                  <div className="container">
                    <h4 className="parallax-title">{this.state.parallax.header}</h4><br />
                    <p className="parallax-description">{this.state.parallax.description}</p>
                  </div>
                </div>
            </div>
            */}

            {/*
            <div className='slider-container'>
              <Slider {...settings}>
                <div><img className="slider-content" src="images/1.jpg" /></div>
                <div><img className="slider-content" src="images/2.jpg" /></div>
                <div><img className="slider-content" src="images/3.jpg" /></div>
                <div><img className="slider-content" src="images/4.jpg" /></div>
                <div><img className="slider-content" src="images/5.jpg" /></div>
              </Slider>
            </div>
            */}

            <div className={this.state.parallax.image}>
            </div>

            <div className="container">
              {/* Routes available to all users */}
              <PropsRoute exact path="/" component={HomePage} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
              <PropsRoute path="/lessons" component={Lessons} changeImage={() => this.changeImage(this.state.parallaxContent.loginHeader.image, this.state.parallaxContent.loginHeader.header, this.state.parallaxContent.loginHeader.description)} />
              <PropsRoute path="/locations" component={Locations} />
              <PropsRoute path="/types" component={Types} />

              {/* Logged out users routes */}
              <LoggedOutRoute path="/login" component={LoginPage} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} changeImage={() => this.changeImage(this.state.parallaxContent.dashboardHeader.image, this.state.parallaxContent.dashboardHeader.header, this.state.parallaxContent.dashboardHeader.description)} />
              <LoggedOutRoute path="/signup" component={SignupPage} changeImage={() => this.changeImage(this.state.parallaxContent.loginHeader.image, this.state.parallaxContent.loginHeader.header, this.state.parallaxContent.loginHeader.description)}/>

              {/* Logged in users routes */}
              <UserRoute path="/dashboard" component={Dashboard} user={Auth.getUser()} />
              <UserRoute path="/logout" component={LogoutFunction} />

              {/* Administrator routes */}
              <AdministratorRoute path="/administrator/edit-type/:id" component={AdministratorEditType} />
              <AdministratorRoute path="/administrator/edit-lesson/:id" component={AdministratorEditLesson} />
              <AdministratorRoute path="/administrator/edit-location/:id" component={AdministratorEditLocation} />

              {/* Teacher routes */}

              {/* Receptionist routes */}
              <ReceptionistRoute path="/useradmin" component={ReceptionistUserAdmin} />

            </div>
            <div className="section"></div>
            <div className="section"></div>
            <div className="container">
              <div className="card">
                <div className="section"></div>
                <h4>Contact Me</h4>
                <div className="container">
                  <div className="container">
                    <div className="row">
                      <form className="col s12">
                        <div className="row">
                          <div className="input-field col s12 m6 l6">
                            <input id="name" type="text" />
                            <label for="name">Name</label>
                          </div>
                          <div className="input-field col s12 m6 l6">
                            <input id="email" type="text" />
                            <label for="email">Email</label>
                          </div>
                        </div>
                        <div className="row">
                          <div className="input-field col s12 m12 l12">
                            <textarea id="textarea1" className="materialize-textarea"></textarea>
                            <label for="textarea1">Message</label>
                          </div>
                        </div>
                        <div className="button-line center-align">
                          <button className="btn waves-effect waves-light" type="submit" name="action">
                            Send
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="center-align footer-icon">
                  <i className="fa fa-facebook-square" aria-hidden="true"></i>&nbsp;&nbsp;<i className="fa fa-instagram" aria-hidden="true"></i>
                </div>
                <div className="section"></div>

              </div>
              <div className="section"></div>
              <div className="section"></div>
            </div>

          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
