import '../../button-component';
import '../../form/form-field';
import '../../form/input-text';
import '../../form/email-address-input';
import Timezone from "../../../../src/modules/calendar/modal/timezone";
import {CalendarApi} from "../calendar-api";

const templateEditMember = document.createElement('template');
templateEditMember.innerHTML = `
<style>
    .container{
        padding: 20px;
    }
    .submit-button{
        text-align: right;
        padding: 10px 0;
    }
    .heading{
        font-size: 22px;
        padding: 10px 0;
    }
    .error{
       color:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1));
      font-size: var(--text-caption, 14px);
      margin: 2px;
    }
</style>
<div class="container">
    <div class="heading">Update Member</div>
    <form-field event="update-team-member-form-submit">
        <label>Name</label>
        <input-text placeholder="Enter member name" required max="256" id="member-name"></input-text>
        <label>Email</label>
        <email-address placeholder="Enter member email" onfocusout-validate="false" required id="member-email"></email-address>
        <label>Timezone</label>
        <input-text placeholder="Enter member timezone e.g, +05:00" required id="timezone"></input-text>
        <div class="error" id="invalid-timezone"></div>
        <div class="submit-button" slot="submit">
          <button-component content="Update member" is="primary"></button-component>
        </div>
    </form-field>
</div>
`;

export class EditMember extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateEditMember.content.cloneNode(true));
  }

  connectedCallback() {
    this.formKeys = ['name', 'email', 'timeZone'];
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.api = new CalendarApi();
    this.api.teamMembers();
    window.addEventListener('update-team-member-form-submit', e => {
      if (this.timeZone(e.detail.timeZone)) {
        e.detail.teamName = this.team;
        e.detail.id = this._data.id;
        this.api.updateMember(e.detail);
      }
    });
    window.addEventListener('calendar-team-members-received', e => {
      this.team = e.detail.team[0].team_name;
    });
    window.addEventListener('calendar-member-added', e => {
      this.shadowRoot.querySelector('#member-name').setAttribute('value', '');
      this.shadowRoot.querySelector('#member-email').setAttribute('value', '');
      this.shadowRoot.querySelector('#timezone').setAttribute('value', '');
    });
  }

  timeZone(data) {
    try {
      new Timezone(data);
      this.shadowRoot.querySelector('#invalid-timezone').innerHTML = '';
      return true;
    } catch (e) {
      if (e === 'Invalid time-zone please use this syntax +05:00') {
        this.shadowRoot.querySelector('#invalid-timezone').innerHTML = 'Invalid time-zone please use this syntax +05:00';
        return false;
      }
    }
  }

  setValues() {
    this._data = JSON.parse(this.data);
    this.shadowRoot.querySelector('#member-name').setAttribute('value', this._data.team_member);
    this.shadowRoot.querySelector('#member-email').setAttribute('value', this._data.email);
    this.shadowRoot.querySelector('#timezone').setAttribute('value', this._data.time_zone);
  }

  static get observedAttributes() {
    return ['data'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.setValues();
  }

  get data() {
    return this.getAttribute('data');
  }
}

window.customElements.define('edit-team-members', EditMember);
