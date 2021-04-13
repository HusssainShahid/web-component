import {EmailClientApi} from "../../email-client-api";

import ('../../../button-component');
import ('../../../form/form-field');
import ('../../../form/select-field');
import ('../../../form/select-option');
import ('../../../form/input-text');
import ('../../../form/input-number');
import ('../../../form/email-address-input');
import ('../../../form/password-field');
import ('../../../horizontal-tab/horizontal-tab.js');
import ('../../../horizontal-tab/tab-button.js');
import ('../../../horizontal-tab/tab-view.js');
import ('../../configuration-hints/gmail-hint.js');
import {fields} from '../../../form/fields';
import {MailServer} from "../mail-server";
import {TranslateString} from "../../../translate-string";

const templateAddAccount = document.createElement('template');
templateAddAccount.innerHTML = `
<style>
    .d-flex{
        display: flex;
    }
    horizontal-tab{
        width: 50%;
    }
        .form-container{
        margin: 0 auto;
        border: 1px solid #e6e6e6;
        border-radius: 5px;
        width: 50%;
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
<div class="d-flex">
    <div class="form-container">
    <span data-tranlation="For configuration hint">For configuration hint</span><a href="https://www.dell.com/support/kbdoc/en-pk/000148879/how-to-set-up-3rd-party-emails-in-outlook" target="_blank" style="padding-left: 5px;" data-translate="Click here">Click here</a>
     <form-field event="add-account-form-submitted">
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
        <email-address required placeholder="Enter your email" data-placeholder="Enter your email" key="user_name"></email-address>
        <label data-translate="Password">Password</label>
        <password-field placeholder="Enter you password" data-placeholder="Enter you password" required></password-field>
       <div class="submit-button" slot="submit">
          <button-component content="Add" data-content="Add" is="primary"></button-component>
      </div>
      <div id="accountConfigurationError" class="error-message"></div>
      <div id="credentialsError" class="error-message"></div>
      <div id="imapEnablingError" class="error-message"></div>
     </form-field>
</div>
    <horizontal-tab>
        <tab-button slot="tab-button" target-id="gmail">Gmail</tab-button>
<!--        <tab-button slot="tab-button" target-id="outlook">Outlook</tab-button>-->
<!--        <tab-button slot="tab-button" target-id="yahoo">Yahoo</tab-button>-->
        <tab-view slot="tab-view" id="gmail">
            <gmail-hint></gmail-hint>
        </tab-view>
<!--        <tab-view slot="tab-view" id="outlook">-->
<!--            Outlook hint-->
<!--        </tab-view>-->
<!--        <tab-view slot="tab-view" id="yahoo">-->
<!--            Yahoo hint-->
<!--        </tab-view>-->
    </horizontal-tab>
</div>
`;

export class AddAccount extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateAddAccount.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new EmailClientApi();
    this.formKeys = ['accountType', 'incomingMailServer', 'incomingServerPort', 'outgoingMailServer', 'outgoingServerPort', 'userEmail', 'userPassword']
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.accountDetail = {
      account_type: 'imap',
      incoming_server: 'imap.gmail.com',
      incoming_port: '993',
      outgoing_server: "smtp.gmail.com",
      outgoing_port: "587",
    }
    this.api.getUserEmail();
    this.events();
  }

  events() {
    window.addEventListener('user-email-address-received', e => {
      this.accountDetail.user_name = e.detail;
      this.getFields();
      this.addValues();
    })
    window.addEventListener('add-account-form-submitted', e => {
      this.accountDetail = e.detail;
      this.validateServer();
    })

    window.addEventListener('user-configuration-response-received', e => {
      this.configurationResponseManagement(e.detail);
    })
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
    if (valid) {
      this.api.configureUser(this.accountDetail);
    }
  }

  configurationResponseManagement(data) {
    this.shadowRoot.querySelector('#accountConfigurationError').innerHTML = ''
    this.shadowRoot.querySelector('#credentialsError').innerHTML = ''
    this.shadowRoot.querySelector('#imapEnablingError').innerHTML = ''
    if (data.status) {
      window.dispatchEvent(new CustomEvent('configured-email-account-clicked'))
      this.api.getConfiguredAccounts();
    } else {
      this.shadowRoot.querySelector('#accountConfigurationError').innerHTML = 'Server Error:Could not authenticate account.'
      if (data.message.toString().includes('Invalid credentials')) {
        this.shadowRoot.querySelector('#credentialsError').innerHTML = 'Server Error: Invalid credentials. Too many login failures!';
        this.shadowRoot.querySelector('#accountConfigurationError').innerHTML = ''
        this.shadowRoot.querySelector('#imapEnablingError').innerHTML = ''
      } else if (data.toString().includes('Your account is not enabled for IMAP use')) {
        this.shadowRoot.querySelector('#imapEnablingError').innerHTML = 'Server Error: Your account is not enabled for IMAP use. Please visit your Gmail settings page and enable your account for IMAP access!';
        this.shadowRoot.querySelector('#accountConfigurationError').innerHTML = ''
        this.shadowRoot.querySelector('#credentialsError').innerHTML = ''
      }
    }
  }

}

window.customElements.define('add-account', AddAccount);
