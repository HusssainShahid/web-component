const TemplateAlertMessage = document.createElement('template');
TemplateAlertMessage.innerHTML = `
<style>
    .alert{
         width: var(--alert-message-width, 90%);
         padding: 20px;
         background-color: #f44336;
         color: white;
         margin-bottom: 15px;
         transition: 0.5s ease-in;
         position: relative;
    }
    .close-btn {
         position: absolute;
         right:20px;
         top: 20px;
         color: white;
         font-weight: bold;
         font-size: 22px;
         line-height: 20px;
         cursor: pointer;
         transition: 0.3s;
    }
    .close-btn:hover{
        color:#df0000;
    }
    .default {
        background: var(--alert-message-default-background, #D6D8D9);
        color: var(--alert-message-default-color, black);
    }
    .primary {
        background: var(--alert-message-primary-background, #CCE5FF);
        color: var(--alert-message-primary-color, #337AB7);
    }
    .secondary {
        background:var(--alert-message-secondary-background, #E2E3E5);
        color: var(--alert-message-secondary-color, #6C757D);
    }
    .info {
        background:var(--alert-message-info-background, #D1ECF1);
        color: var(--alert-message-info-color, #5BC0DE);
    }
    .warning {
        background:var(--alert-message-warning-background, #FFF3CD);
        color: var(--alert-message-warning-color, #F0AD4E);
    }
    .success {
        background:var(--alert-message-success-background, #D4EDDA);
        color: var(--alert-message-success-color, #5CB85C);
    }
    .danger {
        background:var(--alert-message-danger-background, #F8D7DA);
        color: var(--alert-message-danger-color, #D9534F);
    }
</style>

<div class="alert">
  <slot name="message"></slot>
  <span class="close-btn">&times;</span>
</div>
  `;

export class AlertMessage extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateAlertMessage.content.cloneNode(true));
    }

    connectedCallback() {
        this.alertTypes = ['primary', 'secondary', 'info', 'success', 'warning', 'danger'];
        this.shadowRoot.querySelector('div').classList.add(this.is);
        this.shadowRoot.querySelector('slot[name=message]');
        this.shadowRoot.querySelector('span').addEventListener('click', this.closeMessage.bind(this));
    }
    closeMessage(){
        this.shadowRoot.querySelector('.alert').style.width='0';
        let that=this;
        setTimeout(function(){
            that.shadowRoot.querySelector('.alert').style.display='none';
            }, 400);
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
}

window.customElements.define('alert-message', AlertMessage);
