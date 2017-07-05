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
      header: {}
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
      this.setHeaderImage("")
    } else {
      this.setHeaderImage(path)
    }
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }

  setHeaderImage(image) {
    if (image === "") {
      this.setState ({
        header: {}
      })
    } else {
      var header = {
        borderTop: "solid #C5C5C6 1px",
        borderBottom: "solid #D1CFCC 1px",
        margin: "0 auto",
        height: "300px",
        padding: "0px",
        width: "100%",
        zIndex: "-100",
        alignItems: "center",
        backgroundImage: `url(/images/headers/${image}.jpg)`,
        backgroundPositionX: 'center',
        backgroundPositionY: 'center',
        backgroundRepeat: 'no-repeat',
        WebkitBackgroundSize: "cover",
        MozBackgroundSize: "cover",
        OBackgroundSize: "cover",
        backgroundSize: "cover"
      }
      this.setState({
        header
      })
    }
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Router>
          <div>
            <div className="navbar-fixed">
              <nav>
                <div className="nav-wrapper green white">
                  <Link className="brand-logo" to="/" onClick={() => { this.setHeaderImage("") }}>&nbsp;&nbsp;&nbsp;Green Yoga</Link>
                  <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
                  <ul className="right hide-on-med-and-down">
                    <li><Link to="/lessons" onClick={() => { this.setHeaderImage("lessons") }}>SCHEDULE</Link></li>
                    <li><Link to="/types" onClick={() => { this.setHeaderImage("types") }}>CLASS TYPES</Link></li>
                    <li><Link to="/locations" onClick={() => { this.setHeaderImage("locations") }}>LOCATIONS</Link></li>
                    {this.state.authenticated ? (
                      <span>
                        <li><Link to="/dashboard" onClick={() => { this.setHeaderImage("dashboard") }}>DASHBOARD</Link></li>
                        {
                          (Auth.getUser().role === "administrator" || Auth.getUser().role === "teacher" || Auth.getUser().role === "receptionist") ? (
                              <li><Link to="/useradmin" onClick={() => { this.setHeaderImage("useradmin") }}>USER ADMIN</Link></li>
                            ) : (
                              null
                            )
                        }
                        <li><Link to="/logout" onClick={() => { this.setHeaderImage("login") }}>LOG OUT</Link></li>
                      </span>
                    ) : (
                      <span>
                        <li><Link to="/login" onClick={() => { this.setHeaderImage("login") }}>LOG IN</Link></li>
                        <li><Link to="/signup" onClick={() => { this.setHeaderImage("signup") }}>SIGN UP</Link></li>
                      </span>
                    )}
                  </ul>

                </div>
              </nav>
            </div>
            <ul className="side-nav" id="mobile-demo">
              <li><Link to="/lessons" onClick={() => { this.setHeaderImage("lessons") }}>SCHEDULE</Link></li>
              <li><Link to="/types" onClick={() => { this.setHeaderImage("types") }}>CLASS TYPES</Link></li>
              <li><Link to="/locations" onClick={() => { this.setHeaderImage("locations") }}>LOCATIONS</Link></li>
              {this.state.authenticated ? (
                <span>
                  <li><Link to="/dashboard" onClick={() => { this.setHeaderImage("dashboard") }}>DASHBOARD</Link></li>
                  {
                    (Auth.getUser().role === "administrator" || Auth.getUser().role === "teacher" || Auth.getUser().role === "receptionist") ? (
                        <li><Link to="/useradmin" onClick={() => { this.setHeaderImage("useradmin") }}>USER ADMIN</Link></li>
                      ) : (
                        null
                      )
                  }
                  <li><Link to="/logout" onClick={() => { this.setHeaderImage("login") }}>LOG OUT</Link></li>
                </span>
              ) : (
                <span>
                  <li><Link to="/login" onClick={() => { this.setHeaderImage("login") }}>LOG IN</Link></li>
                  <li><Link to="/signup" onClick={() => { this.setHeaderImage("signup") }}>SIGN UP</Link></li>
                </span>
              )}
            </ul>

            <div style={this.state.header}>
            </div>

            <div className="container">
              {/* Routes available to all users */}
              <PropsRoute exact path="/" component={HomePage} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
              <PropsRoute path="/lessons" component={Lessons} changeImage={() => this.setHeaderImage("header2")} />
              <PropsRoute path="/locations" component={Locations} />
              <PropsRoute path="/types" component={Types} />

              {/* Logged out users routes */}
              <LoggedOutRoute path="/login" component={LoginPage} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} changeImage={() => this.setHeaderImage("header7")} />
              <LoggedOutRoute path="/signup" component={SignupPage} changeImage={() => this.setHeaderImage("header2")}/>

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

          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
