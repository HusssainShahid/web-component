import environment from "../../../../src/environment";
import {ApiGateway} from "../../../api/api-gateway";

export class SignUpApi {

  constructor() {
    this.api = new ApiGateway();
    this.baseUrl = environment.endpoint;
    this.email = '';
  }

  signUp(email) {
    this.email = email;
    let data = {
      email: this.email
    };
    this.api.apiRequest(`${this.baseUrl}/api/send/registration/request`, 'post', 'fetch', data)
      .then(response => response.json())
      .then(jsonData => {
        if (jsonData.status) {
          this.sendRegistrationEmail(email);
        }
        window.dispatchEvent(new CustomEvent('sign-up-request-response', {bubbles: true, detail: jsonData}));
      })
      .catch(error=>{
        console.log(error);
      })
  }

  sendRegistrationEmail(email) {
    let data = {
      email: email,
    };
    this.api.apiRequest(`${this.baseUrl}/api/user/email/sent`, 'post', 'fetch', data)
      .then(response => response.json())
      .then(jsonData => {
      })
      .catch(error=>{
        console.log(error);
      })
  }

  resendEmail(email) {
    let token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    let data = {
      email: email
    };
    this.api.apiRequest(`${this.baseUrl}/api/user/email/resend`, 'post', 'fetch', data)
      .then(data => data.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('sign-up-resend-link-response-received', {bubbles: true, detail: jsonData}));
      })
      .catch(error=>{
        console.log(error);
      });
  }

}
