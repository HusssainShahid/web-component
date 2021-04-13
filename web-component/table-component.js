const templateTable = document.createElement('template');
templateTable.innerHTML = `
<style>
    table, td, th {
         border: 1px solid #cccccc;
         text-align: left;
         font-size:13px;
    }
    table {
         border-collapse: collapse;
         width: 100%;
         overflow-x: scroll;
         border-radius: 5px;
    }
    th, td {
      padding: 7px;
    }
</style>
<slot name="caption"></slot>
<div style="overflow: auto">
<table>
    <thead></thead>
</table>
</div>
`;

export class DataTable extends HTMLElement {

  static get observedAttributes() {
    return ['header', 'data', 'key'];
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateTable.content.cloneNode(true));
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
    if (this.background !== null) {
      this.table.style.background = this.background;
    }
    if (this.color !== null) {
      this.table.style.color = this.color;
    }
    if (this.theadbg !== null) {
      this.shadowRoot.querySelector('thead').style.background = this.theadbg;
      this.shadowRoot.querySelector('thead').style.color = this.theadcolor;
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.header != null && this.data != null && this.key != null) {
      this.table.innerHTML=``;
      this.generateTable();
    }
  }

  generateTable() {
    this.generateHeading();
    this.generateData();
  }

  generateData() {
    this.tableData = JSON.parse(this.data);
    this.keyValues = this.key.split(',');
    this.table.createTBody();
    for (let i = 0; i < this.tableData.length; i++) {
      let row = this.table.insertRow(i);
      let keys = Object.keys(this.tableData[i]);
      let column=this.keyValues.length-1;
      for (let j = 0; j < keys.length; j++) {
        for (let k = 0; k < this.keyValues.length; k++) {
          if (this.keyValues[k] === keys[j]) {
            let data = row.insertCell(0);
            data.innerHTML = this.tableData[i][this.keyValues[column]]
            column--;
          }
        }
      }
    }
  }

  generateHeading() {
    this.heading = this.header.split(',');
    for (let i = 0; i < this.heading.length; i++) {
      let th = document.createElement('th');
      th.innerHTML = this.heading[i];
      this.table.createTHead().appendChild(th);
    }
  }

  get data() {
    return this.getAttribute("data")
  }

  get header() {
    return this.getAttribute("header")
  }

  get key() {
    return this.getAttribute("key")
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

  get theadbg() {
    return this.getAttribute("theadbg")
  }

  get theadcolor() {
    return this.getAttribute("theadcolor")
  }
}

window.customElements.define('data-table', DataTable);
