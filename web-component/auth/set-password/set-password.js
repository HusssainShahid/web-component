import {TranslateString} from "../../translate-string";

import ('../../form/email-address-input');
import ('../../form/password-field');
import ('../../link-text');
import ('../../button-component');
import ('../../form/form-field');
const templateSetPassword = document.createElement('template');
templateSetPassword.innerHTML = `
<style>
.margin-top-40{
    margin-top: 40px;
}
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
.set-password{
    font-size: var(--text-heading);
    text-align: center;
}
.cursor-pointer{
    cursor:pointer;
}
 #error-message{
    font-size: var(--text-caption, 14px);
    margin: 2px;
    color:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1));
  }
 
</style>
<p class="set-password" data-translate="Set password">Set password</p>
<form-field  event="set-password-form-submit">
  <label data-translate="Email">Email</label>
  <email-address required data-placeholder="Enter your email" onfocusout-validate="false" disable placeholder="Enter your email"></email-address>
   <label data-translate="New password">New Password</label>
   <password-field required data-placeholder="Enter new password" onfocusout-validate="false" placeholder="Enter new password"></password-field>
   <label data-translate="Confirm password">Confirm Password</label>
   <password-field required data-placeholder="Confirm password" onfocusout-validate="false" placeholder="Confirm password"></password-field>
   <p id="error-message"></p>
  <div class="submit-button" slot="submit">
    <button-component content="Set Password" data-content="Set Password" is="primary"></button-component>
  </div>
  </form-field>
  <div id="resend-link">
       <p class="margin-top-40" data-translate="Your set password link expired click button below to get new link.">Your set password link expired click button below to get new link.</p>
       <button-component content="Get Link" data-content="Get Link" is="primary" id="resend-link"></button-component>
  </div>
  <div id="link-resent">
     <p class="margin-top-40" data-translate="Set password link resent successfully, check your email.">Set password link resent successfully, check your email.</p>
  </div>
    <p class="text-center"><span data-translate="Back to ">Back to </span>  
      <b><link-text route="login" target="_blank" data-translate="log in">log in?</link-text></b>
  </p>
`;

export class SetPassword extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateSetPassword.content.cloneNode(true));
  }

  connectedCallback() {
    this.formKeys = ['email', 'password', 'confirm_password'];
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.shadowRoot.querySelector('#error-message').innerHTML = '';
    this.shadowRoot.querySelector('#resend-link').style.display='none';
    this.shadowRoot.querySelector('#link-resent').style.display='none';
    this.shadowRoot.querySelector('email-address').setAttribute('value', this.email);
    this.shadowRoot.querySelector('#resend-link').addEventListener('click', function () {
      window.dispatchEvent(new CustomEvent('resend-set-password-link-clicked'));
    });
    window.addEventListener('set-password-form-submit', function (e) {
      this.checkPasswordMatch(e.detail);
    }.bind(this));
    window.addEventListener('set-password-link-resent', function (e) {
      this.shadowRoot.querySelector('#resend-link').style.display='none';
      this.shadowRoot.querySelector('#link-resent').style.display='inline';
    }.bind(this));
    window.addEventListener('set-password-failed', function (e) {
      this.shadowRoot.querySelector('#error-message').innerHTML = e.detail;
    }.bind(this));
    window.addEventListener('set-password-token-expired', function (e) {
      this.shadowRoot.querySelector('#resend-link').style.display='inline';
      this.shadowRoot.querySelector('form-field').style.display='none';
    }.bind(this));
  }

  checkPasswordMatch(data) {
    this.shadowRoot.querySelector('#error-message').innerHTML = '';
    if (data.password === data.confirm_password) {
      window.dispatchEvent(new CustomEvent('set-password-form-validated', {bubbles: true, detail: data}));
    } else {
      this.shadowRoot.querySelector('#error-message').innerHTML = 'Password and confirm password do not match';
    }
  }

  get email() {
    return this.getAttribute('email');
  }
}

window.customElements.define('set-password', SetPassword);
