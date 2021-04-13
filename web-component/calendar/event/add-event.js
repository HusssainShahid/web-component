import {Events} from "../modal/events";
import {CalendarApi} from "../calendar-api";

import ('../../button-component');
import ('../../form/input-text');
import ('../../form/date-picker');
import ('../../form/time-picker');
import ('../../form/tag-select');
import ('../../form/select-field');
import ('../../form/select-option');
const templateAddEvent = document.createElement('template');
templateAddEvent.innerHTML = `
<style>
    .submit-button{
        text-align: right;
    }
    .calendar-event-heading{
        font-size: var(--text-heading, 28px);
    }
    label{
        margin-bottom: 0;
    }
    .calendar-event-container{
        padding: 20px 5%;
    }
    .calendar-event-row{
        display: flex;
        flex-wrap: wrap;
    }
    .calendar-event-row > div{
        width: 49%;
    }
    .calendar-event-row > div:last-child{
        margin-left: auto;
    }
    @media only screen and (max-width: 600px) {
      .calendar-event-row > div{
          width: 100%;  
      }
    }
    .error{
        color:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1));
        font-size: var(--text-caption, 14px);
        margin: 2px;
    }
</style>
<div class="calendar-event-container">
  <div class="calendar-event-heading">Add Event</div>
      <label>Name</label>
      <input-text required max="1024" placeholder="Event name/ subject" id="eventName"></input-text>
      <div class="calendar-event-row">
        <div>
            <label>Start Date</label>
            <date-picker required placeholder="Select start date" id="startDate"></date-picker>
        </div>
        <div>
            <label>Start Time</label>
            <time-picker required placeholder="Select start time" id="startTime"></time-picker>
        </div>
      </div>
      <div class="calendar-event-row">
        <div>
            <label>End Date</label>
            <date-picker required placeholder="Select end date" id="endDate"></date-picker>
            <span id="endDateError" class="error"></span>
        </div>
        <div>
            <label>End Time</label>
            <time-picker required placeholder="Select time time" id="endTime"></time-picker>
            <span id="endTimeError" class="error"></span>
        </div>
      </div>
      <label>Member</label>
      <tag-select model="id" option-text="email" placeholder="Add member" id="eventMembers"></tag-select>
      <div class="submit-button">
        <button-component content="Add Event" id="add-event" is="primary"></button-component>
      </div>
</div>
`;

export class AddEvent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateAddEvent.content.cloneNode(true));
  }

  connectedCallback() {
    this.fieldIds = ['eventName', 'startDate', 'startTime', 'endDate', 'endTime', 'eventMembers'];
    this.fields = [];
    this.api = new CalendarApi();
    this.api.getEventCategories();
    this.api.teamMembers();
    this.events = new Events();
    this.addEnterEvent();
    this.shadowRoot.querySelector('#add-event').addEventListener('click', e => {
      this.getValues();
    });
    Date.prototype.toDateInputValue = (function() {
      let local = new Date(this);
      local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
      return local.toJSON().slice(0,10);
    });
    this.eventDate = new Date().toDateInputValue();
    window.addEventListener('calendar-team-members-received', e => {
      if (e.detail.status) {
        this.shadowRoot.querySelector('tag-select').setAttribute('options', JSON.stringify(e.detail.data));
      }
    })
    window.addEventListener('calendar-event-saved', e => {
      this.resetForm();
    });
    this.resetForm();
  }

  getValues() {
    this.data = {};
    for (let i = 0; i < this.fields.length; i++) {
      this.fields[i].setAttribute('validate', 'true')
      if (this.fields[i].getAttribute('valid') === 'true') {
        this.data[this.fieldIds[i]] = this.fields[i].getAttribute('value');
      }
      if (Object.keys(this.data).length === this.fieldIds.length) {
        this.shadowRoot.querySelector('#endDateError').innerHTML = '';
        this.shadowRoot.querySelector('#endTimeError').innerHTML = '';
        if (this.events.validate(this.data) === true) {
          this.data.timezone = new Date().toString().match(/([-\+][0-9]+)\s/)[1];
          this.data.categoryField='1';
          this.api.addEvent(this.data);
        } else {
          this.showErrors(this.events.validate(this.data));
        }
      }
    }
  }

  showErrors(exception) {
    this.shadowRoot.querySelector(`#${exception.id}Error`).innerHTML = exception.exception;
  }

  addEnterEvent() {
    for (let i = 0; i < this.fieldIds.length; i++) {
      this.fields.push(this.shadowRoot.querySelector('#' + this.fieldIds[i]));
      this.fields[i].addEventListener('keyup', e => {
        if (e.keyCode === 13) {
          this.shadowRoot.querySelector('#add-event').click();
        }
      })
    }
  }


  resetForm() {
    let date = new Date(this.eventDate);
    let day = date.getDate();
    day = day.toString().length === 1 ? '0' + day.toString() : day.toString()
    let month = date.getMonth() + 1;
    month = month.toString().length === 1 ? '0' + month.toString() : month.toString();
    let year = date.getFullYear();
    this.shadowRoot.querySelector('#startDate').setAttribute('value', `${year}-${month}-${day}`);
    this.shadowRoot.querySelector('#startTime').setAttribute('value', '09:00');
    this.shadowRoot.querySelector('#endDate').setAttribute('value', `${year}-${month}-${day}`);
    this.shadowRoot.querySelector('#endTime').setAttribute('value', '09:30');
    this.shadowRoot.querySelector('input-text').setAttribute('value', '');
    this.shadowRoot.querySelector('tag-select').setAttribute('reset', 'true');
  }
}

window.customElements.define('add-event', AddEvent);

