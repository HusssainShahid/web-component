const checkFontIconTemplate = document.createElement('template');
checkFontIconTemplate.innerHTML = `

<style>
:host([hidden]) {
    display: none 
}
i{
cursor: pointer;
}
</style>

<i title="Update">
<svg width="15px" height="15px" viewBox="0 0 1792 1792" fill="#5cb85c">
<path d="M1671 566q0 40-28 68l-724 724-136 136q-28 28-68 28t-68-28l-136-136-362-362q-28-28-28-68t28-68l136-136q28-28 68-28t68 28l294 295 656-657q28-28 68-28t68 28l136 136q28 28 28 68z"/>
</svg>
</i>
`;

class CheckFontIcon extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(checkFontIconTemplate.content.cloneNode(true));

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

window.customElements.define('check-font-icon', CheckFontIcon);
export default CheckFontIcon;
