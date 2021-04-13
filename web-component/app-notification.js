const appNotificationTemplate = document.createElement('template');
appNotificationTemplate.innerHTML = `

<style>
:host {
    display: block;
}
:host([hidden]) {
    display: none 
}
</style>

<div>
<notice-sliding></notice-sliding>
</div>
`;

class AppNotification extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(appNotificationTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    window.addEventListener("alertMessage", this.alertMessage.bind(this));
  }

  disconnectedCallback() {
    window.removeEventListener("alertMessage", this.alertMessage.bind(this));
  }

  alertMessage(event) {
    this.shadowRoot.querySelector('notice-sliding').setAttribute('is', event.detail.is);
    this.shadowRoot.querySelector('notice-sliding').setAttribute('id', event.detail.id);
    this.shadowRoot.querySelector('notice-sliding').setAttribute('autoCloseTime', '3000');
    this.shadowRoot.querySelector('notice-sliding').setAttribute('message', event.detail.message);
    this.shadowRoot.querySelector('notice-sliding').setAttribute('status', 'show');
  }
}

window.customElements.define('app-notification', AppNotification);
export default AppNotification;
