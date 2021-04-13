import {EmailClientApi} from "../../email-client-api";

import ('../../../button-component');
import ('../../../form/form-field');
import ('../../../form/select-field');
import ('../../../form/select-option');
import ('../../../form/input-text');
import ('../../../form/input-number');
import ('../../../form/email-address-input');
import ('../../../form/password-field');
import {fields} from '../../../form/fields';
import {MailServer} from "../mail-server";
import {TranslateString} from "../../../translate-string";
const templateEditAccount = document.createElement('template');
templateEditAccount.innerHTML = `
<style>
        .container{
        margin: 0 auto;
        border: 1px solid #e6e6e6;
        border-radius: 5px;
        width: 450px;
        max-width: 900px;
        padding: 5%;
        position: relative;
    }
    .submit-button{
        margin-top: 20px;
        text-align: right;
    }
    .heading{
        padding: 0;
        font-size: var(--text-heading, 28px);
    }
    @media only screen and (max-width: 500px) {
    .container {
        width: 89%;
    }
  }
      label{
        font-size: var(--text-label, 17px);
    }
    .move-to-configured-accounts{
        cursor: pointer;
    }
     #incoming-mail-server-error,#outgoing-mail-server-error,.error-message{
    color:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1));
    font-size: var(--text-caption, 14px);
    margin: 2px;
  }
</style>
<div class="container">
    <div class="move-to-configured-accounts">
      <?xml version="1.0" encoding="utf-8"?>
      <svg width="15" height="15" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1664 896v128q0 53-32.5 90.5t-84.5 37.5h-704l293 294q38 36 38 90t-38 90l-75 76q-37 37-90 37-52 0-91-37l-651-652q-37-37-37-90 0-52 37-91l651-650q38-38 91-38 52 0 90 38l75 74q38 38 38 91t-38 91l-293 293h704q52 0 84.5 37.5t32.5 90.5z"/></svg>
    </div>
     <form-field event="update-email-account-form-submitted">
        <label data-tranlate="Account Type">Account Type</label>
        <select-field key="account_type" required>
          <select-option value="imap" data-translate="IMAP">IMAP</select-option>  
          <select-option value="pop" data-translate="POP">POP</select-option>
        </select-field>
        <label data-translate="Incoming Mail Server">Incoming Mail Server</label>
        <input-text placeholder="Incoming Mail Server" data-placeholder="Incoming Mail Server" required key="incoming_server"></input-text>
        <p id="incoming-mail-server-error"></p>
        <label data-translate="Port">Port</label>
        <input-number placeholder="port" data-placeholder="port" required min="1" max="65535" key="incoming_port"></input-number>
        <label data-translate="Outgoing Mail Server">Outgoing Mail Server</label>
        <input-text placeholder="Outgoing Mail Server" data-placeholder="Outgoing Mail Server" required key="outgoing_server"></input-text>
        <p id="outgoing-mail-server-error"></p>
        <label data-translate="Port">Port</label>
        <input-number placeholder="port" data-placeholder="port"  min="1" max="65535" required key="outgoing_port"></input-number>
        <label data-translate="Email Address">Email Address</label>
        <email-address required data-placeholder="Enter your email" placeholder="Enter your email" key="user_name"></email-address>
        <label data-translate="Password">Password</label>
        <password-field data-placeholder="Enter you password" placeholder="Enter you password" required></password-field>
       <div class="submit-button" slot="submit">
          <button-component content="Update" data-content="Update" is="primary"></button-component>
      </div>
      <div id="accountConfigurationError" class="error-message"></div>
      <div id="credentialsError" class="error-message"></div>
      <div id="imapEnablingError" class="error-message"></div>
     </form-field>
</div>`;

export class EditAccount extends TranslateString{
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateEditAccount.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new EmailClientApi();
    this.formKeys = ['accountType', 'incomingMailServer', 'incomingServerPort', 'outgoingMailServer', 'outgoingServerPort', 'userEmail', 'userPassword']
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.accountDetail=[];
    let configuredAccounts = this.shadowRoot.querySelector('.move-to-configured-accounts');
    configuredAccounts.addEventListener('click', e => {
      window.dispatchEvent(new CustomEvent('configured-email-account-clicked'))
    })
    this.events();
    this.api.getUserEmail();
  }

  events() {
    window.addEventListener('email-account-edit-clicked',e=>{
      this.accountDetail = e.detail;
      this.account=e.detail;
      this.getFields();
      this.addValues();
    });
    window.addEventListener('update-email-account-form-submitted', e => {
      this.accountDetail = e.detail;
      this.validateServer();
    })
  }


  validateServer() {
    let valid = true;
    try {
      let incomingMailServer = new MailServer(this.accountDetail.incomingMailServer);
      this.shadowRoot.querySelector('#incoming-mail-server-error').innerHTML = '';
    } catch (e) {
      valid = false
      this.shadowRoot.querySelector('#incoming-mail-server-error').innerHTML = 'Invalid Incoming Mail Server.'
    }
    try {
      let outGoingMailServer = new MailServer(this.accountDetail.outgoingMailServer);
      this.shadowRoot.querySelector('#outgoing-mail-server-error').innerHTML = ''
    } catch (e) {
      valid = false;
      this.shadowRoot.querySelector('#outgoing-mail-server-error').innerHTML = 'Invalid Outgoing Mail Server.'
    }
    if(valid){
      this.api.updateUserConfiguration(this.accountDetail, this.account);
    }
  }

  getFields() {
    this.fields = [];
    let form = this.shadowRoot.querySelector('form-field');
    for (let i = 0; i < form.children.length; i++) {
      for (let j = 0; j < fields.length; j++) {
        if (fields[j] === form.children[i].tagName.toLowerCase()) {
          this.fields.push(form.children[i]);
        }
      }
    }
    return this.fields;
  }

  resetFields() {
    for (let i = 0; i < this.fields.length; i++) {
      this.fields[i].setAttribute('value', '');
    }
  }

  addValues() {
    this.resetFields();
    for (let i = 0; i < this.fields.length; i++) {
      for (let j = 0; j < Object.keys(this.accountDetail).length; j++) {
        if (this.fields[i].getAttribute('key') === Object.keys(this.accountDetail)[j]) {
          this.fields[i].setAttribute('value', this.accountDetail[Object.keys(this.accountDetail)[j]]);
        }
      }
    }
  }

}

window.customElements.define('edit-account', EditAccount);
