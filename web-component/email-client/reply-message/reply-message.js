import {EmailClientApi} from "../email-client-api";
import environment from "../../../../src/environment";
import {TranslateString} from "../../translate-string";

import ('../../form/form-field')
import ('../../form/email-address-input')
import ('../../form/input-text');
import ('../../form/autogrow-textarea');
import ('../../file-upload');
import ('../../responsive-img');
const templateReplyMessage = document.createElement('template');
templateReplyMessage.innerHTML = `
<style>
    .image-section{
        display: flex;
        flex-wrap: wrap;
    }
    .container{
        display: flex;
    }
      .form, .message-body{
        margin: 1%;
        border: 1px solid #e6e6e6;
        border-radius: 5px;
        width: 50%;
        max-width: 900px;
        padding: 2%;
        position: relative;
    }
    .message-body{
        height: 500px;
        overflow: scroll;
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
    .form ,.message-body{
        width: 89%;
    }
  }
      .file{
        background: #EDEDED;
        color: #635FCD;
        position: relative;
        font-weight: bold;
        display: inline;
        margin: 5px;
        border-radius: 4px;
        padding: 5px 10px;
        cursor: pointer;
    }
      label, #message-description{
        font-size: var(--text-label, 17px);
    }
</style>
<div class="container">
<div class="message-body">
    <p id="message-description"></p>
    <p id="subject"></p>
    <div id="message-html"></div>
    <div class="image-section"></div>
    <div class="file-section"></div>
</div>
<div class="form">
  <div class="heading" data-translate="Reply message">Reply message</div>
  <form-field event="reply-message-form-submitted">
    <label data-translate="To">To</label>
    <email-address disable placeholder="To" data-placeholder="To" id="to-field"></email-address> 
    <label data-translate="From">From</label>
    <email-address disable placeholder="From" data-placeholder="From" id="from-field"></email-address>
    <label data-translate="Message">Message</label>
    <autogrow-textarea placeholder="Message" data-placeholder="Message" id="message-field"></autogrow-textarea>
    <file-upload multiple event="reply-email-selected-files">
        <div slot="upload-button">
            <button-component content="Add Attachment" data-content="Add Attachment" background="#e9ecef" color="#000000"></button-component>        
        </div>
    </file-upload>
  <div class="submit-button" slot="submit">
      <button-component content="Reply" data-content="Reply" is="primary"></button-component>
  </div>
  </form-field>
</div>
</div>
`;

export class ReplyMessage extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateReplyMessage.content.cloneNode(true));
  }

  connectedCallback() {
    this.formKeys = ['to', 'from', 'message'];
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.events();
    this.attachments = [];
    this.previousAttachments = [];
  }

  events() {
    window.addEventListener('email-message-detail-received', e => {
      this.data = e.detail;
      this.addValue(e.detail);
      this.api.getMessageAttachments(this.messageId, this.emailAccountId);
    });
    window.addEventListener('reply-email-selected-files', e => {
      this.attachments = e.detail;
    });
    window.addEventListener('reply-message-form-submitted', e => {
      this.sendReplyRequest(e.detail);
    });
    window.addEventListener('user-email-attachments-received', e => {
      this.viewFiles(e.detail);
    });

    window.addEventListener('email-message-sent', e => {
      setTimeout(function(){
        window.dispatchEvent(new CustomEvent('dashboard-link-clicked', {
          bubbles: false,
          detail:'email'
        }));
      }, 2000);
    });
  }

  sendReplyRequest(body) {
    body.subject = this.data.subject;
    body.cc=null;
    body.bcc=null;
    body.idEmailAccount=this.emailAccountId;
    body.to='["'+body.to+'"]';
    let formData = new FormData();
    for (let key in body) {
      formData.append(key, body[key]);
    }
    for (let i = 0; i < this.attachments.length; i++) {
      formData.append('images[]', this.attachments[i].detail);
    }
    this.api.sendEmail(formData);
  }

  addValue(data) {
    this.shadowRoot.querySelector('#to-field').setAttribute('value', data.from_mail);
    this.shadowRoot.querySelector('#from-field').setAttribute('value', data.to);
    this.shadowRoot.querySelector('#message-description').innerHTML = `On ${data.date} < <b>${data.from_mail}</b> > wrote:`
    this.shadowRoot.querySelector('#subject').innerHTML = `<b>Subject: </b> <span style="font-size: 17px; padding: 5px 0">${data.subject}</span>`
    let body = document.createElement('div');
    body.innerHTML = data.body;
    this.message =
      '\r\n' + '\r\n' + `On ${data.date} ${data.from_mail} wrote:` + '\r\n' + body.textContent;
    this.shadowRoot.querySelector('#message-field').setAttribute('value', this.message);
    this.shadowRoot.querySelector('#message-html').innerHTML = data.body;
  }

  viewFiles(files) {
    this.shadowRoot.querySelector('.file-section').innerHTML = ``;
    this.shadowRoot.querySelector('.image-section').innerHTML = ``;
    for (let i = 0; i < files.length; i++) {
      let extension = files[i].attachment.split('.')[1];
      if (extension === 'jpg' || extension === 'JPG' || extension === 'JPEG' || extension === 'jpeg' || extension === 'png' || extension === 'PNG' || extension === 'gif' || extension === 'tiff' || extension === 'GIF') {
        this.showImage(`${environment.endpoint}/api/user/emailAccount/${this.emailAccountId}/attachment/${files[i].id}`)
      } else {
        this.showFile(files[i].id, files[i].attachment.split('.')[1])
      }
    }
  }

  showImage(src) {
    let div = document.createElement('div');
    div.innerHTML = `
      <responsive-img src="${src}" width="100px" height="auto" style="margin:5px"></responsive-img>
    `;
    this.shadowRoot.querySelector('.image-section').appendChild(div);
  }

  showFile(id, extension) {
    let div = document.createElement('div');
    div.classList.add('file');
    div.innerHTML = 'Download File';
    div.addEventListener('click', e => {
      this.api.downloadFile(id, 'file.' + extension, this.emailAccountId)
    })
    this.shadowRoot.querySelector('.file-section').appendChild(div);
  }

  static get observedAttributes() {
    return ['email-account-id', 'message-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'message-id') {
      this.getMessage();
    }
  }

  getMessage() {
    this.api = new EmailClientApi();
    this.api.getMessageDetails(this.messageId)
  }

  get emailAccountId() {
    return this.getAttribute('email-account-id')
  }

  get messageId() {
    return this.getAttribute('message-id')
  }
}

window.customElements.define('reply-message', ReplyMessage);
