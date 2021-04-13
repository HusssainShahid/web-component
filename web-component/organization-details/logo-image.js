import '../file-selector.js';
import {OrganizationDetailApi} from "./organization-detail-api";

const TemplateLogoImage = document.createElement('template');
TemplateLogoImage.innerHTML = `
<style>
  .container{
    border: 1px solid grey;
    border-radius: 10px;
    padding: 10px;
    background: white; 
    width: 100px;
    height: 100px;
  }
  file-selector{
    position: absolute;
    bottom: -2.5px;
    right: 0;
  }
</style>
<div class="container">
    <img src="../../../favicon.ico" alt="logo" width="100" height="100">
    <file-selector event="logo-image-selected" type="img">
        <button-component content="Edit" data-content="Edit" background="#343A40" color='white' slot="upload-button"></button-component>
    </file-selector>
</div>
`;

export class LogoImage extends HTMLElement {


  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(TemplateLogoImage.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new OrganizationDetailApi();
    window.addEventListener('logo-image-selected', e => {
      this.showImage(e.detail[0]);
      let body = {
        type: 'logo-image',
        organizationId: this.organizationId
      }
      this.api.saveImage(body, e.detail[0],this.organizationId);
    })
    window.addEventListener('organization-detail-received', e => {
      this.organizationId = e.detail.organization_id;
      if (e.detail.logo !== null && e.detail.logo!==undefined) {
        this.shadowRoot.querySelector('img').setAttribute('src', this.api.getImage(this.organizationId, e.detail.logo))
      }
    })
  }

  showImage(e) {
    this.shadowRoot.querySelector('img').setAttribute('src', e.src);
  }
}

window.customElements.define('logo-image', LogoImage);
