import ('../drop-down/drop-down');
import ('../button-component');
const templateCalendarHeader = document.createElement('template');
templateCalendarHeader.innerHTML = `
<style>
    .calendar-header-container{
        display: flex;
        flex-wrap: nowrap;
        margin: 12px 20px;
    }
    .calendar-header-container > *{
        margin: 0 5px;
    }
    #render-range{
        margin: 7px 2px;
        font-size: 19px;
        color: #4f4e4e;
    }
</style>
<div class="calendar-header-container">
   <drop-down event="calendar-view-dropdown-value-changed" id="calendar-view-dropdown" value="month" border></drop-down>
   <button-component content="Today" background="white" color="black" id="today-range" border="1px solid #cccccc"></button-component>
   <button-component content="Pre" background="white" color="black" id="pre-range" border="1px solid #cccccc"></button-component>
   <button-component content="Next" background="white" color="black" id="next-range" border="1px solid #cccccc"></button-component>
   <span id="render-range"></span>
</div>
`;

export class CalendarHeader extends HTMLElement {

  constructor() {
    super();
    this.appendChild(templateCalendarHeader.content);
  }

  static get observedAttributes() {
    return ['range'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.querySelector('#render-range').innerHTML = this.range;
  }

  connectedCallback() {
    this.events();
    this.calendarView = [
      {value: 'day', content: 'Daily'},
      {value: 'week', content: 'Week'},
      {value: 'month', content: 'Month'}
    ]
    this.querySelector('#calendar-view-dropdown').setAttribute('options', JSON.stringify(this.calendarView));
  }

  events() {
    this.querySelector('#pre-range').addEventListener('click', e => {
      window.dispatchEvent(new CustomEvent('change-calendar-view', {bubbles: true, detail: 'pre'}));
    })
    this.querySelector('#next-range').addEventListener('click', e => {
      window.dispatchEvent(new CustomEvent('change-calendar-view', {bubbles: true, detail: 'next'}));
    })
    this.querySelector('#today-range').addEventListener('click', e => {
      window.dispatchEvent(new CustomEvent('change-calendar-view', {bubbles: true, detail: 'today'}));
    })
    window.addEventListener('calendar-view-dropdown-value-changed', e => {
      window.dispatchEvent(new CustomEvent('change-calendar-view', {bubbles: true, detail: e.detail}));
    })
  }

  get range() {
    return this.getAttribute('range');
  }
}

window.customElements.define('calendar-header', CalendarHeader);

