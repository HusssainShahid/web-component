import '../form/autogrow-textarea.js';
import '../button-component.js';
import '../form/form-field.js'
import {ApiGateway} from "../../api/api-gateway";
import environment from "../../../src/environment";
import {OrganizationDetailApi} from "./organization-detail-api";

const TemplateAboutUs = document.createElement('template');
TemplateAboutUs.innerHTML = `
<style>
  .container{
    padding: 20px 14%;
  }
</style>
<div class="container">
 <h1 data-translate="About your company">About your company</h1>
    <form-field event="about-us-form-submitted">
  <autogrow-textarea placeholder="Define your company" min="10" max="5000" rows="10"></autogrow-textarea>
    <button-component content="Cancel"  background="#FF5833" color='white' id="cancel-button"></button-component>
  <button-component content="Save"  background="#343A40" color='white' slot="submit" id="add-details"></button-component>
</form-field>
<div id="org-about-us">
<div id="about-us"></div>
<button-component content="Edit"  background="#343A40" color='white' id="edit-about-us"></button-component>
<button-component content="Add"  background="#343A40" color='white' id="add-about-us"></button-component>
</div>
</div>
`;

export class AboutUs extends HTMLElement {


  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(TemplateAboutUs.content.cloneNode(true));
  }

  connectedCallback() {
    this.formKeys = ['about'];
    this.shadowRoot.querySelector('form-field').setAttribute('key', this.formKeys);
    this.shadowRoot.querySelector('#edit-about-us').addEventListener('click',e =>
    {
      this.shadowRoot.querySelector('form-field').style.display = 'inline';
      this.shadowRoot.querySelector('#org-about-us').style.display = 'none';
    })
    this.shadowRoot.querySelector('#cancel-button').addEventListener('click',e =>
    {
      this.shadowRoot.querySelector('form-field').style.display = 'none';
      this.shadowRoot.querySelector('#org-about-us').style.display = 'inline';
    })
    this.api = new OrganizationDetailApi();
    window.addEventListener('about-us-saved', e =>
    {
      this.shadowRoot.querySelector('form-field').style.display = 'none';
      this.shadowRoot.querySelector('#org-about-us').style.display = 'inline';
      this.shadowRoot.querySelector('#edit-about-us').style.display = 'inline';
      this.shadowRoot.querySelector('#add-about-us').style.display = 'none';
      this.shadowRoot.querySelector('#about-us').innerHTML = this.shadowRoot.querySelector('autogrow-textarea').getAttribute('value');
    })
    window.addEventListener('about-us-form-submitted', e => {
      let body = {
        about: e.detail.about,
      }
      this.api.saveAboutUs(body,this.organizationId);
      this.shadowRoot.querySelector('#add-details').setAttribute('content', 'Update');
    })
    window.addEventListener('organization-detail-received', e => {
      this.organizationId = e.detail.organization_id;
      if (e.detail.about !== null && e.detail.about !== undefined && e.detail.about !== '') {
        this.initializeField(e.detail.about);
      }
      else
      {
        this.shadowRoot.querySelector('form-field').style.display = 'none';
        this.shadowRoot.querySelector('#edit-about-us').style.display = 'none';
        this.shadowRoot.querySelector('#add-about-us').style.display = 'inline';
        this.shadowRoot.querySelector('#add-about-us').addEventListener('click',e =>
        {
          this.shadowRoot.querySelector('form-field').style.display = 'inline';
          this.shadowRoot.querySelector('#edit-about-us').style.display = 'none';
          this.shadowRoot.querySelector('#org-about-us').style.display = 'none';
        })
      }
    })
  }

  initializeField(data) {
    this.shadowRoot.querySelector('autogrow-textarea').setAttribute('value', data);
    this.shadowRoot.querySelector('#about-us').innerHTML = data;
    this.shadowRoot.querySelector('form-field').style.display = 'none';
    this.shadowRoot.querySelector('#add-about-us').style.display = 'none';
    this.shadowRoot.querySelector('#add-details').setAttribute('content', 'Update');
  }
}

window.customElements.define('about-us', AboutUs);
