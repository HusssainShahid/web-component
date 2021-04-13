import {SharedClass} from "../../../../src/shared/shared";
import {TranslateString} from "../../translate-string";

const templateEmailMessage = document.createElement('template');
templateEmailMessage.innerHTML = `
<style>
    span{
        color: #a1a1a1;
    }
    div{
        display: none;
    }
</style>
<span></span>
<div></div>
`;

export class EmailMessage extends TranslateString{
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateEmailMessage.content.cloneNode(true));
  }

  connectedCallback() {
    this.shared = new SharedClass();
    if(this.body){
      this.generateMessage();
    }
  }

  generateMessage(){
    let div = this.shadowRoot.querySelector('div');
    div.innerHTML = this.body;
    this.message = '';
    for (let i = 0; i < div.children.length; i++) {
      if (div.children[i].tagName !== 'STYLE' && div.children[i].tagName !== 'META' && div.children[i].tagName !== 'TITLE' && div.children[i].tagName !== 'SCRIPT') {
        this.message = this.message + div.children[i].textContent.replace(/^\s+|\s+$/gm, ' ').trim();
      }
    }
    this.message = this.message.replace(/(\r\n|\n|\r)/gm, "");
    this.message = this.message.replace(/\u00A0/g, '');
    this.shadowRoot.querySelector('span').innerText = this.shared.trimText(this.message, parseInt(this.length));
  }
  static get observedAttributes() {
    return ['body', 'length'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.body) {
      this.generateMessage();
    }
  }
  get body() {
    return this.getAttribute('body')
  }

  get length() {
    return this.getAttribute('length')
  }
}

window.customElements.define('email-message', EmailMessage);
