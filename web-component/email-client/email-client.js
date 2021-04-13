import {TranslateString} from "../translate-string";
import {SharedClass} from "../../../src/shared/shared";
import {EmailClientApi} from "./email-client-api";

import ('./email-side-bar/email-side-bar');
import ('./email-top-nav/email-top-nav');
import('../resizeable-columns');
import('./email-list/email-list');
import('./email-detail/email-detail');
import('../button-component');
import('../link-text');
const templateEmailClient = document.createElement('template');
templateEmailClient.innerHTML = `
<style>
.row {
  display: flex;
  flex-wrap: nowrap;
  margin-right: -15px;
  margin-left: -15px;
}
.side-bar{
    width: 240px;
    z-index: 0;
    top: 58px;
    left: 0;
    overflow-x: hidden;
    padding: 10px 0 10px 10px;
    border-right: 1px solid #E8E8E8;
    min-height: 97vh;
    margin: 0;
    transition: width 0.5s;
  }
  @media only screen and (max-width: 600px) {
   .side-bar{
        width: 0;
   }
   .collapse-sidebar{
        left:-200px;
   }
}
  .container{
      width: 100%;
      height: 100vh;
      overflow-y: hidden;
  }
  .compose {
    position: fixed;
    bottom: 50px;
    right: 50px;
    color: white;
    z-index: 10;
  }
  button-component span{
    font-size: 20px;
    font-weight: bolder;
  }
  .collapse-sidebar{
    position: fixed;
    bottom: 0;
    padding: 10px 20px;
    width: 145px;
    cursor: pointer;
    display: flex;
  }
  .rotate{
    transform: rotate(180deg);
  }
  .collapse-icon{
    padding:0 4px;
  }
</style>
<div class="compose">
    <button-component is="primary" rounded event="compose-email-button-clicked">
      <span>
            &plus;    
      </span>
    </button-component>
</div>
<email-top-nav brand="Email"></email-top-nav>
<div class="row">
  <div class="side-bar">
      <email-side></email-side>
      <div class="collapse-sidebar">
        <div class="collapse-icon">&#x2B98;</div>
        <div class="side-bar-collapse-text" data-translate="Collapse Sidebar">Collapse Sidebar</div>
      </div>
  </div>
  <div class="container">
    <resizeable-columns>
        <div slot="first">
            <email-list></email-list>
        </div>
        <div slot="second">
             <email-detail></email-detail>
        </div>
    </resizeable-columns>
  </div>
</div>
`;

export class EmailClient extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateEmailClient.content.cloneNode(true));
  }

  connectedCallback() {
    this.shared = new SharedClass();
    this.sideBarMinimize = false;
    this.workspace = this.shared.getCookie('workspace');
    this.events();
    this.api= new EmailClientApi();
    this.api.fetchMessages();
  }

  events() {
    window.addEventListener('compose-email-button-clicked', function (e) {
      window.dispatchEvent(new CustomEvent('dashboard-link-clicked', {
        bubbles: true,
        detail: `email/compose`
      }));
    }.bind(this));
    window.addEventListener('toggle-side-bar-button-clicked', function (e) {
      this.toggleSideBar();
    }.bind(this));
    if (window.matchMedia("(max-width: 700px)").matches) {
      this.sideBarMinimize = true;
    }
    this.shadowRoot.querySelector('.collapse-sidebar').addEventListener('click', function () {
      this.collapseSidebar();
    }.bind(this));
  }

  collapseSidebar() {
    let collapseIcon = this.shadowRoot.querySelector('.collapse-icon');
    if (collapseIcon.classList.contains('rotate')) {
      collapseIcon.classList.remove('rotate');
      this.shadowRoot.querySelector('.side-bar-collapse-text').innerHTML = 'Collapse Sidebar';
      this.shadowRoot.querySelector('.side-bar').style.width = '200px';
      this.shadowRoot.querySelector('.collapse-sidebar').style.width = '156px';
      window.dispatchEvent(new CustomEvent('side-bar-collapse-section-clicked', {
        bubbles: true, detail: true
      }));
    } else {
      collapseIcon.classList.add('rotate');
      this.shadowRoot.querySelector('.side-bar-collapse-text').innerHTML = '';
      this.shadowRoot.querySelector('.side-bar').style.width = '50px';
      this.shadowRoot.querySelector('.collapse-sidebar').style.width = '8px';
      window.dispatchEvent(new CustomEvent('side-bar-collapse-section-clicked', {
        bubbles: true, detail: false
      }));
    }
  }

  toggleSideBar() {
    if (this.sideBarMinimize) {
      this.shadowRoot.querySelector('.side-bar').style.width = '200px';
      this.shadowRoot.querySelector('.collapse-sidebar').style.width = '156px';
      this.shadowRoot.querySelector('.collapse-sidebar').style.display = 'flex';
      this.sideBarMinimize = false;
      window.dispatchEvent(new CustomEvent('side-bar-collapse-section-clicked', {
        bubbles: true, detail: true
      }));
    } else {
      this.shadowRoot.querySelector('.side-bar').style.width = '0';
      this.shadowRoot.querySelector('.collapse-sidebar').style.width = '0';
      this.shadowRoot.querySelector('.collapse-sidebar').style.display = 'none';
      this.sideBarMinimize = true;
    }
  }
}

window.customElements.define('email-client', EmailClient);
