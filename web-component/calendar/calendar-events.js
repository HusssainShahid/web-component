import {Events} from "./modal/events";
import {CalendarApi} from "./calendar-api";

import ('../button-component');
import ('../form/input-text');
import ('../form/date-picker');
import ('../form/time-picker');
import ('../form/tag-select');
import ('../form/select-field');
import ('../form/select-option');
const templateCalendarEvents = document.createElement('template');
templateCalendarEvents.innerHTML = `
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
      <label>Event Category</label>
      <select-field key="calendar_event_category" id="categoryField"></select-field>
      <label>Member</label>
      <tag-select model="id" option-text="email" placeholder="Add member" id="eventMembers"></tag-select>
      <div class="submit-button">
        <button-component content="Add Event" id="add-event" is="primary"></button-component>
      </div>
</div>
`;

export class CalendarEvents extends HTMLElement {
  constructor() {
    super();
    this.appendChild(templateCalendarEvents.content);
  }

  static get observedAttributes() {
    return ['event-date'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.resetForm();
  }

  connectedCallback() {
    this.fieldIds = ['eventName', 'startDate', 'startTime', 'endDate', 'endTime', 'categoryField', 'eventMembers'];
    this.fields = [];
    this.api = new CalendarApi();
    this.api.getEventCategories();
    this.api.teamMembers();
    this.events = new Events();
    this.addEnterEvent();
    this.querySelector('#add-event').addEventListener('click', e => {
      this.getValues();
    });
    window.addEventListener('calendar-team-members-received', e => {
      if (e.detail.status) {
        this.querySelector('tag-select').setAttribute('options', JSON.stringify(e.detail.data));
      }
    })
    window.addEventListener('calendar-event-categories-received', e => {
      if (e.detail.status) {
        this.initializeCategoriesField(e.detail.data)
      }
    })
    window.addEventListener('calendar-event-saved', e => {
      this.resetForm();
    });
  }

  getValues() {
    this.data = {};
    for (let i = 0; i < this.fields.length; i++) {
      this.fields[i].setAttribute('validate', 'true')
      if (this.fields[i].getAttribute('valid') === 'true') {
        this.data[this.fieldIds[i]] = this.fields[i].getAttribute('value');
      }
      if (Object.keys(this.data).length === this.fieldIds.length) {
        this.querySelector('#endDateError').innerHTML = '';
        this.querySelector('#endTimeError').innerHTML = '';
        if (this.events.validate(this.data) === true) {
          this.data.timezone = new Date().toString().match(/([-\+][0-9]+)\s/)[1];
          this.api.addEvent(this.data);
        } else {
          this.showErrors(this.events.validate(this.data));
        }
      }
    }
  }

  showErrors(exception) {
    this.querySelector(`#${exception.id}Error`).innerHTML = exception.exception;
  }

  addEnterEvent() {
    for (let i = 0; i < this.fieldIds.length; i++) {
      this.fields.push(this.querySelector('#' + this.fieldIds[i]));

      this.fields[i].addEventListener('keyup', e => {
        if (e.keyCode === 13) {
          this.querySelector('#add-event').click();
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
    this.querySelector('#startDate').setAttribute('value', `${year}-${month}-${day}`);
    this.querySelector('#startTime').setAttribute('value', '09:00');
    this.querySelector('#endDate').setAttribute('value', `${year}-${month}-${day}`);
    this.querySelector('#endTime').setAttribute('value', '09:30');
    this.querySelector('input-text').setAttribute('value', '');
    this.querySelector('#categoryField').setAttribute('value', '');
    this.querySelector('tag-select').setAttribute('reset', 'true');
  }

  initializeCategoriesField(data) {
    let field = this.querySelector('#categoryField');
    for (let i = 0; i < data.length; i++) {
      let option = document.createElement('select-option');
      option.innerHTML = data[i].category_name;
      option.setAttribute('value', data[i].id);
      field.appendChild(option);
    }
    window.dispatchEvent(new CustomEvent('select-field-options-received'));
  }

  get eventDate() {
    return this.getAttribute('event-date');
  }
}

window.customElements.define('calendar-events', CalendarEvents);

