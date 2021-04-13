import Calendar from 'tui-calendar';
import "tui-calendar/dist/tui-calendar.css";
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import '../pop-up';
import './calendar-events';
import moment from 'moment';
import {CalendarApi} from "./calendar-api";

import ('./calendar-header');
const templateToastCalendar = document.createElement('template');
templateToastCalendar.innerHTML = `
<style>
.display-flex {
  display: flex;
  flex-wrap: nowrap;
  margin-right: -15px;
  margin-left: -15px;
}
.side-bar{
    width: 0;/*add width 240 after adding side nav component*/
    z-index: 0;
    top: 58px;
    left: 0;
    overflow-x: hidden;
    padding: 10px 0 10px 10px;
    border-right: 1px solid #E8E8E8;
    min-height: 97vh;
    margin: 0;
    transition: width 0.5s;
  }
  @media only screen and (max-width: 600px) {
   .sie-bar{
        width: 0;
   }
}
  .calendar-container{
      width: 100%;
      height: 100%;
      overflow-y: hidden;
      margin: 2px;
      padding: 10px;
      border:1px solid black
  }
</style>
<div class="display-flex">
  <div class="side-bar">
      <calendar-sidebar></calendar-sidebar>
  </div>
  <div class="calendar-container">
    <calendar-header></calendar-header>
    <div id="calendar" height="800px"></div>
  </div>
</div>
<pop-up id="calendar-event-modal">
    <div slot="open-modal"></div>
    <div slot="modal-body" id="calendar-event-modal-body">
        <calendar-events></calendar-events>
    </div>
</pop-up>
`;

export class ToastCalendar extends HTMLElement {

  constructor() {
    super();
    this.appendChild(templateToastCalendar.content);
  }

  connectedCallback() {
    this.api= new CalendarApi();
    this.api.getEvents();
    this.api.teamMembers();
    this.initializeCalendar();
    // this.setSchedule();
    this.events();
    this.activeView = 'month';
    this.months = ["January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"];
    this.setRange();
  }

  events() {
    window.addEventListener('change-calendar-view', e => {
      this.changeView(e.detail);
      this.setRange();
    });
    window.addEventListener('calendar-event-saved', e => {
      this.querySelector('#calendar-event-modal').setAttribute('show', 'false');
    });

    this.calendar.on({
      'clickSchedule': function(e) {
        console.log('clickSchedule', e);
      },
      'beforeCreateSchedule': function(e) {
        this.querySelector('#calendar-event-modal').setAttribute('show', 'true');
        this.querySelector('calendar-events').setAttribute('event-date', e.start._date);
        e.guide.clearGuideElement();
      }.bind(this),
    });
  }

  changeView(option) {
    if (option === 'pre') {
      this.calendar.prev();
    } else if (option === 'next') {
      this.calendar.next();
    } else if (option === 'today') {
      this.calendar.today();
    } else {
      this.activeView = option.value;
      this.calendar.changeView(option.value, true);
    }
  }

  setRange() {
    let range;
    if (this.activeView === 'day') {
      range = this.calendar.getDate().getDate() + ' ' +this.months[this.calendar.getDate().getMonth()] + ',' + this.calendar.getDate().getFullYear();
    } else if (this.activeView === 'month') {
      range = this.months[this.calendar.getDate().getMonth()] + ' ' + this.calendar.getDate().getFullYear();
    } else {
      range = moment(this.calendar.getDateRangeStart().getTime()).format('YYYY.MM.DD') + ' ~ ' + moment(this.calendar.getDateRangeEnd().getTime()).format(' MM.DD');
    }
    this.querySelector('calendar-header').setAttribute('range', range);
  }

  initializeCalendar() {
    this.calendar = new Calendar(this.querySelector('#calendar'), {
      defaultView: "month",
      taskView: true,
      scheduleView: ['time'],
      // template: this.templates,
      useCreationPopup: false,
      useDetailPopup: false,
    });
  }

  setSchedule() {
    this.calendar.createSchedules([
      {
        id: '1',
        calendarId: '1',
        title: 'my schedule',
        category: 'time',
        dueDateClass: '',
        start: '2020-09-01T22:30:00+09:00',
        end: '2020-09-02T02:30:00+09:00'
      },
      {
        id: '3',
        calendarId: '1',
        title: 'HEN schedule',
        category: 'time',
        dueDateClass: '',
        start: '2020-09-05T22:30:00+09:00',
        end: '2020-09-06T02:30:00+09:00'
      },
      {
        id: '2',
        calendarId: '1',
        title: 'second schedule',
        category: 'time',
        dueDateClass: '',
        start: '2020-09-03T17:30:00+09:00',
        end: '2020-09-04T17:31:00+09:00',
      }
    ]);
  }
}

window.customElements.define('toast-calendar', ToastCalendar);

