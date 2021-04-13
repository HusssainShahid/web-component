import './form/input-text';
import {ApiGateway} from "../api/api-gateway";


const inlineEditTemplate = document.createElement('template');
inlineEditTemplate.innerHTML = `
<style>
    :host {
        display: block;
    }
    :host([hidden]) {
        display: none 
    }
    .container{
        position: relative;
        width: 100%;
        padding: 7px 10px;
    }
    .container:hover edit-font-icon, .container:hover trash-font-icon {
        display: inline;
    }
    .d-none{
        display: none;
    }
    .actions{
        position: absolute;
        right: 45px;
        top: 7px;
    }
    #message{
        font-size: 14px;
    }
</style>
<div class="container">
    <slot></slot>
    <input-text sm class="d-none"></input-text>
    <span class="actions">
        <edit-font-icon title="Edit" class="d-none" width='18px' height="18px" dispatcher="inline-edit-button-clicked"></edit-font-icon>
        <trash-font-icon title="Delete" class="d-none" width='18px' height="18px" dispatcher="inline-edit-delete-button-clicked"></trash-font-icon>
        <check-font-icon title="Save" class="d-none" width='18px' height="18px" dispatcher="inline-edit-save-button-clicked"></check-font-icon>
        <times-font-icon title="Cancel" class="d-none" width='18px' height="18px" dispatcher="inline-edit-cancel-button-clicked"></times-font-icon>
    </span>
</div>
<span id="message"></span>
`;

export class InlineEdit extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(inlineEditTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new ApiGateway();
    this.data = this.shadowRoot.querySelector('slot').assignedNodes()[0].data;
    setTimeout(function(){
      this.data = this.shadowRoot.querySelector('slot').assignedNodes()[0].data;
    }.bind(this), 2000);
    this.input = this.shadowRoot.querySelector('input-text');
    this.container = this.shadowRoot.querySelector('.container');
    this.message = this.shadowRoot.querySelector('#message');
    if (this.border) {
      this.container.style.border = '1px solid #ccc'
    }
    if (!this.deleteAble) {
      this.shadowRoot.querySelector('trash-font-icon').style.display = 'none';
    }
    if(this.inputType){
    this.input.setAttribute('type', this.inputType);
    }
    this.events();
  }

  events() {
    this.addEventListener('inline-edit-button-clicked', e => {
      this.showEditField()
    })
    this.addEventListener('inline-edit-delete-button-clicked', e => {
      console.log('delete');
    })
    this.addEventListener('inline-edit-save-button-clicked', e => {
      this.api.apiRequest(this.actionUrl, 'put', 'fetch', this.input.value)
        .then(response => response.json())
        .then(jsonData => {
          if (jsonData.status) {
            window.dispatchEvent(new CustomEvent(this.event, { bubbles: true, composed: true }));
            this.hideEditField();
            this.message.innerHTML='';
          } else {
            this.message.innerHTML = jsonData.message;
            this.message.style.color = '#DC3545';
          }
        })
        .catch(error => {
          this.message.innerHTML = error;
          this.message.style.color = '#DC3545';
        })
    }, false)
    this.addEventListener('inline-edit-cancel-button-clicked', e => {
      this.hideEditField();
    })
  }

  showEditField() {
    this.input.setAttribute('value', this.data);
    this.changeVisibility(this.input, 'inline')
    this.changeVisibility(this.shadowRoot.querySelector('check-font-icon'), 'inline');
    this.changeVisibility(this.shadowRoot.querySelector('times-font-icon'), 'inline');
    this.changeVisibility(this.shadowRoot.querySelector('slot'), 'none');
    this.changeVisibility(this.shadowRoot.querySelector('edit-font-icon'), 'none');
    this.changeVisibility(this.shadowRoot.querySelector('trash-font-icon'), 'none');
    this.shadowRoot.querySelector('.container').addEventListener('mouseover', e => {
      this.changeVisibility(this.shadowRoot.querySelector('edit-font-icon'), 'none');
      this.changeVisibility(this.shadowRoot.querySelector('trash-font-icon'), 'none');
    })
    this.shadowRoot.querySelector('.actions').style.top = '15px';
  }

  hideEditField() {
    this.changeVisibility(this.input, 'none')
    this.changeVisibility(this.shadowRoot.querySelector('check-font-icon'), 'none');
    this.changeVisibility(this.shadowRoot.querySelector('times-font-icon'), 'none');
    this.changeVisibility(this.shadowRoot.querySelector('slot'), 'inline');
    this.shadowRoot.querySelector('.container').addEventListener('mouseover', e => {
      this.changeVisibility(this.shadowRoot.querySelector('edit-font-icon'), 'inline');
      if (this.deleteAble) {
        this.changeVisibility(this.shadowRoot.querySelector('trash-font-icon'), 'inline');
      }
    })
    this.shadowRoot.querySelector('.container').addEventListener('mouseout', e => {
      this.changeVisibility(this.shadowRoot.querySelector('edit-font-icon'), 'none');
      this.changeVisibility(this.shadowRoot.querySelector('trash-font-icon'), 'none');
    })
    this.shadowRoot.querySelector('.actions').style.top = '8px';
    this.message.innerHTML='';
  }

  changeVisibility(element, show) {
    element.style.display = show;
  }

  get border() {
    return this.hasAttribute('border')
  }

  get actionUrl() {
    return this.getAttribute('action-url')
  }

  set actionUrl(val) {
    if (val) {
      this.setAttribute('actionUrl', '');
    } else {
      this.removeAttribute('actionUrl');
    }
  }

  get deleteAble() {
    return this.hasAttribute('delete-able')
  }

  get event(){
    return this.getAttribute('event')
  }
  get inputType(){
    return this.getAttribute('input-type')
  }
}

window.customElements.define('inline-edit', InlineEdit);
