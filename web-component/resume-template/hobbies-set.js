const hobbiesSetTemplate = document.createElement('template');
hobbiesSetTemplate.innerHTML = `
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
    <div class="title">Hobbies</div>
    <div id="hobbies-list"></div>
</div>
`;

export class HobbiesSet extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(hobbiesSetTemplate.content.cloneNode(true));
    }

    generateView() {
        for (let i = 0; i < this.data.length; i++) {
            let container = document.createElement('span');
            container.classList.add('sub');
            container.innerHTML = `${i>0? ',': ''}<span>${this.data[i]}</span>`;
            this.shadowRoot.querySelector('#hobbies-list').appendChild(container)
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

window.customElements.define('hobbies-set', HobbiesSet);
