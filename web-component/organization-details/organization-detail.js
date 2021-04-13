import './organization-detail-header.js';
import './about-us.js';
import {OrganizationDetailApi} from "./organization-detail-api";

const TemplateOrganizationDetails = document.createElement('template');
TemplateOrganizationDetails.innerHTML = `
<style>
    .name{
        font-size: 34px;
        padding: 30px;
        font-weight: bold;
        text-align: center;
    }
</style>
<organization-detail-header></organization-detail-header>
<div class="name">Organization Name</div>
<about-us></about-us>
  `;

export class OrganizationDetail extends HTMLElement {


  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(TemplateOrganizationDetails.content.cloneNode(true));
  }
  static get observedAttributes() {
    return ['organization-id'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'organization-id') {
      this.organizationId = newValue;
      this.api = new OrganizationDetailApi();
      this.api.organizationDetail(this.organizationId);
    }
  }

  connectedCallback() {

    window.addEventListener('organization-detail-received', e => {
      this.shadowRoot.querySelector('.name').innerHTML = e.detail.organization_name;
    })
  }
}

window.customElements.define('organization-detail', OrganizationDetail);
