import {TranslateString} from "../../translate-string";

import('../../tool-tip');
const templateLabelAccount = document.createElement('template');
templateLabelAccount.innerHTML = `
<style>
 #add-label-button{
    cursor: pointer;
 }   
 .label-account{
    display: flex;
 }
</style>
<div class="label-account">
    <span id="account"></span>
    </div>
    <slot></slot>
`;

class LabelAccount extends TranslateString {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateLabelAccount.content.cloneNode(true));
  }

  connectedCallback() {
    if (this.account) {
      this.shadowRoot.querySelector('#account').innerHTML = ` 
      <tool-tip trim="15" tooltip="${this.account}" content="${this.account}"></tool-tip>`;
    }
  }

  static get observedAttributes() {
    return ['account'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.account) {
      this.shadowRoot.querySelector('#account').innerHTML = ` 
      <tool-tip trim="15" tooltip="${this.account}" content="${this.account}"></tool-tip>`;
    }
  }

  get account() {
    return this.getAttribute('account');
  }
  get id(){
    return this.getAttribute('id');
  }
}

window.customElements.define('label-account', LabelAccount);

