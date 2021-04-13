const timesFontIconTemplate = document.createElement('template');
timesFontIconTemplate.innerHTML = `

<style>
:host([hidden]) {
    display: none 
}
i{
cursor: pointer;
}
</style>

<i title="Delete">
<svg width="15px" height="15px" viewBox="0 0 1792 1792" fill="#f98888">
<path d="M1490 1322q0 40-28 68l-136 136q-28 28-68 28t-68-28l-294-294-294 294q-28 28-68 28t-68-28l-136-136q-28-28-28-68t28-68l294-294-294-294q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 294 294-294q28-28 68-28t68 28l136 136q28 28 28 68t-28 68l-294 294 294 294q28 28 28 68z"/>
</svg>
</i>
`;

class TimesFontIcon extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(timesFontIconTemplate.content.cloneNode(true));
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

window.customElements.define('times-font-icon', TimesFontIcon);
export default TimesFontIcon;
