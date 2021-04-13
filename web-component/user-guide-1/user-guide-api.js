import environment from "../../../src/environment";
import {ApiGateway} from "../../api/api-gateway";
import {SharedClass} from "../../../src/shared/shared";

export class UserGuideApi {

  constructor() {
    this.api = new ApiGateway();
    this.baseUrl = environment.endpoint;
    this.shared = new SharedClass();

  }

  workspaceAvailability(name) {
    let data = {
      workspace: name,
      userId: this.shared.getCookie('id')
    };
    this.api.apiRequest(`${this.baseUrl}/api/users/${this.shared.getCookie('id')}/setup/workspace`, 'post', 'fetch', data)
      .then(response => response.text())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('workspace-availability-response', {
          bubbles: true,
          detail: jsonData
        }));
      })
  }
}
