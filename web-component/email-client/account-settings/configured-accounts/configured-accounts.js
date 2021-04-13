import {EmailClientApi} from "../../email-client-api";
import {TranslateString} from "../../../translate-string";

import ('../../../table-component')
import ('../../../button-component')
const templateConfiguredAccounts = document.createElement('template');
templateConfiguredAccounts.innerHTML = `
 <data-table></data-table>
`;

export class ConfiguredAccounts extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateConfiguredAccounts.content.cloneNode(true));
  }

  connectedCallback() {
    this.api = new EmailClientApi();
    this.api.getConfiguredAccounts();
    window.addEventListener('user-configured-accounts-received', e => {
      this.userAccount= e.detail;
      this.showAccounts(e.detail);
      this.addActionButton(e.detail);
    });
  }

  showAccounts(data) {
    let header = ['User Name', 'Status', 'Account Type', 'Incoming Server', 'Incoming Port', 'Outgoing Server', 'Outgoing Port'];
    let key = ['user_name', 'status', 'account_type', 'incoming_server', 'incoming_port', 'outgoing_server', 'outgoing_port'];
    this.table = this.shadowRoot.querySelector('data-table');
    this.table.setAttribute("data", JSON.stringify(data));
    this.table.setAttribute('key', key);
    this.table.setAttribute("header", header);
  }

  addActionButton(data) {
    let table = this.table.shadowRoot.querySelector('table');
    let activeHeading = document.createElement('th');
    activeHeading.innerHTML = 'Action';
    table.querySelector('thead').appendChild(activeHeading);
    let tr = table.querySelectorAll('tr');
    for (let i = 0; i < tr.length; i++) {
      let buttons = document.createElement('td');
      buttons.innerHTML = `
      <div style="display: flex">
            <button-component is="success" content="Edit" data-content="Edit" id="edit"></button-component>
            <button-component is="danger" content="Delete" data-content="Delete" id="delete"></button-component>
      </div>
      `
      buttons.querySelector('#edit').addEventListener('click', e => {
        this.editAccount(i);
      })
      buttons.querySelector('#delete').addEventListener('click', e => {
        this.deleteAccount(data[i].id_account);
      })
      tr[i].appendChild(buttons);
    }
  }

  editAccount(id) {
    window.dispatchEvent(new CustomEvent('email-account-edit-clicked', {bubbles: true, detail: this.userAccount[id]}));
  }

  deleteAccount(id) {
    if (confirm("Are you sure you want to Delete this Configured Account?")) {
      this.api.deleteUserAccount(id);
    }
  }
}

window.customElements.define('configured-accounts', ConfiguredAccounts);
