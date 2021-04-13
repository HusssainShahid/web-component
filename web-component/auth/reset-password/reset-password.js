import {TranslateString} from "../../translate-string";
import {ResetPasswordApi} from "./reset-password-api";

import ('../../form/email-address-input');
import ('../../form/password-field');
import ('../../link-text');
import ('../../button-component');
import ('../../form/form-field');
import('../../alert-message');
import('../../link-text');
const templateResetPassword = document.createElement('template');
templateResetPassword.innerHTML = `
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
.reset-password{
    font-size: var(--text-heading);
    text-align: center;
}
.resend-link{
    color:blue;
    cursor: pointer;
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
<p class="reset-password" data-translate="Reset password">Reset password</p>
<alert-message is="danger" hidebutton>
    <label slot="message">Reset Password link expired. Please click
          <link-text route="login">here</link-text>
    </label>
</alert-message>
<form-field  event="reset-password-form-submit">
  <label data-translate="Email">Email</label>
  <email-address required data-placeholder="Enter your email" onfocusout-validate="false" disable placeholder="Enter your email"></email-address>
   <label data-translate="New password">New Password</label>
   <password-field required data-placeholder="Enter new password" onfocusout-validate="false" placeholder="Enter new password"></password-field>
   <label data-translate="Confirm password">Confirm Password</label>
   <password-field required data-placeholder="Confirm password" onfocusout-validate="false" placeholder="Confirm password"></password-field>
   <p id="error-message"></p>
  <div class="submit-button" slot="submit">
    <button-component content="Submit" data-content="Submit" is="primary"></button-component>
  </div>
  </form-field>
`;

export class ResetPassword extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateResetPassword.content.cloneNode(true));
  }

  connectedCallback() {
    this.formKeys = ['email', 'password', 'confirm_password'];
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.shadowRoot.querySelector('#error-message').innerHTML = '';
    if(this.email==='null'){
      this.shadowRoot.querySelector('form-field').style.display='none';
      this.shadowRoot.querySelector('alert-message').style.display='inline';
    }else {
      this.shadowRoot.querySelector('email-address').setAttribute('value', this.email);
      this.shadowRoot.querySelector('alert-message').style.display='none';
      this.shadowRoot.querySelector('form-field').style.display='inline';
    }
    this.api = new ResetPasswordApi();
    window.addEventListener('reset-password-form-submit', function (e) {
      this.checkPasswordMatch(e.detail);
    }.bind(this));
  }

  checkPasswordMatch(data) {
    this.shadowRoot.querySelector('#error-message').innerHTML = '';
    if (data.password === data.confirm_password) {
      this.api.setPassword(data, this.token);
    } else {
      this.shadowRoot.querySelector('#error-message').innerHTML = 'Password and confirm password do not match';
    }
  }

  get email() {
    return this.getAttribute('email');
  }

  get token() {
    return this.getAttribute('token');
  }
}

window.customElements.define('re-set-password', ResetPassword);
