const TemplateToggleButton = document.createElement('template');
TemplateToggleButton.innerHTML = `
<style>
    div{
        display: flex;
        height: var(--tool-bar-height, 40px);
        background: var(--tool-bar-background, white);
        color: var(--tool-bar-color, black);
        margin: 0;
    }
</style>
<div>
    <slot></slot>
</div>
`;

export class ToggleButton extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateToggleButton.content.cloneNode(true));
    }

    connectedCallback() {
        this.selection();
    }

    selection() {
        if (this.multiple) {
            //
        } else if (this.single) {
            let that = this;
            setTimeout(that.addEvents.bind(this), 300);
        }
    }

    addEvents() {
        let elements = this.querySelectorAll('group-button');
        for (let i = 0; i < elements.length; i++) {
            this.querySelectorAll('group-button')[i].addEventListener('click', this.activate.bind(this, i));
        }
    }

    activate(i) {
        let elements = this.querySelectorAll('group-button');
        for (let i = 0; i < elements.length; i++) {
            elements[i].active = false;
            elements[i].shadowRoot.querySelector('button').classList.remove('active');
        }
        elements[i].active = true;
        elements[i].shadowRoot.querySelector('button').classList.add('active');
    }

    get single() {
        return this.hasAttribute('single');
    }

    get multiple() {
        return this.hasAttribute('multiple');
    }

}

window.customElements.define('toggle-button', ToggleButton);
