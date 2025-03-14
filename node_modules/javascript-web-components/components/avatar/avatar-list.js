const TemplateAvatarList = document.createElement('template');
TemplateAvatarList.innerHTML = `
    <style>
        div{
         padding: 20px 0;
         border: var(--avatar-list-border, 1px solid rgba(0,0,0,0.11));
         background: var(--avatar-list-background, white);
         box-shadow: 0 0 4px 1px rgba(115,115,115,0.23)!important;
        }
        ::slotted([slot="header"]){
            text-align: center;
        }
        .dark {
            background: black;
            border: none;
            color: white;
        }
    </style>
    <div>
        <slot name="header"></slot>
        <slot name="card"></slot>
    </div>
  `;

export class AvatarList extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateAvatarList.content.cloneNode(true));
    }

    connectedCallback() {
        if (this.dark){
            this.shadowRoot.querySelector('div').classList.add('dark');
        }
    }

    get dark() {
        return this.hasAttribute("dark");
    }
    set dark(value) {
        if (value)
            this.setAttribute('dark', '');
        else
            this.removeAttribute('dark');
    }
}

window.customElements.define('avatar-list', AvatarList);
