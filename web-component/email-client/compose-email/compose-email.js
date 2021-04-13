import {EmailClientApi} from "../email-client-api";
import {SharedClass} from "../../../../src/shared/shared";
import {TranslateString} from "../../translate-string";

import ('../../form/tag-input');
import ('../../form/form-field')
import ('../../form/email-address-input')
import ('../../form/input-text');
import ('../../form/select-field');
import ('../../form/select-option');
import ('../../form/text-area');
import ('../../file-upload');
const templateComposeEmail = document.createElement('template');
templateComposeEmail.innerHTML = `
<style>
    .compose-email{
        padding: 1% 2%;
        position: relative;
        border: 1px solid #cccccc;
        margin: 1%;
        border-radius: 3px;
    }
    .submit-button{
        text-align: right;
    }
    .heading{
        padding: 0;
        font-size: var(--text-heading, 28px);
    }
    label{
        font-size: var(--text-label, 17px);
    }
    .cc-bcc{
       cursor: pointer;
        padding: 0 5px;
        opacity: 8;
        font-size: var(--text-caption, 14px);
        flex-grow: 0;
        text-decoration: underline;
    }
    .flex-container{
        display: flex;
        align-items: stretch;
    }
   .padding-r{
        padding-right: 10px;
   }
   .flex-grow-1{
        flex-grow: 1;
   }
   .flex-grow-8{
        flex-grow: 8;
   }
   .border-bottom{
        border-bottom: 1px solid #cccccc;
   }
   </style>
<div class="compose-email">
  <form-field event="compose-email-form-submitted">
  <div class="flex-container border-bottom">
    <label class="flex-grow-1 padding-r" data-translate="To">To</label>
    <tag-input required class="flex-grow-8" border-none hint="false"></tag-input>
    <span class="cc-bcc" id="cc" data-translate="CC">CC</span>
    <span class="cc-bcc" id="bcc" data-translate="BCC">BCC</span>
  </div>
  <div class="flex-container cc-container">
    <label class="cc-label flex-grow-1 padding-r" style="display: none" data-translate="CC">CC</label>
    <tag-input class="cc-field flex-grow-8" border-none style="display: none" hint="false"></tag-input>
  </div>
  <div class="flex-container bcc-container">
    <label class="bcc-label flex-grow-1 padding-r" style="display: none" data-translate="BCC">BCC</label>
    <tag-input class="bcc-field flex-grow-8" border-none style="display: none" hint="false"></tag-input>
  </div>
  <div class="flex-container border-bottom">
    <label class="flex-grow-1 padding-r" data-translate="Subject">Subject</label>
    <input-text class="flex-grow-8" max="1000" min="2" border-none required></input-text>
  </div>
  <div class="flex-container border-bottom">
    <label class="flex-grow-1 padding-r" data-translate="From">From</label>
    <select-field class="flex-grow-8" border-none></select-field>
  </div>
  <text-area border-none height="57vh"></text-area>
  <div class="flex-container">
  <file-upload multiple event="compose-email-selected-files">
      <span slot="upload-button">
          <button-component content="Add Attachment" data-content="Add Attachment" background="#e9ecef" color="#000000"></button-component>        
      </span>
  </file-upload>
    <div class="submit-button" style="margin-left:auto">
      <button-component content="Send" data-content="Send" is="primary"></button-component>
  </div>
</div>
<div slot="submit" style="display: none" id="submit-form"></div>
  </form-field>
</div>
`;

export class ComposeEmail extends TranslateString {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateComposeEmail.content.cloneNode(true));
  }

  connectedCallback() {
    this.formKeys = ['to', 'cc', 'bcc', 'subject', 'idEmailAccount', 'message'];
    this.attachments = [];
    this.api = new EmailClientApi();
    this.shared = new SharedClass();
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.initializeComponent();
    this.setValidationToTagInput();
    this.event();
    this.api.getUserAccounts();
  }

  event() {
    window.addEventListener('user-active-email-received', e => {
      this.showActiveAccounts(e.detail);
    });
    window.addEventListener('compose-email-selected-files', e => {
      this.attachments = e.detail;
    });
    window.addEventListener('email-message-sent', e => {
      window.dispatchEvent(new CustomEvent('dashboard-link-clicked', {
        bubbles: false,
        detail:'email'
      }));
    });
    window.addEventListener('compose-email-form-submitted', e => {
      let body = e.detail;
      let formData = new FormData();
      for (let key in body) {
        formData.append(key, body[key]);
      }
      for (let i = 0; i < this.attachments.length; i++) {
        formData.append('images[]', this.attachments[i].detail);
      }
      this.attachments='';
      this.api.sendEmail(formData);
    });
    this.shadowRoot.querySelector('.submit-button').addEventListener('click', e => {
      this.shadowRoot.querySelector('#submit-form').click();
    });
  }

  showActiveAccounts(data) {
    let fromField = this.shadowRoot.querySelector('select-field');
    for (let i = 0; i < data.length; i++) {
      let option = document.createElement('select-option');
      option.innerText = data[i].user_name;
      option.setAttribute('value', data[i].id)
      fromField.appendChild(option);
    }
    window.dispatchEvent(new CustomEvent('select-field-options-received'));
  }

  setValidationToTagInput() {
    let tagInput = this.shadowRoot.querySelectorAll('tag-input');
    let regex = '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    for (let i = 0; i < tagInput.length; i++) {
      tagInput[i].setAttribute('regex', regex);
    }
  }

  initializeComponent() {
    this.shadowRoot.querySelector('#cc').addEventListener('click', e => {
      this.showDiv('.cc-label');
      this.showDiv('.cc-field');
      this.shadowRoot.querySelector('#cc').style.display = 'none';
      this.shadowRoot.querySelector('.cc-container').classList.add('border-bottom');
      this.shadowRoot.querySelector('text-area').setAttribute('height', '46vh');
      if (this.shadowRoot.querySelector('#bcc').style.display === '') {
        this.shadowRoot.querySelector('text-area').setAttribute('height', '52vh');
      } else {
        this.shadowRoot.querySelector('text-area').setAttribute('height', '46vh');
      }
    })
    this.shadowRoot.querySelector('#bcc').addEventListener('click', e => {
      this.showDiv('.bcc-label');
      this.showDiv('.bcc-field');
      this.shadowRoot.querySelector('#bcc').style.display = 'none';
      this.shadowRoot.querySelector('.bcc-container').classList.add('border-bottom')
      if (this.shadowRoot.querySelector('#cc').style.display === '') {
        this.shadowRoot.querySelector('text-area').setAttribute('height', '52vh');
      } else {
        this.shadowRoot.querySelector('text-area').setAttribute('height', '46vh');
      }
    })
  }

  showDiv(div) {
    this.shadowRoot.querySelector(div).style.display = 'inline';
  }
}

window.customElements.define('email-compose', ComposeEmail);

