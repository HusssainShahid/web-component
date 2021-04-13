const TemplateAlertMessage = document.createElement('template');
TemplateAlertMessage.innerHTML = `
<style>
    .alert{
         width:  90%;
         padding: 15px 20px;
         background-color: #f44336;
         color: white;
         margin-bottom: 15px;
         transition: 0.5s ease-in;
         border-radius: 5px;
         position: relative;
    }
    .close-btn {
         color: white;
         font-weight: bold;
         font-size: 22px;
         cursor: pointer;
         transition: 0.3s;
         position: absolute;
         top: 0;
         right: 10px;
    }
    .close-btn:hover{
        color:#df0000;
    }
    .default {
        color: var(--base-color, hsla(240, 40.3%, 15.1%, 1));
        background:var(--base-color-lightest, hsla(240, 38.5%, 94.9%, 1)) ;
    }
    .success {
        background:#D4EDDA;
        color: #5CB85C;
    }
    .danger {
        background: #F8D7DA;
        color: #D9534F;
    }
</style>

<div class="alert">
  <slot name="message"></slot>
  <span class="close-btn">&times;</span>
</div>
  `;

export class AlertMessage extends HTMLElement {
  static get observedAttributes() {
    return ['is'];
  }

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(TemplateAlertMessage.content.cloneNode(true));
  }


  attributeChangedCallback(name, oldValue, newValue) {
    this.shadowRoot.querySelector('div').classList.add(this.getAttribute('is'));
  }

  connectedCallback() {
    this.alertTypes = ['success', 'danger'];
    this.shadowRoot.querySelector('div').classList.add(this.is);
    this.shadowRoot.querySelector('span').addEventListener('click', this.closeMessage.bind(this));
    if(this.hidebutton){
      this.shadowRoot.querySelector('.close-btn').style.display='none';
    }
  }

  closeMessage(){
    this.shadowRoot.querySelector('.alert').style.width='0';
    window.dispatchEvent(new CustomEvent(this.event));
    setTimeout(function(){
      this.shadowRoot.querySelector('.alert').style.display='none';
    }.bind(this), 400);
  }

  get is() {
    let alertTypes = 'default';
    if (this.hasAttribute('is')) {
      let askedType = this.getAttribute("is");
      if (this.alertTypes.indexOf(askedType) !== -1) {
        alertTypes = askedType;
      }
    }
    return alertTypes;
  }
  get event(){
    return this.getAttribute('event');
  }
  get hidebutton(){
    return this.hasAttribute('hidebutton');
  }
}

window.customElements.define('alert-message', AlertMessage);
