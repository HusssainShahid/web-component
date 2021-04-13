import '../../button-component';
import '../../pop-up';
import '../../action-table';
import './add-members';
import './edit-member';
import {CalendarApi} from "../calendar-api";

const templateTeamMembers = document.createElement('template');
templateTeamMembers.innerHTML = `
<style>
  .container{
      width: 90%;
      margin: 15px auto; 
  }
  .d-flex{
      display: flex;
      padding: 10px 0;
  }
  .heading{
    font-size: var(--text-heading, 28px);
    flex-grow: 8;
  }
</style>
<div class="container">
  <div class="d-flex">
    <div class="heading">Members</div>
    <pop-up>
      <button-component is="primary" content="Add members" slot="open-modal"></button-component>
      <div slot="modal-body">
          <add-team-members></add-team-members>
      </div>
    </pop-up>
  </div>
    <action-table></action-table>
    <pop-up id="edit-member-modal">
    <div style="display: none" slot="open-modal"></div>
      <div slot="modal-body">
          <edit-team-members></edit-team-members>
      </div>
    </pop-up>
</div>
`;

export class TeamMembers extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateTeamMembers.content.cloneNode(true));
  }

  connectedCallback() {
    this.api= new CalendarApi();
    this.edit = `<?xml version="1.0" encoding="utf-8"?>
        <svg width="20" height="20" viewBox="0 0 1792 1792" fill='#28A745' xmlns="http://www.w3.org/2000/svg"><path d="M888 1184l116-116-152-152-116 116v56h96v96h56zm440-720q-16-16-33 1l-350 350q-17 17-1 33t33-1l350-350q17-17 1-33zm80 594v190q0 119-84.5 203.5t-203.5 84.5h-832q-119 0-203.5-84.5t-84.5-203.5v-832q0-119 84.5-203.5t203.5-84.5h832q63 0 117 25 15 7 18 23 3 17-9 29l-49 49q-14 14-32 8-23-6-45-6h-832q-66 0-113 47t-47 113v832q0 66 47 113t113 47h832q66 0 113-47t47-113v-126q0-13 9-22l64-64q15-15 35-7t20 29zm-96-738l288 288-672 672h-288v-288zm444 132l-92 92-288-288 92-92q28-28 68-28t68 28l152 152q28 28 28 68t-28 68z"/></svg>`;
    this.delete = `<?xml version="1.0" encoding="utf-8"?>
        <svg width="20" height="20" viewBox="0 0 1792 1792" fill='#DC3545' xmlns="http://www.w3.org/2000/svg"><path d="M704 1376v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm256 0v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm256 0v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm-544-992h448l-48-117q-7-9-17-11h-317q-10 2-17 11zm928 32v64q0 14-9 23t-23 9h-96v948q0 83-47 143.5t-113 60.5h-832q-66 0-113-58.5t-47-141.5v-952h-96q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h309l70-167q15-37 54-63t79-26h320q40 0 79 26t54 63l70 167h309q14 0 23 9t9 23z"/></svg>`;
    window.addEventListener('calendar-member-added', e => {
      this.shadowRoot.querySelector('pop-up').setAttribute('show', 'false')
      this.shadowRoot.querySelector('#edit-member-modal').setAttribute('show', 'false')
    });
    window.addEventListener('calendar-team-members-received', e => {
      this.members = e.detail.data;
      this.initializeTable();
    });
    window.addEventListener('calendar-team-members-received', e => {
      this.members = e.detail.data;
      this.initializeTable();
    });
    window.addEventListener('calendar-member-edit-clicked', e => {
      this.shadowRoot.querySelector('#edit-member-modal').setAttribute('show', 'true');
      for (let i = 0; i < this.members.length; i++) {
        if (e.detail === this.members[i].id) {
          this.shadowRoot.querySelector('edit-team-members').setAttribute('data', JSON.stringify(this.members[i]));
        }
      }
    });
    window.addEventListener('calendar-member-delete-clicked', e => {
     if(confirm('Are you sure you want to delete this member?')){
       this.api.deleteMember(e.detail);
     }
    });
  }

  initializeTable() {
    this.actions = [
      {
        name: 'Edit',
        icon: this.edit,
        event: 'calendar-member-edit-clicked',
        value: 'id'
      },
      {
        name: 'Delete',
        icon: this.delete,
        event: 'calendar-member-delete-clicked',
        value: 'id'
      }
    ];
    this.keys = [
      {
        header: 'Name',
        key: 'team_member'
      },
      {
        header: 'Email',
        key: 'email'
      },
      {
        header: 'Time-zone',
        key: 'time_zone'
      }
    ]
    this.table = this.shadowRoot.querySelector('action-table');
    this.table.setAttribute("data", JSON.stringify(this.members));
    this.table.setAttribute("actions", JSON.stringify(this.actions));
    this.table.setAttribute("keys", JSON.stringify(this.keys));
  }
}

window.customElements.define('team-members', TeamMembers);
