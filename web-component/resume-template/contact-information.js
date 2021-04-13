const contactInformationTemplate = document.createElement('template');
contactInformationTemplate.innerHTML = `
<style>
:host([hidden]) {
    display: none
}
.wrapper{
    letter-spacing: 1.3px;
    line-height: 1.4;
    font-family: "Times New Roman", Times, serif;
}
.row{
    display: flex;
    flex-wrap: nowrap;
}
.w-75{
    width: 13.125cm;
}
.w-25{
    width: 7.95cm;
}
.container{
    margin: 30px 0;
}
.title{
    font-size: 14pt;
}
.body{
    font-size: 13pt;
}
.sub{
    font-size: 9pt;
    color: #6C757D;
}
.p-bottom{
    padding-bottom: 15px;
}</style>
<div class="wrapper">
    <div class="title">Contacts</div>
    <div id="contact-list"></div>
</div>
`;

export class ContactInformation extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(contactInformationTemplate.content.cloneNode(true));
    }

    generateView() {
        for (let i = 0; i < this.data.length; i++) {
            let container = document.createElement('div');
            container.classList.add('sub');
            container.innerHTML = this.data[i];
            this.shadowRoot.querySelector('#contact-list').appendChild(container)
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

window.customElements.define('contact-information', ContactInformation);
