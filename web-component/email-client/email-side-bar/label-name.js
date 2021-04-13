import {EmailRouting} from "../email-routing";
import {TranslateString} from "../../translate-string";

import('../../tool-tip');

const templateLabelName = document.createElement('template');
templateLabelName.innerHTML = `
<style>
    #name{
        padding-left: 30px;
        cursor:pointer;
    }
    #name:hover{
        color: blue;
    }
    .active{
       font-weight: bold;
     }
</style>
<span id="name" class="active"></span>
`;

class LabelName extends TranslateString {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateLabelName.content.cloneNode(true));
  }

  connectedCallback() {
    this.route= new EmailRouting();
    this.shadowRoot.querySelector('#name').classList.remove('active');
    this.activeLabel();
    if (this.name) {
      this.shadowRoot.querySelector('#name').innerHTML = `
      <tool-tip trim="10" tooltip="${this.name}" content="${this.name}"></tool-tip>
      `;
    }
    this.addEventListener('click', e => {
      this.route.pushRoute(this.name);
      this.activeLabel();
      window.dispatchEvent(new CustomEvent('email-label-clicked', {
        bubbles: true,
        detail: {id: this.id, account_id: this.accountId}
      }));
      window.addEventListener('email-top-nav-link-status', e=>{
        if (this.name !== window.location.pathname.split('/')[4]) {
          this.shadowRoot.querySelector('#name').classList.remove('active');
        }
      });
      window.dispatchEvent(new CustomEvent('email-top-nav-link-status', {bubbles: true, detail: []}));
    });
  }

  activeLabel(){
    if (this.name === window.location.pathname.split('/')[4]) {
      this.shadowRoot.querySelector('#name').classList.add('active');
    }
  }
  static get observedAttributes() {
    return ['name'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.name) {
      this.shadowRoot.querySelector('#name').innerHTML = `
      <tool-tip trim="10" tooltip="${this.name}" content="${this.name}"></tool-tip>
      `;
    }
  }

  get name() {
    return this.getAttribute('name');
  }

  get id() {
    return this.getAttribute('id');
  }

  get accountId() {
    return this.getAttribute('account-id');
  }
}

window.customElements.define('label-name', LabelName);

