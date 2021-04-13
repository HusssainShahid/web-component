import {SharedClass} from "../../../../src/shared/shared";
import {TranslateString} from "../../translate-string";

import ('./configured-accounts/configured-accounts');
import ('./edit-account/edit-account');
import ('./add-account/add-account')
import ('../../button-component');
const templateAccountSettings = document.createElement('template');
templateAccountSettings.innerHTML = `
<style>
    .container{
        padding:20px 5%;
    }
    .top-section{
        display: flex;
        padding: 10px 0;
    }
    .heading{
        font-size: var(--text-heading, 28px);
        flex-grow: 20;
    }
    .add-account, .general-setting, .accounts{
        flex-grow: 0.5;
        text-align: right;
    }
</style>
<div class="container">
    <div class="top-section">
        <div class="heading" data-translate="Configured account">Configured account</div>
        <button-component is="primary" content="Add account" data-content="Add account"  class="add-account"></button-component>
        <button-component is="primary" content="Accounts" data-content="Accounts" class="accounts"></button-component>
        <button-component is="primary" content="general Setting" data-content="general Setting" class="general-setting"></button-component>
    </div>
    <configured-accounts></configured-accounts>    
    <edit-account></edit-account>
    <add-account></add-account>
</div>
`;

export class AccountSettings extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateAccountSettings.content.cloneNode(true));
  }

  connectedCallback() {
    this.activeTab('configured-accounts');
    this.events();
  }

  events() {
    this.shadowRoot.querySelector('.add-account').addEventListener('click', e => {
      this.activeTab('add-account');
    });
    this.shadowRoot.querySelector('.accounts').addEventListener('click', e => {
      this.activeTab('configured-accounts');
    });
    this.shadowRoot.querySelector('.general-setting').addEventListener('click', e => {
      this.shared = new SharedClass();
      window.dispatchEvent(new CustomEvent('dashboard-link-clicked', {
        bubbles: true,
        detail: 'email/general/settings'
      }))
    });
    window.addEventListener('email-account-edit-clicked', e => {
      this.activeTab('edit-account');
    });
    window.addEventListener('configured-email-account-clicked', e => {
      this.activeTab('configured-accounts');
    });
  }

  activeTab(tab) {
    let tabs = ['configured-accounts', 'edit-account', 'add-account'];
    for (let i = 0; i < tabs.length; i++) {
      this.shadowRoot.querySelector(tabs[i]).style.display = 'none';
    }
    this.shadowRoot.querySelector(tab).style.display = 'inline';
    if (tab === 'configured-accounts') {
      this.shadowRoot.querySelector('.heading').innerHTML = 'Configured account';
      this.shadowRoot.querySelector('.accounts').style.display = 'none';
      this.shadowRoot.querySelector('.add-account').style.display = 'inline';
    } else if (tab === 'edit-account') {
      this.shadowRoot.querySelector('.heading').innerHTML = 'Edit Account';
    } else if (tab === 'add-account') {
      this.shadowRoot.querySelector('.heading').innerHTML = 'Add Account';
      this.shadowRoot.querySelector('.accounts').style.display = 'inline';
      this.shadowRoot.querySelector('.add-account').style.display = 'none';
    }
  }
}

window.customElements.define('account-settings', AccountSettings);
