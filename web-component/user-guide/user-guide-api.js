import environment from "../../../src/environment";
import {ApiGateway} from "../../api/api-gateway";
import {SharedClass} from "../../../src/shared/shared";

export class UserGuideApi {

  constructor() {
    this.api = new ApiGateway();
    this.baseUrl = environment.endpoint;
    this.shared = new SharedClass();

  }

  userGuide(user) {
    this.api.apiRequest(`${this.baseUrl}/api/user/guide`, 'post', 'fetch', user)
      .then(response => response.text())
      .then(jsonData => {
        if(jsonData){
          window.dispatchEvent(new CustomEvent('user-guide-data-saved', { bubbles: true, detail: '' }));
        }
      })
  }
}
