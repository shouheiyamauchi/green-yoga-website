class Auth {


  // Authenticate user by saving a token string in local storage
  static authenticateUser(token) {
    localStorage.setItem('token', token);
  }

  // Check if a user is authenticated by checking if a token is saved in local storage
  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }


  // Deauthenticate user by removing token from local storage
  static deauthenticateUser() {
    localStorage.removeItem('token');
  }

  // Get token
  static getToken() {
    return localStorage.getItem('token');
  }

  // Save user details to local storage
  static storeUser(user) {
    localStorage.setItem('userInfo', user);
  }

  // Get user details from local storage
  static getUser() {
    return JSON.parse(localStorage.getItem('userInfo'));
  }

  // Remove user from local storage
  static removeUser() {
    localStorage.removeItem('userInfo');
  }

}

export default Auth;
