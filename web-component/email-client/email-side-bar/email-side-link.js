import {EmailRouting} from "../email-routing";

import ('./email-accounts');
import {EmailClientApi} from "../email-client-api.js";
import {TranslateString} from "../../translate-string";

const templateEmailSideLink = document.createElement('template');
templateEmailSideLink.innerHTML = `
  <style>
      #account-status{
        font-size: 20px;
      }
      .link{
        padding: 5px 0 5px 5px;
        border-bottom: 1px solid #e8e8e8;
        cursor: pointer;
      }
     .link:hover{
        border-bottom-color: #858585;
     }
     .accounts{
        padding-left: 59px;
        font-size: var(--text-caption, 14px);
        color: var(--secondary-text, hsla(0, 0%, 0%, 1));
     }
     .active{
        background: #f9f9f9;
     }
  </style>
<div class="link">
<span id="account-status">&#9656;</span>
<slot></slot>
<div class="accounts">
    <email-accounts></email-accounts>
</div>
</div>
`;

export class EmailSideLink extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateEmailSideLink.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new EmailClientApi();
    this.route = new EmailRouting();
    this.shadowRoot.querySelector('.accounts').style.display = 'none';
    this.shadowRoot.querySelector('#account-status').addEventListener('click', this.changeAccountStatus.bind(this));
    let emailAccounts = this.shadowRoot.querySelectorAll('email-accounts');
    for (let i = 0; i < emailAccounts.length; i++) {
      emailAccounts[i].setAttribute('type', this.getAttribute('id'));
    }
    this.shadowRoot.querySelector('slot').addEventListener('click', function () {
      this.getNewMessages(this.getAttribute('id'));
    }.bind(this));
    window.addEventListener('side-bar-collapse-section-clicked', function (e) {
      this.sideBarCollapse(e.detail);
    }.bind(this));
    window.addEventListener('email-top-nav-link-status', function (e) {
      this.unActivateLinks();
    }.bind(this));
    this.activateLink();
  }

  unActivateLinks() {
    this.shadowRoot.querySelector('.link').classList.remove('active')
  }

  activateLink() {
    if (!window.location.pathname.split('/')[4]) {
      if (this.getAttribute('id') === 'inbox') {
        this.shadowRoot.querySelector('.link').classList.add('active');
      }
    } else {
      if (this.getAttribute('id') === window.location.pathname.split('/')[4]) {
        this.shadowRoot.querySelector('.link').classList.add('active');
      }
    }
  }

  sideBarCollapse(status) {
    if (status) {
      this.shadowRoot.querySelector('#account-status').style.display = 'inline';
    } else {
      this.shadowRoot.querySelector('#account-status').style.display = 'none';
    }
  }

  getNewMessages(type) {
    this.route.pushRoute(type);
    window.dispatchEvent(new CustomEvent('email-top-nav-link-status', {bubbles: true, detail: []}));
    this.activateLink();
    this.emailAccountId = -1;
    this.labelId = undefined;
    this.pageNo = 1;
    this.api.getUserMessages(this.emailAccountId, type, this.labelId, this.pageNo);
  }

  changeAccountStatus() {
    if (this.shadowRoot.querySelector('.accounts').style.display === 'none') {
      this.api.getUserAccounts();
      this.shadowRoot.querySelector('.accounts').style.display = 'block';
      this.shadowRoot.querySelector('#account-status').innerHTML = '&#9662;';
    } else {
      this.shadowRoot.querySelector('.accounts').style.display = 'none';
      this.shadowRoot.querySelector('#account-status').innerHTML = '&#9656;';
    }
  }
}

window.customElements.define('email-side-link', EmailSideLink);
