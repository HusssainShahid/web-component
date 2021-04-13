const templateDropDown = document.createElement('template');
templateDropDown.innerHTML = `
<style>
  .text-center{
      text-align: center;
  }
  .dropdown {
    position: relative;
    font-size: var(--text-caption, 14px);
    padding: 5px 10px;
    min-width: 65px;
    margin: 4px 2px;
  }
  .border{
    border-radius: 3px;
    border: 1px solid #cccccc;
  }
  .cursorPointer{
      cursor: pointer;
  }
  
  .dropdown:hover .dropdown-content {
    display: block;
  }
  .dropdown-content {
    display: none;
    position: absolute;
    background-color: var(--primary-base);
    min-width: 160px;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    z-index: 1;
    border-radius: 4px;
    padding: 5px 0;
    left: 0;
    top: 25px;
  }
  .dropdown-content-link{
      padding: 5px 16px;
      text-decoration: none;
      display: block;
      color: var(--primary-text) !important;
      background: var(--secondary-base);
      text-align: left;
      font-size: var(--text-caption, 14px);
  }
  .dropdown-content-link:hover {
    background-color: var(--primary-base);
  }
  </style>
  <div class="dropdown">
  <span class="cursorPointer" id="label"></span>
      <div class="dropdown-content"></div>&#9660;
</div>
`;

class DropDown extends HTMLElement {

  static get observedAttributes() {
    return ['options', 'selected'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.initializeComponent();
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateDropDown.content.cloneNode(true));
  }

  connectedCallback() {
    this.initializeComponent();
  }

  initializeComponent() {
    this.dropDownContent = [];
    this.dropDownContent = JSON.parse(this.options);
    this.setLabel();
    this.addOptions(this.dropDownContent);
    this.initializeStyle();
  }

  addOptions(options) {
    let optionContainer = this.shadowRoot.querySelector('.dropdown-content');
    optionContainer.innerHTML = ``;
    for (let i = 0; i < options.length; i++) {
      let option = document.createElement('a');
      option.classList.add('dropdown-content-link')
      option.setAttribute('href', 'javascript:void(0)');
      option.setAttribute('value', this.dropDownContent[i].value);
      option.innerText = options[i].content;
      if(this.value===options[i].value){
        this.shadowRoot.querySelector('#label').innerHTML = this.dropDownContent[i].content;
      }
      optionContainer.appendChild(option)
      option.addEventListener('click', e => {
        this.selectOption(i);
      });
    }
  }

  selectOption(i) {
    this.setAttribute('value', this.dropDownContent[i].value);
    this.shadowRoot.querySelector('#label').innerHTML = this.dropDownContent[i].content;
    window.dispatchEvent(new CustomEvent(this.event, {bubbles: true, detail: this.dropDownContent[i]}));
  }

  setLabel() {
    if (this.label) {
      this.shadowRoot.querySelector('#label').innerHTML = this.label;
    } else {
      this.shadowRoot.querySelector('#label').innerHTML = this.dropDownContent[0].content;
    }
  }

  initializeStyle() {
    if (this.border) {
      this.shadowRoot.querySelector('.dropdown').classList.add('border');
    }
    if (this.background) {
      this.shadowRoot.querySelector('.dropdown').style.background=this.background;
    }
    if (this.color) {
      this.shadowRoot.querySelector('.dropdown').style.color=this.color;
    }
  }

  get options() {
    return this.getAttribute('options');
  }

  get label() {
    return this.getAttribute('label');
  }

  get event() {
    return this.getAttribute('event');
  }
  get value() {
    return this.getAttribute('value');
  }

  get border() {
    return this.hasAttribute('border');
  }

  get background() {
    return this.getAttribute('background');
  }

  get color() {
    return this.getAttribute('color');
  }
}

window.customElements.define('drop-down', DropDown);

