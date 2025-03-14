const templateGroupButton = document.createElement('template');
templateGroupButton.innerHTML = `
    <style>
        button {
            border: 1px solid rgba(0,0,0,0.08);
            padding: 12px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            cursor: pointer;
            color: black;
            float: left;
            background: white;
            transition: 0.1s;
        }
        button:hover{
            background: rgba(0,0,0,0.06);
        }
        .active{
            background: rgba(0,0,0,0.09);
        }
    </style>
    <button>
        <slot name="icon"></slot>
    </button>
`;

export class GroupButton extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateGroupButton.content.cloneNode(true));
    }

    connectedCallback() {
        this.setInnerHtml();
        this.activation();
        this.shadowRoot.querySelector('button').addEventListener('click', this.activate.bind(this));
    }

    activate() {
        this.active = true;
        let hasClass = this.shadowRoot.querySelector('button').classList.contains('active');
        if (!hasClass) {
            this.shadowRoot.querySelector('button').classList.add('active');
        } else {
            this.active=false;
            this.shadowRoot.querySelector('button').classList.remove('active');
        }
    }

    activation() {
        if (this.active) {
            this.shadowRoot.querySelector('button').classList.add('active');
        }
    }

    get content() {
        return this.getAttribute("content")
    }

    setInnerHtml() {
        if (this.content != null) {
            this.shadowRoot.querySelector('button').innerHTML = (this.content);
        }
    }

    get active() {
        return this.hasAttribute('active');
    }

    set active(val) {
        if (val) {
            this.setAttribute('active', '');
        } else {
            this.removeAttribute('active');
        }
    }

}

window.customElements.define('group-button', GroupButton);