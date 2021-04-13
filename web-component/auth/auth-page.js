import("./auth-side-portion/auth-side-portion");
import('./auth-form');
const templateAuthPage = document.createElement('template');
templateAuthPage.innerHTML = `
<style>
.container {
  background-color: var(--primary-base);
  width: 100%;
  padding-right: 0;
  margin-right: auto;
  margin-left: auto;
  padding-left: 0;
  display: flex;
  min-height: 98vh;
  color: var(--primary-text);
}
.left-portion{
  display: none;
  padding: 0;
}
@media (min-width: 992px) {
  .left-portion {
    display: block
  }
}

.col-sm-12, .col-md-12, .col-lg-8{
  position: relative;
  width: 100%;
  padding-right: 0;
  padding-left: 0;
}

@media (min-width: 576px) {
.col-sm-12 {
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%
  }
}

@media (min-width: 768px) {
  .col-md-12 {
    -ms-flex: 0 0 100%;
    flex: 0 0 100%;
    max-width: 100%
  }
}

@media (min-width: 992px) {
  .col-lg-4 {
    -ms-flex: 0 0 33.333333%;
    flex: 0 0 33.333333%;
    max-width: 33.333333%
  }
    .col-lg-8 {
    -ms-flex: 0 0 66.666667%;
    flex: 0 0 66.666667%;
    max-width: 66.666667%
  }
}

</style>
    <div class="container">
      <div class="col-sm-12 col-md-12 col-lg-4 left-portion">
        <auth-side-portion></auth-side-portion>
      </div>
      <div class="col-sm-12 col-md-12 col-lg-8">
        <auth-form>
            <slot></slot>
        </auth-form>
      </div>
    </div>
   `;

export class AuthPage extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateAuthPage.content.cloneNode(true));
  }

  connectedCallback() {
    setTimeout(function(){
      if (this.querySelector('set-password')||this.querySelector('re-set-password')) {
        this.shadowRoot.querySelector('.auth-form').style.margin='0 auto';
      }    }.bind(this), 1000);
  }
}

window.customElements.define('auth-page', AuthPage);
