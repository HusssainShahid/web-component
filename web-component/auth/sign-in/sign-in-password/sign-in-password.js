import ("../../../form/password-field");
import ("../../../button-component");
import ("../../../form/form-field");
import {SignInApi} from "../sign-in-api";
import {TranslateString} from "../../../translate-string";

const templateSignInPassword = document.createElement('template');
templateSignInPassword.innerHTML = `
<style>
    #back{
        font-size: 18px;
        cursor: pointer;
    }
    span{
        padding-right: 5px;
    }
    label{
        font-size: var(--text-label, 17px);
    }
    .margin-top-40{
        margin-top: 40px;
    }
    .submit-button{
      margin-top: 20px;
      text-align: right;
    }
    .invalid-credentials{
        font-size: var(--text-caption, 14px);
        color: var(--color-danger, hsla(354.3, 70.5%, 53.5%, 1));
    }
    .text-center{
        text-align: center;
    }
</style>
     <span id="back">&#8592;</span> 
     <span id="workspace-name"></span>
     <span id="email"></span>
     <div class="margin-top-40"></div>
     <form-field event="sign-in-add-password">
       <label data-translate="Password">Password</label>
       <password-field required placeholder="Enter your password" onfocusout-validate="false" data-placeholder="Enter your password"></password-field>
     <p class="invalid-credentials"></p>
     <div class="submit-button" slot="submit">
        <button-component content="Log In" data-content="Log In" is="primary"></button-component>
    </div>
     </form-field>
     <p class="text-center">
        <b><link-text route="forgot/password" target="_blank" data-translate="Forgotten Password">Forgotten Password</link-text></b>
    </p>
`;

export class SignInPassword extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateSignInPassword.content.cloneNode(true));
  }

  connectedCallback() {
    this.formKeys = ['password'];
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.api = new SignInApi();
    this.initializeEvents();
  }

  initializeEvents() {
    window.addEventListener('invalid-email-password', function (e) {
      this.shadowRoot.querySelector('.invalid-credentials').innerHTML = 'Invalid password';
    }.bind(this));
    window.addEventListener('no-workspace-found', function (e) {
      this.email = e.detail;
    }.bind(this));
    this.shadowRoot.querySelector('#back').addEventListener('click', function () {
      window.dispatchEvent(new CustomEvent('password-back-button-clicked'));
    }.bind(this));
    window.addEventListener('selected-workspace', function (e) {
      this.showWorkSpaceName(e.detail);
    }.bind(this));
    window.addEventListener('sign-in-add-password', function (e) {
      this.logInRequest(e.detail);
    }.bind(this));
    window.addEventListener('active-sign-in-step', function (e) {
      if (e.detail === 'sign-in-password') {
        this.shadowRoot.querySelector('password-field').setAttribute('focused', 'focused');
      }
    }.bind(this));
  }

  showWorkSpaceName(detail) {
    this.email = detail.selectedWorkspace.email;
    this.workSpace = detail.selectedWorkspace.name;
    this.workspaceSelected = detail.selected;
    this.shadowRoot.querySelector('#workspace-name').innerHTML = this.workSpace;
    this.shadowRoot.querySelector('#email').innerHTML = this.email;
  }

  logInRequest(detail) {
    let data = {};
    if (this.workspaceSelected) {
      data = {
        'email': this.email,
        'url': this.workSpace,
        'password': detail.password,
        'workspace': this.workspaceSelected
      }
    } else if (this.workSpace === undefined) {
      data = {
        'email': this.email,
        'password': detail.password,
        'workspace': false
      }
    } else {
      data = {
        'email': this.email,
        'url': this.workSpace,
        'password': detail.password,
        'workspace': true
      }
    }
    this.api.logInUser(data);
  }
}

window.customElements.define('sign-in-password', SignInPassword);
