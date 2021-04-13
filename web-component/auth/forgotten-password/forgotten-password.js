import {TranslateString} from "../../translate-string";
import {ForgottenPasswordApi} from "./forgotten-password-api";

import ('../../form/email-address-input');
import ('../../link-text');
import ('../../button-component');
import ('../../form/form-field');
const templateForgottenPassword = document.createElement('template');
templateForgottenPassword.innerHTML = `
<style>
.submit-button{
    margin-top: 20px;
    text-align: right;
}
.text-center{
    text-align: center;
}
label{
    font-size: var(--text-label, 17px);
}
.forgotten-password{
    font-size: var(--text-heading);
    text-align: center;
}
.cursor-pointer{
    cursor:pointer;
}
 #email-do-not-exist{
    font-size: var(--text-caption, 14px);
    margin: 2px;
  }
</style>
<p class="forgotten-password" data-translate="Forgotten password">Forgotten password</p>
<form-field  event="forgotten-password-email-added">
  <label data-translate="Email">Email</label>
  <email-address required placeholder="Enter your email" onfocusout-validate="false" data-placeholder="Enter your email"></email-address>
  <p id="email-do-not-exist"></p>
  <div class="submit-button" slot="submit">
    <button-component content="Submit" data-content="Submit" is="primary" id="get-link-button"></button-component>
    <button-component content="Resend Link" data-content="Resend Link" is="primary" id="resend-button"></button-component>
  </div>
  </form-field>
    <p class="text-center"><span data-translate="back to ">back to </span>  
      <b><link-text route="login" target="_blank" data-translate="Log In?">Log In?</link-text></b>
  </p>
`;

export class ForgottenPassword extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateForgottenPassword.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new ForgottenPasswordApi();
    this.formKeys = ['email'];
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.shadowRoot.querySelector('#email-do-not-exist').style.display = 'none';
    this.shadowRoot.querySelector('#resend-button').style.display = 'none';
    this.events();
  }

  events() {
    window.addEventListener('forgotten-password-email-added', function (e) {
      this.api.sendLink(e.detail.email);
    }.bind(this));
    window.addEventListener('forgotten-password-link-sent', function (e) {
      this.linkRequestResponse(e.detail)
    }.bind(this));
    window.addEventListener('resend-forgotten-password-link', function (e) {
      this.api.resendLink(e.detail.email)
    }.bind(this));
  }

  showResendLink() {
    this.shadowRoot.querySelector('#email-do-not-exist').style.color = 'hsla(144.6, 73.5%, 38.4%, 1)';
    this.shadowRoot.querySelector('#email-do-not-exist').innerHTML = 'Password reset link sent successfully.';
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.shadowRoot.querySelector('form-field').setAttribute('event', 'resend-forgotten-password-link');
    this.shadowRoot.querySelector('#resend-button').style.display = 'inline';
    this.shadowRoot.querySelector('#get-link-button').style.display = 'none';
  }

  linkRequestResponse(data) {
    this.shadowRoot.querySelector('#email-do-not-exist').style.display = 'inline';
    if (data !== false) {
      this.showResendLink();
    } else {
      this.shadowRoot.querySelector('#email-do-not-exist').style.color = 'hsla(354, 70.3%, 44.9%, 1)';
      this.shadowRoot.querySelector('#email-do-not-exist').innerHTML = 'This email is not registered.';
      this.shadowRoot.querySelector('#resend-button').style.display = 'none';
      this.shadowRoot.querySelector('#get-link-button').style.display = 'inline';
    }
  }
}

window.customElements.define('forgotten-password', ForgottenPassword);
