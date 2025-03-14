const templateCallOut = document.createElement('template');
templateCallOut.innerHTML = `
<div>
    <slot name="header"></slot>
    <slot name="body"></slot>
</div>
<style>
   div{
   border: 1px solid #EEEEEE;
   padding: 10px;
   margin: 10px;
   min-height: 110px;
   }
    .default {
        border-left:3px solid black;
    }
    .primary {
        border-left:3px solid #337AB7;
    }
    .secondary {
        border-left:3px solid #6C757D;
    }
    .info {
        border-left:3px solid #5BC0DE;
    }
    .warning {
        border-left:3px solid #F0AD4E;
    }
    .success {
        border-left:3px solid #5CB85C;
    }
    .danger {
        border-left:3px solid #D9534F;
    }
</style>
`;

export class CallOut extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateCallOut.content.cloneNode(true));
    }

    connectedCallback() {
        this.colors = ['primary', 'secondary', 'info', 'success', 'warning', 'danger'];
        this.headerColors = ['#337AB7', '#6C757D', '#5BC0DE', '#5CB85C', '#F0AD4E', '#D9534F'];
        this.shadowRoot.querySelector('div').classList.add(this.is);
        this.styleHeading();
    }

    styleHeading() {
        for (let i = 0; i < this.colors.length; i++) {
            if ( this.colors[i]=== this.is) {
                let headerColor = this.headerColors[i];
                this.shadowRoot.querySelector('slot[name="header"]').style.color = headerColor;
                }
        }
    }

    get is() {
        let color = 'default';
        if (this.hasAttribute('is')) {
            let askedType = this.getAttribute("is");
            if (this.colors.indexOf(askedType) !== -1) {
                color = askedType;
            }
        }
        return color;
    }

}

window.customElements.define('call-out', CallOut);