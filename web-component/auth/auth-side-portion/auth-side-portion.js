import {LanguagePreference} from "../../../../src/models/language-prefrence";
import dev from "../../../../aurelia_project/environments/dev";
import {TranslateString} from "../../translate-string";
const templateAuthSidePortion = document.createElement('template');
templateAuthSidePortion.innerHTML = `
<style>
.login-sidebar {
  background: var(--base-color);
  width: 100%;
  text-align: center;
  color: var(--base-color-lightest);
  vertical-align: middle;
  padding: 15% 0 5% 5%;
  height: 88vh;
}
.float-left{
float: left;
}
.w-100{
width: 100%;
}
.text-title{
  font-size: var(--text-title);
  font-weight: bold;
}
.take-business-height {
  color: #fff;
  margin: 0 0 5px;
  float: left;
}
.text-paragraph {
  font-size: var(--text-paragraph);
}
.auth-side-portion-bottom {
  position: relative;
  top: 70px;
  text-align: center;
}
.auth-side-bottom-text {
  line-height: 16px;
  color: white!important;
}
</style>
  <section class="login-sidebar">
    <div>
      <div class="float-left w-100">
        <p class="text-title">${dev.appName}</p>
      </div>
      <div class="take-business-height float-left w-100 text-paragraph" data-translate="Stay Focused">
        Stay Focused
      </div>
      <div>
        <img src="../../../image/index-image.png"
             style="max-width: 70%" alt="side logo">
        <div class="auth-side-portion-bottom float-left w-100">
          <div class="auth-side-bottom-text w-100 float-left">
            <p style="color: var(--base-color-lighter);" class="text-paragraph" data-translate="Easy - Fast - Secure">Easy - Fast - Secure</p>
            <p class="w-100 float-left text-paragraph" data-translate="Get more than just a Reporting Solution">Get more than just a Reporting Solution</p>
          </div>
        </div>
      </div>
    </div>
  </section>  `;

export class AuthSidePortion extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateAuthSidePortion.content.cloneNode(true));
  }

}

window.customElements.define('auth-side-portion', AuthSidePortion);
