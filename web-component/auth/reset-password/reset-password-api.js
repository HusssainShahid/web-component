import environment from "../../../../src/environment";
import {ApiGateway} from "../../../api/api-gateway";

export class ResetPasswordApi {

  constructor() {
    this.api = new ApiGateway();
    this.baseUrl = environment.endpoint;
  }

  setPassword(data, token) {
    this.password = data.password;
    let object = {
      token: token,
      password: data.password,
      confirmPassword: data.confirm_password
    };
    this.api.apiRequest(`${this.baseUrl}/api/password/reset`, 'post', 'fetch', object)
      .then(result => result.json())
      .then(jsonData => {
        this.getUserWorkSpace(data.email, token);
      });
  }

  getUserWorkSpace(email, token) {
    let data = {};
    this.api.apiRequest(`${this.baseUrl}/api/user/workspace/${email}/get`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        if (jsonData.status===false) {
          data = {
            'email': email,
            'password': this.password,
            'workspace': false
          }
        } else {
          data = {
            'email': email,
            'url': jsonData.workSpace,
            'password': this.password,
            'workspace': true

          }
        }
        this.logInUser(data);
      });
  }

  logInUser(data) {
    this.api.apiRequest(`${this.baseUrl}/api/iam/login`, 'post', 'fetch', data)
      .then(response => response.json())
      .then(jsonData => {
        if (jsonData.status === true && jsonData.message === 'Email EXISTS') {
          data.type = 'registered';
          this.setWorkspace(jsonData, data);
        } else if (jsonData.status === false && jsonData.message === 'Invalid email or password') {
          window.dispatchEvent(new CustomEvent('invalid-email-password'));
        } else if (jsonData.status === false && jsonData.message === 'No workSpace found') {
          data.type = 'unregistered';
          document.cookie = "workspace=" + 'default';
          window.dispatchEvent(new CustomEvent('user-logged-in', {
            bubbles: true,
            detail: {result: jsonData, data: data}
          }));
        }
      })
  }

  setWorkspace(loginResponse, body) {
    let data = {
      'workspace': body.url
    };
    this.api.apiRequest(`${this.baseUrl}/api/iam/user-account/workspace`, 'post', 'fetch', data)
      .then(response => response.json())
      .then(jsonData => {
        if (jsonData.status) {
          window.dispatchEvent(new CustomEvent('user-logged-in', {
            bubbles: true,
            detail: {result: loginResponse, data: body}
          }));
        }
      })
  }
}
