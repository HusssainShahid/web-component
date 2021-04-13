import {EmailClientApi} from "../email-client-api.js";
import environment from "../../../../src/environment";
import {TranslateString} from "../../translate-string";

import('../../button-component');
const templateEmailAttachment = document.createElement('template');
templateEmailAttachment.innerHTML = `
<style>
    .heading{
        font-size: var(--text-paragraph);
    }
    .download-image-icon{
        cursor: pointer;
    }
</style>
<div class="email-attachment">
<p class="heading" data-translate="Attachments">Attachments</p>
</div>
`;

export class EmailAttachment extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateEmailAttachment.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new EmailClientApi();
    this.baseUrl = environment.endpoint;
    window.addEventListener('email-attachment-received', e => {
      this.emailAttachments = e.detail;
      this.attachments = [];
      this.attachmentLinks();
    });
  }

  attachmentLinks() {
    for (let i = 0; i < this.emailAttachments.length; i++) {
      let extension = this.emailAttachments[i].attachment.split('.')[1];
      if (extension === 'jpg' || extension === 'JPG' || extension === 'JPEG' || extension === 'jpeg' || extension === 'png' || extension === 'PNG' || extension === 'gif' || extension === 'tiff' || extension === 'GIF') {
        this.attachments.push({
          src: `${this.baseUrl}/api/user/emailAccount/${this.emailAttachments[i].id_email_account}/attachment/${this.emailAttachments[i].id}`,
          'id': this.emailAttachments[i].id,
          'name': this.emailAttachments[i].attachment,
          'email_accunt_id': this.emailAttachments[i].id_email_account,
          'type': 'image'
        });
      } else {
        this.attachments.push({
          src: `${environment.endpoint}/api/user/emailAccount/${this.emailAttachments[i].id_email_account}/attachment/${this.emailAttachments[i].id}`,
          'id': this.emailAttachments[i].id,
          'name': this.emailAttachments[i].attachment,
          'type': 'other',
          'email_accunt_id': this.emailAttachments[i].id_email_account,
          'extension': extension.toUpperCase()
        });
      }
    }
    this.showAttachment();
  }

  showAttachment() {
    let emailAttachmentDiv = this.shadowRoot.querySelector('.email-attachment');
    emailAttachmentDiv.innerHTML = ``;
    for (let i = 0; i < this.attachments.length; i++) {
      if (this.attachments[i].type === 'image') {
        let div = document.createElement('div');
        div.style.padding='20px 0';
        div.innerHTML = `
           <span style="padding: 10px 0">
                 <tool-tip trim="40" tooltip="${this.attachments[i].name}" content="${this.attachments[i].name}"></tool-tip>
           </span>
           <span class="download-image-icon">
           <?xml version="1.0" encoding="utf-8"?>
<svg width="15" height="15" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1344 1344q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h465l135 136q58 56 136 56t136-56l136-136h464q40 0 68 28t28 68zm-325-569q17 41-14 70l-448 448q-18 19-45 19t-45-19l-448-448q-31-29-14-70 17-39 59-39h256v-448q0-26 19-45t45-19h256q26 0 45 19t19 45v448h256q42 0 59 39z"/></svg><br>
           </span>
           <img src="${this.attachments[i].src}" width="100" height="100">
      `;
        emailAttachmentDiv.appendChild(div);
        div.querySelector('.download-image-icon').addEventListener('click',e=>{
          this.api.downloadFile(this.attachments[i].id, this.attachments[i].name, this.attachments[i].email_accunt_id);
        })
      } else {
        let div = document.createElement('div');
        div.innerHTML = `
         <tool-tip trim="40" tooltip="${this.attachments[i].name}" content="${this.attachments[i].name}"></tool-tip><br>
         <button-component is="primary" content="Download Attachment"></button-component>
      `;
        div.querySelector('button-component').addEventListener('click', e=>{
          this.api.downloadFile(this.attachments[i].id, this.attachments[i].name, this.attachments[i].email_accunt_id);
        });
        emailAttachmentDiv.appendChild(div);
      }
    }
  }

  static get observedAttributes() {
    return ['id', 'email-account-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.id != null && this.emailAccountId != null) {
      this.api.getAttachments(this.id, this.emailAccountId);
    }
  }

  get id() {
    return this.getAttribute('id')
  }

  get emailAccountId() {
    return this.getAttribute('email-account-id')
  }

}

window.customElements.define('email-attachment', EmailAttachment);
