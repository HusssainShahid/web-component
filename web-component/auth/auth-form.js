import ('../localization/localized-element');
import dev from "../../../aurelia_project/environments/dev";

const templateAuthForm = document.createElement('template');
templateAuthForm.innerHTML = `
<style>
.auth-form{
  margin: 7% auto 0;
  border: 1px solid #e6e6e6;
  border-radius: 5px;
  width: 450px;
  max-width: 900px;
  padding: 1% 5% 8% 5%;
  position: relative;
}

@media only screen and (max-width: 500px) {
  .auth-form {
    width: 89%;
  }
  .auth-fields{
    max-width: 336px;
  }
}
.app-name{
    opacity: 0;
    color: var(--primary-text, hsla(0, 0%, 0%, 1));
    font-size: var(--text-title, 34px);
    margin: 0;
    text-align: center;
}
@media only screen and (max-width: 990px) {
.app-name{
    opacity: 1;
}
.auth-form{
    padding: 6% 5% 10% 5%;
}
}
locale-selector{
    position: absolute;
    bottom: -45px;
    left: -3px
}
</style>
<div class="auth-form">
  <p class="app-name">${dev.appName}</p>
    <slot></slot>
    <locale-selector></locale-selector>
</div>
   `;

export class AuthForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateAuthForm.content.cloneNode(true));
  }
}

window.customElements.define('auth-form', AuthForm);
