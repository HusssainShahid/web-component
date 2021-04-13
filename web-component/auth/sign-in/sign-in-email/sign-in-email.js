import  ("../../../form/email-address-input");
import ("../../../button-component");
import ("../../../link-text");
import ("../../../form/form-field");
import {SignInApi} from "../sign-in-api";
import {TranslateString} from "../../../translate-string";

const templateSignInEmail = document.createElement('template');
templateSignInEmail.innerHTML = `
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
.login{
    font-size: var(--text-heading, 28px);
    text-align: center;
}
  .error{
    color:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1));
    font-size: var(--text-caption, 14px);
    margin: 2px;
    display: none;
  }
</style>
<p class="login" data-translate="Log In">Log In</p>
<form-field event="sign-in-email-typed">
  <label data-translate="Email">Email</label>
  <email-address required placeholder="Enter your email" onfocusout-validate="false" data-placeholder="Enter your email"></email-address>
  <p class="error">This email is not registered</p>
  <div class="submit-button" slot="submit">
    <button-component content="Next" data-content="Next" is="primary"></button-component>
  </div>
</form-field>
<p class="text-center"> 
    <b><link-text route="signup" target="_blank" data-translate="Create new account">Create new account</link-text></b>
</p>
`;

export class SignInEmail extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateSignInEmail.content.cloneNode(true));
  }

  connectedCallback() {
    this.formKeys = ['email'];
    this.api = new SignInApi();
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.initializeEvent();
  }

  initializeEvent() {
    window.addEventListener('sign-in-email-typed', function (e) {
      this.api.getUserWorkSpace(e.detail);
    }.bind(this));
    window.addEventListener('sign-in-wrong-email-entered', function (e) {
      this.shadowRoot.querySelector('.error').style.display = 'inline';
    }.bind(this));
  }
}

window.customElements.define('sign-in-email', SignInEmail);
