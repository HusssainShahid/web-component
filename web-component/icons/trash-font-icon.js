const trashFontIconTemplate = document.createElement('template');
trashFontIconTemplate.innerHTML = `

<style>
:host([hidden]) {
    display: none 
}
i{
cursor: pointer;
position:relative;
top: 1px;
}
</style>

<i title="Delete">
<svg width="17px" height="17px" viewBox="0 0 1792 1792" fill="#f98888">
<path d="M704 1376v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm256 0v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm256 0v-704q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v704q0 14 9 23t23 9h64q14 0 23-9t9-23zm-544-992h448l-48-117q-7-9-17-11h-317q-10 2-17 11zm928 32v64q0 14-9 23t-23 9h-96v948q0 83-47 143.5t-113 60.5h-832q-66 0-113-58.5t-47-141.5v-952h-96q-14 0-23-9t-9-23v-64q0-14 9-23t23-9h309l70-167q15-37 54-63t79-26h320q40 0 79 26t54 63l70 167h309q14 0 23 9t9 23z"/>
</svg>
</i>
`;

class TrashFontIcon extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(trashFontIconTemplate.content.cloneNode(true));

    }

    connectedCallback() {
        this.shadowRoot.querySelector('i').addEventListener('click', this._onClick.bind(this));
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector('i').removeEventListener('click', this._onClick.bind(this));
    }

    static get observedAttributes() {
        return ['color', 'width', 'height', 'dispatcher', 'value', 'title'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        switch (name) {
            case 'color':
                this.shadowRoot.querySelector('svg').style.fill = newValue;
                break;
            case 'width':
                this.shadowRoot.querySelector('svg').style.width = newValue;
                break;
            case 'height':
                this.shadowRoot.querySelector('svg').style.height = newValue;
                break;
            case 'dispatcher':
                this.shadowRoot.querySelector('i').setAttribute('dispatcher', `${newValue}`);
                break;
            case 'value':
                this.shadowRoot.querySelector('i').setAttribute('value', `${newValue}`);
                break;
            case 'title':
                this.shadowRoot.querySelector('i').setAttribute('title', `${newValue}`);
                break;
        }
    }

    _onClick(event) {
        const iconClicked = new CustomEvent(this.shadowRoot.querySelector('i').getAttribute('dispatcher'), {
            bubbles: true,
            composed: true,
            detail: {value: this.shadowRoot.querySelector('i').getAttribute('value')}
        });
        this.dispatchEvent(iconClicked);
    }
}

window.customElements.define('trash-font-icon', TrashFontIcon);
export default TrashFontIcon;
