import {SharedClass} from "../../../../src/shared/shared";
import {TranslateString} from "../../translate-string";

const templateEmailName = document.createElement('template');
templateEmailName.innerHTML = `
<span></span>
`;

export class EmailName extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateEmailName.content.cloneNode(true));
  }

  connectedCallback() {
    this.shared = new SharedClass();
    if (this.name) {
      this.shadowRoot.querySelector('span').innerText = this.name;
    }
  }

  static get observedAttributes() {
    return ['name'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.name) {
      this.shadowRoot.querySelector('span').innerText = this.name;
    }
  }

  get name() {
    return this.getAttribute('name')
  }
}

window.customElements.define('email-name', EmailName);
