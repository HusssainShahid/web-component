import '../file-selector.js';
import '../button-component.js'
import {OrganizationDetailApi} from "./organization-detail-api";

const TemplateCoverImage = document.createElement('template');
TemplateCoverImage.innerHTML = `
<style>
  .container{
    position: relative;
    background-image: linear-gradient(#F0F2F5,#F0F2F5,#F0F2F5, #A6A7A9);
    height: 300px;
  }
  file-selector{
    position: absolute;
    bottom: 0;
    right: 0;
  }
  img{
    width: 100%;
    height: 300px;
  }
</style>
<div class="container">
    <div class="cover-image"></div>
    <file-selector event="cover-image-selected" type="img">
        <button-component content="Select cover image" data-content="Select cover image" background="#343A40" color='white' slot="upload-button"></button-component>
    </file-selector>
</div>
`;

export class CoverImage extends HTMLElement {


  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(TemplateCoverImage.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new OrganizationDetailApi();
    window.addEventListener('cover-image-selected', e => {
      this.showImage(e.detail[0].src);
      let body = {
        type: 'cover-image',
      }
      this.api.saveImage(body, e.detail[0],this.organizationId);
    });
    window.addEventListener('organization-detail-received', e => {
      this.organizationId = e.detail.organization_id;
      if (e.detail.cover_img !== null && e.detail.cover_img!==undefined) {
        this.showImage(this.api.getImage(this.organizationId, e.detail.cover_img));
      }
    })
  }

  showImage(e) {
    let image = document.createElement('img');
    image.setAttribute('src', e);
    this.shadowRoot.querySelector('.cover-image').innerHTML = ``;
    this.shadowRoot.querySelector('.cover-image').appendChild(image);
  }
}

window.customElements.define('cover-image', CoverImage);
