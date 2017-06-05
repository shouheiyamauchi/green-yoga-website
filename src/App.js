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

// import authentication storage functions
import Auth from './modules/Auth';

// import pages available to all visitors
import HomePage from './public/containers/HomePage.jsx';
import LoginPage from './public/containers/LoginPage.jsx';
import LogoutFunction from './public/containers/LogoutFunction.jsx';
import SignupPage from './public/containers/SignupPage.jsx';
import Types from './public/containers/Types.jsx';

// import pages available only for signed in users
import DashboardPage from './user/containers/DashboardPage.jsx';
import Uploader from './user/containers/Uploader.jsx';

// import pages available only for administrators
import AdministratorDashboard from './administrator/containers/Dashboard.jsx';
import AdministratorEditType from './administrator/containers/EditType.jsx';

// import pages available only for teachers
import TeacherDashboard from './teacher/containers/TeacherDashboard.jsx';

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
      parallax: "/images/header1.jpg"
    }
  };

  componentDidMount() {
    // check if user is logged in on refresh
    this.toggleAuthenticateStatus();
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={getMuiTheme()}>
        <Router>
          <div>
            <nav>
              <div className="nav-wrapper green white">
                <Link className="brand-logo" to="/">&nbsp;&nbsp;&nbsp;Green Yoga</Link>
                <a href="#" data-activates="mobile-demo" className="button-collapse"><i className="material-icons">menu</i></a>
                <ul className="right hide-on-med-and-down">
                  <li><Link to="/types">CLASS TYPES</Link></li>
                  {this.state.authenticated ? (
                    <span>
                      <li><Link to="/dashboard">DASHBOARD</Link></li>
                      {
                        (Auth.getUser().role === "administrator") ? (
                          <span>
                            <li><Link to="/administrator/dashboard">ADMINISTRATOR</Link></li>
                          </span>
                          ) : (
                            null
                          )
                      }
                      {
                        (Auth.getUser().role === "administrator" || Auth.getUser().role === "teacher") ? (
                            <li><Link to="/teacher">TEACHER</Link></li>
                          ) : (
                            null
                          )
                      }
                      <li><Link to="/logout">LOG OUT</Link></li>
                    </span>
                  ) : (
                    <span>
                      <li><Link to="/login">LOG IN</Link></li>
                      <li><Link to="/signup">SIGN UP</Link></li>
                    </span>
                  )}
                </ul>
                <ul className="side-nav" id="mobile-demo">
                  <li><Link to="/types">CLASS TYPES</Link></li>
                  {this.state.authenticated ? (
                    <span>
                      <li><Link to="/dashboard">DASHBOARD</Link></li>
                      {
                        (Auth.getUser().role === "administrator") ? (
                          <span>
                            <li><Link to="/administrator/dashboard">ADMINISTRATOR</Link></li>
                          </span>

                          ) : (
                            null
                          )
                      }
                      {
                        (Auth.getUser().role === "administrator" || Auth.getUser().role === "teacher") ? (
                            <li><Link to="/teacher">TEACHER</Link></li>
                          ) : (
                            null
                          )
                      }
                      <li><Link to="/logout">LOG OUT</Link></li>
                    </span>
                  ) : (
                    <span>
                      <li><Link to="/login">LOG IN</Link></li>
                      <li><Link to="/signup">SIGN UP</Link></li>
                    </span>
                  )}
                </ul>
              </div>
            </nav>
            <div className="parallax-container center-align">
              <div className="parallax"><img src={this.state.parallax} /></div>
                <div className="white-text">
                  <br /><br /><br /><h3>Welcome to Green Yoga</h3>
                  <p className="sub-title">An easy to use, amazing parallax effect in materialize without any extra effort</p>
                </div>
            </div>
            <div className="container">
              {/* Routes available to all users */}
              <PropsRoute exact path="/" component={HomePage} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
              <PropsRoute path="/types" component={Types} />

              {/* Logged out users routes */}
              <LoggedOutRoute path="/login" component={LoginPage} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
              <LoggedOutRoute path="/signup" component={SignupPage}/>

              {/* Logged in users routes */}
              <UserRoute path="/dashboard" component={DashboardPage} user={Auth.getUser()} />
              <UserRoute path="/logout" component={LogoutFunction} />
              <UserRoute path="/uploader" component={Uploader}/>


              {/* Teacher routes */}
              <TeacherRoute path="/teacher" component={TeacherDashboard} user={Auth.getUser()}/>

              {/* Administrator routes */}
              <AdministratorRoute path="/administrator/dashboard" component={AdministratorDashboard} user={Auth.getUser()} />
              <AdministratorRoute path="/administrator/edit-type/:id" component={AdministratorEditType} />
            </div>
          </div>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
