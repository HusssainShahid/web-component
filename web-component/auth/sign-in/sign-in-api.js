import environment from "../../../../src/environment";
import {ApiGateway} from "../../../api/api-gateway";

export class SignInApi {

  constructor() {
    this.api = new ApiGateway();
    this.baseUrl = environment.endpoint;
  }

  getUserWorkSpace(email) {
    this.api.apiRequest(`${this.baseUrl}/api/user/workspace/${email.email}`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        if (jsonData.status) {
          if (jsonData.workspaceStatus) {
            this.userWorkSpaces = [];
            for (let i = 0; i < jsonData.workspace.length; i++) {
              this.userWorkSpaces.push({
                'name': jsonData.workspace[i].organization_name,
                'email': email.email,
              });
            }
            if (jsonData.workspace.length === 1) {
              window.dispatchEvent(new CustomEvent('active-sign-in-step', {bubbles: true, detail: 'sign-in-password'}));
              window.dispatchEvent(new CustomEvent('selected-workspace', {
                bubbles: true, detail: {
                  selectedWorkspace: this.userWorkSpaces[0],
                  selected: false
                }
              }));
            } else {
              window.dispatchEvent(new CustomEvent('all-user-workspace', {bubbles: true, detail: this.userWorkSpaces}));
            }
          } else {
            window.dispatchEvent(new CustomEvent('active-sign-in-step', {bubbles: true, detail: 'sign-in-password'}));
            window.dispatchEvent(new CustomEvent('no-workspace-found', {bubbles: true, detail: email.email}));
          }
        } else {
          window.dispatchEvent(new CustomEvent('sign-in-wrong-email-entered'));
          window.dispatchEvent(new CustomEvent('active-sign-in-step', {bubbles: true, detail: 'sign-in-email'}));
        }
      })
      .catch(error => {
        console.log(error)
      });
  }

  logInUser(data) {
    this.api.apiRequest(`${this.baseUrl}/api/iam/login`, 'post', 'fetch', data)
      .then(response => response.json())
      .then(jsonData => {
        if (jsonData.status === true && jsonData.message === 'Email EXISTS') {
          data.type = 'registered';
          this.setWorkspace(jsonData, data);
          // window.dispatchEvent(new CustomEvent('user-authenticated', {
          //   bubbles: true,
          //   detail: {result: jsonData, data: data}
          // }));
        } else if (jsonData.status === false && jsonData.message === 'Invalid email or password') {
          window.dispatchEvent(new CustomEvent('invalid-email-password'));
        } else if (jsonData.status === false && jsonData.message === 'No workSpace found') {
          data.type = 'unregistered';
          document.cookie = "workspace=" + 'default';
          window.dispatchEvent(new CustomEvent('user-authenticated', {
            bubbles: true,
            detail: {result: jsonData, data: data}
          }));
        }
      })
  }

  setWorkspace(loginResponse, body) {
    let workspace = body.url;
    if(body.url == '' || body.url == undefined){
      workspace = 'default';
    }
    let data = {
      'workspace': workspace
    };
    this.api.apiRequest(`${this.baseUrl}/api/iam/user-account/workspace`, 'post', 'fetch', data)
      .then(response => response.json())
      .then(jsonData => {
        if(jsonData.status){
          document.cookie = "workspace=" + jsonData.value;
        }else {
          document.cookie = "workspace=" + 'default';
        }
        window.dispatchEvent(new CustomEvent('user-authenticated', {
            bubbles: true,
            detail: {result: loginResponse, data: body}
          }));
      })
  }
}
