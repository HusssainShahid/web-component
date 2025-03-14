const TemplateAvatarCard = document.createElement('template');
TemplateAvatarCard.innerHTML = `
<style>
    .item1 { 
        grid-area: img;
    }
    .item2 {
        grid-area: body;
    }
    .grid-container {
        border-top: 1px solid rgba(205,205,205,0.19);
        border-bottom: 1px solid rgba(205,205,205,0.19);
        display: grid;
        grid-template-areas:
            'img body body body body body'
            'img body body body body body'
            'img body body body body body';
        grid-gap: 20px;
        padding: 10px;
        cursor: pointer;
        background: var(--avatar-card-background, white);
        color: var(--avatar-card-color, black);
    }
    .grid-container:hover{
        background: rgba(233,213,255,0.37);
        background: var(--avatar-card-background-hover, rgba(233,213,255,0.37));
        color: var(--avatar-card-color-hover    , black);
    }
    .grid-container > div {
        text-align: var(--avatar-card-text-alighn, left);
    }
    ::slotted(*) {
        padding: 4px 0;
    }
    .dark {
        background: rgba(31,41,49,0.66);
        border: none;
        color: #A2A2A2;
    }
    .dark:hover{
        background: #1F2931;
        color: #A2A2A2;
    }
</style>
<div class="grid-container" id="avatar-card">
    <div class="item1">
        <slot name="img"></slot>
    </div>
    <div class="item2">
        <slot name="body"></slot>
    </div>
</div>
`;

export class AvatarCard extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateAvatarCard.content.cloneNode(true));
    }

    connectedCallback() {
        let theme= this.parentNode.hasAttribute('dark');
        if(theme){
            this.shadowRoot.querySelector('#avatar-card').classList.add('dark')
        }
    }

}

window.customElements.define('avatar-card', AvatarCard);
