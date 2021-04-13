const templateRadioButton = document.createElement('template');
templateRadioButton.innerHTML = `
<input type="radio"><slot></slot><br>
`;

export class RadioButton extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateRadioButton.content.cloneNode(true));
  }

  connectedCallback() {
    this.checkedStatus();
  }

  checkedStatus() {
    this.shadowRoot.querySelector('input').checked = this.checked;
  }

  static get observedAttributes() {
    return ['checked'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.checkedStatus();
  }

  get checked() {
    return this.hasAttribute('checked');
  }
}

window.customElements.define('radio-button', RadioButton);
