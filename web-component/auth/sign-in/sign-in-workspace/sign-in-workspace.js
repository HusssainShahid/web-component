const templateSignInWorkSpace = document.createElement('template');
templateSignInWorkSpace.innerHTML = `
<style>
    .card{
        padding: 20px;
        border: 1px solid #ccc;
        margin: 20px 0;
        box-shadow: 0 .125rem .25rem rgba(0,0,0,.075)!important;
        border-radius: 5px;
        transition: 0.3s;
        background: var(--primary-text, hsla(0, 0%, 0%, 1));
        font-size: var(--text-label, 17px);
        background: var(--primary-base, white);
        cursor: pointer;
    }
    .card:hover{
        box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important;
    }
    #back-to-step-1{
        font-size: 18px;
        cursor: pointer;
    }
</style>
   <span id="back-to-step-1">&#8592;</span>
   <span id="email"></span>
  <div id="work-space">
  </div>
`;

export class SignInWorkspace extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateSignInWorkSpace.content.cloneNode(true));
  }

  connectedCallback() {
    this.initializeEvents();
  }

  initializeEvents() {
    window.addEventListener('user-workspaces', function (e) {
      this.shadowRoot.querySelector('#email').innerText = e.detail[0].email;
      this.workSpaceCard(e.detail);
      this.workspaceDetail = e.detail;
    }.bind(this));
    window.addEventListener('password-back-button-clicked', function (e) {
      if (this.workspaceDetail === undefined) {
        this.shadowRoot.querySelector('#back-to-step-1').click();
      } else {
        window.dispatchEvent(new CustomEvent('active-sign-in-step', {bubbles: true, detail: 'sign-in-workspace'}));
      }
    }.bind(this));
    this.shadowRoot.querySelector('#back-to-step-1').addEventListener('click', function () {
      window.dispatchEvent(new CustomEvent('active-sign-in-step', {bubbles: true, detail: 'sign-in-email'}));
    }.bind(this));
  }

  workSpaceCard(workspace) {
    let workspaceContainer = this.shadowRoot.querySelector('#work-space');
    workspaceContainer.innerHTML = ``;
    for (let i = 0; i < workspace.length; i++) {
      let div = document.createElement('div');
      div.classList.add('card');
      div.innerHTML = `
        <div id="workspace-name">${workspace[i].name}</div>
      `;
      workspaceContainer.appendChild(div);
      div.addEventListener('click', function () {
        window.dispatchEvent(new CustomEvent('active-sign-in-step', {bubbles: true, detail: 'sign-in-password'}));
        window.dispatchEvent(new CustomEvent('selected-workspace', {
          bubbles: true, detail: {
            selectedWorkspace: workspace[i],
            selected: true
          }
        }));
      })
    }
  }
}

window.customElements.define('sign-in-workspace', SignInWorkspace);
