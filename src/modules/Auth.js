class Auth {

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  static authenticateUser(token) {
    localStorage.setItem('token', token);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }

  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static deauthenticateUser() {
    localStorage.removeItem('token');
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken() {
    return localStorage.getItem('token');
  }

  // Save user details to local storage
  static storeUser(user) {
    localStorage.setItem('user', user);
  }

  // Get user details from local storage
  static getUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  // Remove user from local storage
  static removeUser() {
    localStorage.removeItem('user');
  }

}

export default Auth;
