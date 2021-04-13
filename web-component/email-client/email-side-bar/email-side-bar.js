import {TranslateString} from "../../translate-string";
import {EmailRouting} from "../email-routing";

import ('./email-side-link');
import('./email-label');
const templateEmailSideBar = document.createElement('template');
templateEmailSideBar.innerHTML = `
  <style>
     .side-bar-container{
        padding: 10px 0;
     }
     .icon{
        padding: 0 3px;
        font-size: 18px;
     }
     .side-bar-text{
        padding: 10px 20px 10px 10px;
     }
</style>
<div class="side-bar-container">
<email-side-link id="inbox"> 
    <span class="icon">&#9993;</span>
    <span class="side-bar-text" data-translate="Inbox">Inbox</span>
</email-side-link>
<email-side-link id="sent">
    <span class="icon">&#10148;</span>
    <span class="side-bar-text" data-translate="Sent">Sent</span>
</email-side-link>
<email-side-link id="draft">
    <span class="icon">&#9635;</span>
    <span class="side-bar-text" data-translate="Draft">Draft</span>
</email-side-link>
<email-side-link id="starred">
    <span class="icon">&#9734;</span>
    <span class="side-bar-text" data-translate="Stared">Stared</span>
</email-side-link>
<email-side-link id="trash">
    <span class="icon">&#128465;</span>
    <span class="side-bar-text" data-translate="Trash">Trash</span>
</email-side-link>
<email-label></email-label>
</div>
`;

export class EmailSideBar extends TranslateString {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateEmailSideBar.content.cloneNode(true));
  }

  connectedCallback() {
    this.route = new EmailRouting();
    window.addEventListener('side-bar-collapse-section-clicked', function (e) {
      this.sideBarCollapse(e.detail);
    }.bind(this));
  }

  sideBarCollapse(status) {
    let content = this.shadowRoot.querySelectorAll('.side-bar-text');
    let values = ['Inbox', 'Sent', 'Draft', 'Stared', 'Trash'];
    if (status) {
      for (let i = 0; i < content.length; i++) {
        content[i].innerHTML = values[i];
      }
    } else {
      for (let i = 0; i < content.length; i++) {
        content[i].innerHTML = ''
      }
    }
  }
}

window.customElements.define('email-side', EmailSideBar);
