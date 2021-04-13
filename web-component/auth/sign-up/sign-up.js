import {TranslateString} from "../../translate-string";
import {SignUpApi} from "./sign-up-api";

import ("../../form/email-address-input");
import ("../../button-component");
import ("../../link-text");
import ("../../alert-message");
import ("../../form/form-field");

const templateSignUp = document.createElement('template');
templateSignUp.innerHTML = `
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
.sign-up{
    font-size: var(--text-heading);
    text-align: center;
}
.cursor-pointer{
    cursor:pointer;
}
#back{
    font-size: 18px;
    cursor: pointer;
    margin-bottom: 10px;
}
</style>
<p class="sign-up" data-translate="Sign Up">Sign Up</p>
<div class="sign-up-form">
<form-field  event="sign-up-add-email">
  <label data-translate="Email">Email</label>
  <email-address required placeholder="Enter your email" onfocusout-validate="false" data-placeholder="Enter your email"></email-address>
  <div class="submit-button" slot="submit">
    <button-component content="Submit" data-content="Submit" is="primary"></button-component>
  </div>
  </form-field>
    <p class="text-center"><span data-translate="Already have account?">Already have account?</span>  
      <b><link-text route="login" target="_blank" data-translate="Log In">Log In</link-text></b>
  </p>
</div>
<div class="response">
    <span id="back">&#8592;</span>
    <alert-message is="success" event="sign-up-alert-message-closed">
        <label slot="message" class="message"></label>
    </alert-message>
</div>
`;

export class SignUp extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateSignUp.content.cloneNode(true));
  }

  connectedCallback() {
    this.initializeEvents();
    this.formKeys = ['email'];
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.shadowRoot.querySelector('.response').style.display = 'none';
    this.api = new SignUpApi();
  }

  initializeEvents() {
    window.addEventListener('sign-up-add-email', function (e) {
      this.api.signUp(e.detail.email);
    }.bind(this));
    window.addEventListener('sign-up-request-response', function (e) {
      this.signUpResponse(e.detail);
    }.bind(this));
    window.addEventListener('sign-up-resend-link-response-received', function (e) {
      this.resendLinkResponse(e.detail);
    }.bind(this));
    window.addEventListener('sign-up-alert-message-closed', function () {
      setTimeout(function () {
        this.showSignUpForm();
      }.bind(this), 300);
    }.bind(this));
    this.shadowRoot.querySelector('#back').addEventListener('click', function () {
      this.showSignUpForm();
    }.bind(this));
  }

  signUpResponse(data) {
    this.shadowRoot.querySelector('.response').style.display = 'inline';
    this.shadowRoot.querySelector('.sign-up-form').style.display = 'none';
    if (data.status) {
      this.shadowRoot.querySelector('alert-message').setAttribute('is', 'success');
      this.shadowRoot.querySelector('.message').innerHTML = "Registration request has been sent successfully. We will let you know by email once your request has been entertained.";
      this.shadowRoot.querySelector('.message').setAttribute('data-translate', 'Registration request has been sent successfully. We will let you know by email once your request has been entertained.');
      window.dispatchEvent(new CustomEvent('data-attribute-added'));
    } else {
      this.showError(data.message);
    }
  }

  showError(message) {
    if (message === 'Registration request already sent') {
      this.shadowRoot.querySelector('.message').innerHTML = "Registration request against this email has already been received. We will let you know by email once your request has been entertained.";
      this.shadowRoot.querySelector('.message').setAttribute('data-translate', 'Registration request against this email has already been received. We will let you know by email once your request has been entertained.');
      window.dispatchEvent(new CustomEvent('data-attribute-added'));
    } else if (message === 'Email already registered click here to resend') {
      this.shadowRoot.querySelector('.message').innerHTML = `<span data-translate="Your registration request is already approved. Click ">Your registration request is already approved. Click </span>
      <strong class="cursor-pointer" id="resend-email" data-translate="here ">here</strong>
      <span data-translate="to send new set password link.">to send new set password link</span>`;
      window.dispatchEvent(new CustomEvent('data-attribute-added'));
      this.shadowRoot.querySelector('#resend-email').addEventListener('click', function () {
        this.api.resendEmail(this.api.email)
      }.bind(this))
    } else {
      this.shadowRoot.querySelector('.message').innerHTML = message;
    }
  }

  resendLinkResponse(data) {
    if (data) {
      this.shadowRoot.querySelector('.message').innerHTML = "Set Password link sent successfully! Please check your inbox.";
      this.shadowRoot.querySelector('.message').setAttribute('data-translate', 'Set Password link sent successfully! Please check your inbox.');
      window.dispatchEvent(new CustomEvent('data-attribute-added'));
    } else {
      this.shadowRoot.querySelector('alert-message').setAttribute('is', 'danger');
      this.shadowRoot.querySelector('.message').innerHTML = "Server Error.";
    }
  }

  showSignUpForm() {
    this.shadowRoot.querySelector('.response').style.display = 'none';
    this.shadowRoot.querySelector('.sign-up-form').style.display = 'inline';
    this.shadowRoot.querySelector('email-address').setAttribute('value', '');
  }
}

window.customElements.define('sign-up-form', SignUp);
