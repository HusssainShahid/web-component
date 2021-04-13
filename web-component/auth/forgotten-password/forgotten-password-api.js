import environment from "../../../../src/environment";
import {ApiGateway} from "../../../api/api-gateway";

export class ForgottenPasswordApi {

  constructor() {
    this.api = new ApiGateway();
    this.baseUrl = environment.endpoint;
  }

  sendLink(email) {
    let data = {
      'forgetEmail': email
    };
    this.api.apiRequest(`${this.baseUrl}/api/password/forgotten`, 'post', 'fetch', data)
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('forgotten-password-link-sent', {bubbles: true, detail: jsonData}));
      });
  }

  resendLink(email) {
    let data = {
      'forgetEmail': email,
      'event': 'resendLink'
    };
    this.api.apiRequest(`${this.baseUrl}/api/password/forgotten`, 'post', 'fetch', data)
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('forgotten-password-link-sent', {bubbles: true, detail: jsonData}));
      });
  }
}
