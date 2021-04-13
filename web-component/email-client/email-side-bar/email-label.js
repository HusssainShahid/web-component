import {EmailClientApi} from "../email-client-api.js";
import {TranslateString} from "../../translate-string";

import('./label-account');
import('./label-name');
const templateEmailLabel = document.createElement('template');
templateEmailLabel.innerHTML = `
<style>
  .label-container{
    padding: 20px 36px;
    max-height: 220px;
    font-size: var(--text-caption, 14px);
  }
  .label-container b{
    padding-bottom: 5px;
    font-size: var(--text-paragraph, 16px);
  }
</style>
<div class="label-container">
<b data-translate="Labels">Labels</b>
<slot></slot>
</div>
`;

class EmailLabel extends TranslateString {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateEmailLabel.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new EmailClientApi();
    this.api.getMultipleAccountLabels();
    window.addEventListener('side-bar-collapse-section-clicked', e=>{
      if(e.detail){
        this.shadowRoot.querySelector('.label-container').style.display='block';
      }else {
        this.shadowRoot.querySelector('.label-container').style.display='none';
      }
    });
    window.addEventListener('user-multiple-account-labels-received', (e) => {
      this.labelsData = e.detail;
      if (this.labelsData.length > 0) {
        if (this.labelsData[0].email_labels.length > 0) {
          this.generateAccount();
        } else {
          this.shadowRoot.querySelector('.label-container').innerHTML = ``;
        }
      } else {
        this.shadowRoot.querySelector('.label-container').innerHTML = ``;
      }
    })
  }

  generateAccount() {
    let account;
    let name;
    for (let i = 0; i < this.labelsData.length; i++) {
      account = document.createElement('div');
      account.innerHTML = `
      <label-account account=${this.labelsData[i].user_name} id="${this.labelsData[i].id}"></label-account>
      `;
      for (let j = 0; j < this.labelsData[i].email_labels.length; j++) {
        name = document.createElement('div');
        name.innerHTML = `
        <label-name name="${this.labelsData[i].email_labels[j].name}" id="${this.labelsData[i].email_labels[j].id}" account-id="${this.labelsData[i].email_labels[j].email_account_id}"></label-name>
        `;
        account.querySelector('label-account').appendChild(name);
      }
    }
    this.appendChild(account);
  }
}

window.customElements.define('email-label', EmailLabel);

