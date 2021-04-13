import {EmailClientApi} from "../email-client-api";
import {TranslateString} from "../../translate-string";

import ('../../form/select-field');
import ('../../form/form-field');
import ('../../button-component');
import ('../../form/select-option');
const templateGeneralSetting = document.createElement('template');
templateGeneralSetting.innerHTML = `
<style>
  .container{
    margin: 5% auto 0;
    border: 1px solid #e6e6e6;
    border-radius: 5px;
    width: 450px;
    max-width: 900px;
    padding: 4% 5%;
    position: relative;
  }
  .heading{
    font-size: var(--text-heading, 17px);
  }
  label{
    font-size: var(--text-label, 16px);
    padding-top: 5px;
  }
  @media only screen and (max-width: 500px) {
    .container {
      width: 89%;
    }
    .fields{
      max-width: 336px;
    }
  }
  @media only screen and (max-width: 990px) {
  .container{
      padding: 8% 5%;
  }
  }
    .submit-button{
        margin-top: 20px;
        text-align: right;
    }
    #success-message{
        font-size: var(--text-caption);
        color: hsla(145, 73%, 45.1%, 1);
    }
</style>
<div class="container">
  <div class="heading" data-translate="Email general settings">Email general settings</div>
  <form-field event="email-per-page-form-submitted">
      <label data-translate="Maximum messages on a page">Maximum messages on a page</label>
      <select-field class="fields">
        <select-option value="10">10</select-option>  
        <select-option value="20">20</select-option>  
        <select-option value="50">50</select-option>  
        <select-option value="100">100</select-option>  
      </select-field> 
      <p id="success-message"><span data-translate="Your maximum page size is">Your maximum page size is </span><span id="pages-per-page"></span><span data-translate="per conversation."> per conversation.</span></p>
  <div class="submit-button" slot="submit">
      <button-component content="Update" data-content="Update" is="primary"></button-component>
  </div>
  </form-field>
</div>
`;

export class GeneralSetting extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateGeneralSetting.content.cloneNode(true));
  }

  connectedCallback() {
    this.formKeys = ['conversationPageSize'];
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.api = new EmailClientApi();
    this.api.messagePerPage();
    this.shadowRoot.querySelector('#success-message').style.display = 'none';
    this.events();
  }

  events(){
    window.addEventListener('user-email-page-size-received', e => {
      this.conversationPageSize = e.detail;
      this.shadowRoot.querySelector('#pages-per-page').innerHTML = this.conversationPageSize;
      this.shadowRoot.querySelector('select-field').setAttribute('value', this.conversationPageSize)
    })
    window.addEventListener('email-per-page-form-submitted', e => {
      this.api.changeEmailPerPage(e.detail);
    });
    window.addEventListener('email-conversation-per-page-updated', e => {
      this.api.messagePerPage();
      this.showSuccessMessage();
    })
  }

  showSuccessMessage() {
    this.shadowRoot.querySelector('#success-message').style.display = 'inline';
    setTimeout(function(){
      this.shadowRoot.querySelector('#success-message').style.display = 'none';
    }.bind(this), 3000);
  }
}

window.customElements.define('email-setting', GeneralSetting);
