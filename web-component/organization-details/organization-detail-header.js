import './logo-image.js';
import './cover-image.js';

const TemplateOrganizationDetailHeader = document.createElement('template');
TemplateOrganizationDetailHeader.innerHTML = `
<style>
  .container{
    position: relative;
    height: 300px;
  }
  logo-image{
    position: absolute;
    top: 100px;
    left: 5%;
  }
</style>
<div class="container">
  <cover-image></cover-image>
  <logo-image></logo-image>
</div>
`;

export class OrganizationDetailHeader extends HTMLElement {


  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(TemplateOrganizationDetailHeader.content.cloneNode(true));
  }

}

window.customElements.define('organization-detail-header', OrganizationDetailHeader);
