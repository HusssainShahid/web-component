const templateCustomDate = document.createElement('template');
templateCustomDate.innerHTML = `
<span></span>
`;

export class CustomDate extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateCustomDate.content.cloneNode(true));
  }

  connectedCallback() {
    this.months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if(this.date){
      this.getTodayDate();
      this.trimDate();
      this.shadowRoot.querySelector('span').innerText = this.setDate();
    }
  }

  setDate() {
    if(!this.date){
      return
    }
    if (this.todayDate.day === this.obtainedDate.day && this.todayDate.month === this.obtainedDate.month && this.todayDate.year === this.obtainedDate.year) {
      return this.getTime();
    } else if (this.todayDate.year === this.obtainedDate.year) {
      return this.months[parseInt(this.obtainedDate.month) - 1] + ' ' + this.obtainedDate.day
    } else {
      return this.months[parseInt(this.obtainedDate.month) - 1] + '/' + this.obtainedDate.day + '/' + this.obtainedDate.year;
    }
  }

  getTime() {
    let hours = this.date.slice(11, 13);
    let minutes = this.date.slice(14, 16);
    let newFormat = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    if (minutes.length > 2) {
      minutes = minutes.slice(0, 2)
    }
    return hours + ':' + minutes + ' ' + newFormat;
  }

  getTodayDate() {
    let date = new Date();
    return this.todayDate = {
      day: date.getDate().toString(),
      month: [date.getMonth() + 1].toString(),
      year: date.getFullYear().toString()
    }
  }

  trimDate() {
    if (this.date.slice(5, 6) === '0') {
      return this.obtainedDate = {
        day: this.date.slice(8, 10),
        month: this.date.slice(6, 7),
        year: this.date.slice(0, 4),
      };
    } else {
      return this.obtainedDate = {
        day: this.date.slice(8, 10),
        month: this.date.slice(5, 7),
        year: this.date.slice(0, 4),
      };
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.getTodayDate();
    this.trimDate();
    this.shadowRoot.querySelector('span').innerText = this.setDate();
  }

  static get observedAttributes() {
    return ['date'];
  }

  get date() {
    return this.getAttribute('date')
  }
}

window.customElements.define('custom-date', CustomDate);
