import {UserGuideApi} from "./user-guide-api";
import '../link-text.js';
const thanksYouTemplate = document.createElement('template');
thanksYouTemplate.innerHTML = `

<style>
:host([hidden]) {
    display: none 
}
.heading{
    font-size: 32px;
    padding: 45px 0;
    text-align: center;
}
.paragraph{
    margin: 20px 0;
    color: #666666;
    line-height: 1.5rem;
}
</style>
<div class="heading" data-translate="We are all set!!">
 We are all set!!
 </div>
 <p class="paragraph">
  <span data-translate="To help you get started quickly, we have selected some default values for options like currency, language, region and timezone etc. If you would like to configure them now select then click '">To help you get started quickly, we have selected some default values for options like currency, language, region and timezone etc. If you would like to configure them now select then click '</span>
  <b><link-text route="configure-advance-options" target="_blank" data-translate="configure advance options">configure advance options</link-text></b>
  <span data-translate="' button. These options can also be configure later using the settings menu.">' button. These options can also be configure later using the settings menu.</span>
</p>
`;

export default class ThankYou extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(thanksYouTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this.organization={
      holdingCompany: null,
      organization:null
    }
    window.addEventListener('user-guide-organization-name', e => {
        this.organization = e.detail
    });
    window.addEventListener('user-type-selected', e => {
      this.selectedUserType = e.detail;
    });
    window.addEventListener('user-guide-next-clicked', e => {
      if (e.detail === 2) {
        let user={
          userType:this.selectedUserType,
          holdingCompany: this.organization.holdingCompany,
          organization: this.organization.organizations
        }
        this.api=new UserGuideApi();
        this.api.userGuide(user);
      }
    });
  }

  static get observedAttributes() {
    return ['active'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.active === 'true') {
      this.style.display = 'inline';
    } else {
      this.style.display = 'none';
    }
  }

  get active() {
    return this.getAttribute('active');
  }
}

window.customElements.define('thank-you', ThankYou);
