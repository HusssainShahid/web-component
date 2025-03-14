const TemplateCityName = document.createElement('template');
TemplateCityName.innerHTML = `
<div></div> 
 `;

export class CityName extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateCityName.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('div').innerHTML=this.content;
    }

    get content() {
        return this.getAttribute("content")
    }

}

window.customElements.define('city-name', CityName);
