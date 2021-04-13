import {EmailClientApi} from "../email-client-api.js";
import {TranslateString} from "../../translate-string";

import ('../../tool-tip');
const templateEmailAccount = document.createElement('template');
templateEmailAccount.innerHTML = `
<div></div>
`;

class EmailAccounts extends TranslateString {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateEmailAccount.content.cloneNode(true));
  }

  connectedCallback() {
    window.addEventListener('user-active-email-received', function (e) {
      this.appendActiveAccounts(e.detail);
    }.bind(this))
  }

  appendActiveAccounts(data) {
    this.api= new EmailClientApi();
    this.shadowRoot.querySelector('div').innerHTML = ` `;
    for (let i = 0; i < data.length; i++) {
      let div = document.createElement('div');
      div.innerHTML = `
      <tool-tip trim="15" tooltip="${data[i].user_name}" content="${data[i].user_name}"></tool-tip>
      `;
      this.shadowRoot.querySelector('div').appendChild(div);
      div.addEventListener('click', function () {
        this.getMessages(data[i].id);
      }.bind(this));
    }
  }

  getMessages(id) {
    this.api.getUserMessages(id, this.type, -1, 1);
  }

  get type() {
    return this.getAttribute('type');
  }
}

window.customElements.define('email-accounts', EmailAccounts);

