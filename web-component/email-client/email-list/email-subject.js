import {SharedClass} from "../../../../src/shared/shared";
import {TranslateString} from "../../translate-string";

const templateEmailSubject = document.createElement('template');
templateEmailSubject.innerHTML = `
<span></span>
`;

export class EmailSubject extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateEmailSubject.content.cloneNode(true));
  }

  connectedCallback() {
    this.shared = new SharedClass();
    if(this.subject){
      this.shadowRoot.querySelector('span').innerText = this.shared.trimText(this.subject, 60);
    }  }

  static get observedAttributes() {
    return ['subject'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if(this.subject){
      this.shadowRoot.querySelector('span').innerText = this.shared.trimText(this.subject, 60);
    }
  }

  get subject() {
    return this.getAttribute('subject')
  }
}

window.customElements.define('email-subject', EmailSubject);
