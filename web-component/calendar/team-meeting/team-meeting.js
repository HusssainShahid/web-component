import '../../link-text';
const templateTeamMeeting = document.createElement('template');
templateTeamMeeting.innerHTML = `
<b><link-text route="calendar/event/create" target="_blank">Add Event</link-text></b>
`;

export class TeamMeeting extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateTeamMeeting.content.cloneNode(true));
  }

}

window.customElements.define('team-meeting', TeamMeeting);
