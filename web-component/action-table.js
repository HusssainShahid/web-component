const templateActiveTable = document.createElement('template');
templateActiveTable.innerHTML = `
<style>
    table, td, th {
         border: 1px solid #cccccc;
         text-align: left;
         font-size:14px;
    }
    table {
         border-collapse: collapse;
         width: 100%;
         overflow-x: scroll;
         border-radius: 5px;
    }
    th, td {
      padding: 9px;
    }
    .cursor-pointer{
        cursor: pointer;
    }
</style>
<slot name="caption"></slot>
<div style="overflow: auto">
<table>
    <thead></thead>
</table>
</div>
`;

export class ActionTable extends HTMLElement {

  static get observedAttributes() {
    return ['keys', 'data', 'actions'];
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateActiveTable.content.cloneNode(true));
  }

  connectedCallback() {
    this.table = this.shadowRoot.querySelector('table');
    this.styling();
  }

  styling() {
    if (this.dark) {
      this.table.style.background = '#343A40';
      this.table.style.color = 'white';
    }
    if (this.light) {
      this.table.style.background = '#f9f9f9';
    }
    this.table.style.background = this.background;
    this.table.style.color = this.color;
    this.shadowRoot.querySelector('thead').style.background = this.theadBg;
    this.shadowRoot.querySelector('thead').style.color = this.theadColor;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.keys != null && this.data != null && this.actions != null) {
      this.table.innerHTML = ``;
      this.generateTable();
    }
  }

  generateTable() {
    this._keys = JSON.parse(this.keys);
    this._actions = JSON.parse(this.actions);
    this._data = JSON.parse(this.data);
    this.generateHeading();
    this.generateData();
  }

  generateHeading() {
    for (let i = 0; i < this._keys.length; i++) {
      let th = document.createElement('th');
      th.innerHTML = this._keys[i].header;
      this.table.createTHead().appendChild(th);
    }
    for (let i = 0; i < this._actions.length; i++) {
      let th = document.createElement('th');
      th.innerHTML = this._actions[i].name;
      this.table.createTHead().appendChild(th);
    }
  }

  generateData() {
    this.table.createTBody();
    for (let i = 0; i < this._data.length; i++) {
      let row = this.table.insertRow(i);
      for (let j = 0; j < this._keys.length; j++) {
        let data = row.insertCell(-1);
        data.innerHTML = this._data[i][this._keys[j].key];
      }
      for (let j = 0; j < this._actions.length; j++) {
        let data = row.insertCell(-1);
        data.innerHTML = this._actions[j].icon;
        data.classList.add('cursor-pointer');
        data.addEventListener('click', e=>{
          window.dispatchEvent(new CustomEvent(this._actions[j].event, {bubbles: true, detail: this._data[i][this._actions[j].value]}));
        });
      }
    }
  }

  get data() {
    return this.getAttribute("data")
  }

  get keys() {
    return this.getAttribute("keys")
  }

  get actions() {
    return this.getAttribute("actions")
  }

  get background() {
    return this.getAttribute("background")
  }

  get color() {
    return this.getAttribute("color")
  }

  get dark() {
    return this.hasAttribute("dark")
  }

  get light() {
    return this.hasAttribute("light")
  }

  get theadBg() {
    return this.getAttribute("thead-bg")
  }

  get theadColor() {
    return this.getAttribute("thead-color")
  }
}

window.customElements.define('action-table', ActionTable);
