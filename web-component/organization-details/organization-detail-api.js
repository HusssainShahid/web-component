import {ApiGateway} from "../../api/api-gateway";
import environment from "../../../src/environment";

export class OrganizationDetailApi {
  constructor() {
    this.api = new ApiGateway();
    this.baseUrl = environment.endpoint;
  }

  organizationDetail(organizationId) {
    this.api.apiRequest(`${this.baseUrl}/api/settings/organizations/${organizationId}`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('organization-detail-received', {detail: jsonData.data}));
      });
  }

  saveImage(body, img,orgId) {
    let formData = new FormData();
    for (let key in body) {
      formData.append(key, body[key]);
    }
    formData.append('images[]', img.detail);
    this.api.apiRequest(`${this.baseUrl}/api/settings/organizations/${orgId}`, 'post', 'file', formData)
      .then(response => response.json())
      .then(jsonData => {
        console.log(jsonData)
      })
  }

  saveAboutUs(body,orgId) {
    this.api.apiRequest(`${this.baseUrl}/api/settings/organizations/${orgId}`, 'post', 'fetch', body)
      .then(response => response.json())
      .then(jsonData => {
        if(jsonData) {
          window.dispatchEvent(new CustomEvent('about-us-saved', {detail: jsonData}));
        }
      })
  }

  getImage(orgId, img) {
    return `${this.baseUrl}/api/organization/${orgId}/image/${img}`;
  }
}
