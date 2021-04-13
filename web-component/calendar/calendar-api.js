import environment from "../../../src/environment";
import {ApiGateway} from "../../api/api-gateway";
import {SharedClass} from "../../../src/shared/shared";

export class CalendarApi {

  constructor() {
    this.api = new ApiGateway();
    this.shared = new SharedClass();
    this.baseUrl = environment.endpoint;
  }

  teamMembers() {
    this.api.apiRequest(`${this.baseUrl}/api/team/member`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('calendar-team-members-received', {bubbles: true, detail: jsonData}));
      });
  }

  addEvent(data) {
    this.api.apiRequest(`${this.baseUrl}/api/calendar/event`, 'post', 'fetch', data)
      .then(response => response.json())
      .then(jsonData => {
        if (jsonData.status) {
          window.dispatchEvent(new CustomEvent('calendar-event-saved', {bubbles: true, detail: jsonData}));
          this.getEvents();
        }
      })
  }

  getEvents() {
    this.api.apiRequest(`${this.baseUrl}/api/calendar/event`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('calendar-event-received', {bubbles: true, detail: jsonData}));
      });
  }

  getEventCategories() {
    this.api.apiRequest(`${this.baseUrl}/api/event/category`, 'get', 'fetch')
      .then(result => result.json())
      .then(jsonData => {
        window.dispatchEvent(new CustomEvent('calendar-event-categories-received', {bubbles: true, detail: jsonData}));
      });
  }

  addMember(body) {
    let data = {
      name: body.name,
      email: body.email,
      timeZone: body.timeZone,
    };
    this.api.apiRequest(`${this.baseUrl}/api/add/member`, 'post', 'fetch', data)
      .then(response => response.json())
      .then(jsonData => {
        if (jsonData.status) {
          this.teamMembers();
          window.dispatchEvent(new CustomEvent('calendar-member-added'));
        }
      })
  }

  updateMember(body) {
    let data = {
      name: body.name,
      email: body.email,
      timeZone: body.timeZone,
      teamName: body.teamName,
      id: body.id
    };
    this.api.apiRequest(`${this.baseUrl}/api/update/member`, 'post', 'fetch', data)
      .then(response => response.json())
      .then(jsonData => {
        if (jsonData.status) {
          this.teamMembers();
          window.dispatchEvent(new CustomEvent('calendar-member-added'));
        }
      })
  }

  deleteMember(id) {
    let data = {
      id: id
    }
    this.api.apiRequest(`${this.baseUrl}/api/delete/member`, 'post', 'fetch', data)
      .then(response => response.json())
      .then(jsonData => {
        if (jsonData.status) {
          this.teamMembers();
        }
      })
  }
}
