import './sign-in-email/sign-in-email';
import './sign-in-workspace/sign-in-workspace'
import './sign-in-password/sign-in-password'

const templateSignIn = document.createElement('template');
templateSignIn.innerHTML = `
<style>
    sign-in-workspace, sign-in-password{
        display: none;
    }
</style>
<sign-in-email></sign-in-email>
<sign-in-workspace></sign-in-workspace>
<sign-in-password></sign-in-password>
`;

export class SignIn extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateSignIn.content.cloneNode(true));
  }

  connectedCallback() {
    this.initializeEvents();
  }

  initializeEvents() {
    window.addEventListener('all-user-workspace', function (e) {
      window.dispatchEvent(new CustomEvent('user-workspaces', {bubbles: true, detail: e.detail}));
      this.activeStep('sign-in-workspace');
    }.bind(this));
    window.addEventListener('active-sign-in-step', function (e) {
      this.activeStep(e.detail);
    }.bind(this));
  }

  activeStep(active) {
    let steps = ['sign-in-email', 'sign-in-workspace', 'sign-in-password'];
    for (let i = 0; i < steps.length; i++) {
      this.shadowRoot.querySelector(steps[i]).style.display = 'none';
    }
    this.shadowRoot.querySelector(active).style.display = 'inline';
  }
}

window.customElements.define('sign-in', SignIn);
