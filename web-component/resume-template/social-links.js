const socialLinksTemplate = document.createElement('template');
socialLinksTemplate.innerHTML = `
<style>
@import url('https://fonts.googleapis.com/css2?family=PT+Serif&display=swap');
:host([hidden]) {
    display: none
}
.wrapper{
    letter-spacing: 1.3px;
    line-height: 1.4;
    font-family: 'PT Serif', serif;
}

.title{
    font-size: 14pt;
}
.sub{
    font-size: 9pt;
    color: #6C757D;
}
.p-bottom{
    padding-bottom: 15px;
}
</style>
<div class="wrapper">
    <div class="title">Links</div>
    <div id="link-list"></div>
</div>
`;

export class SocialLinks extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(socialLinksTemplate.content.cloneNode(true));
    }

    generateView() {
        for (let i = 0; i < this.data.length; i++) {
            let container = document.createElement('div');
            container.classList.add('container', 'sub');
            container.innerHTML = `<a href="${this.data[i]}">${this.data[i]}</a>`;
            this.shadowRoot.querySelector('#link-list').appendChild(container)
        }
    }

    get src() {
        return this.getAttribute('src');
    }
    static get observedAttributes() {
        return ['src'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.data = JSON.parse(this.src);
        this.generateView();
    }
}

window.customElements.define('social-links', SocialLinks);
