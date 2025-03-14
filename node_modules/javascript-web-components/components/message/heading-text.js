const TemplateHeadingText = document.createElement('template');
TemplateHeadingText.innerHTML = `
<style>
    .xl{
        font-size: 40px;
    }
   .lg{
        font-size: 30px;
   }
   .md{
        font-size: 25px;
   }
   .sm{
        font-size: 16px;
   }
   .xsm{
        font-size: 14px;
   }
</style>
<p>
<slot></slot>
</p>
  `;

export class HeadingText extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateHeadingText.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('p').classList.add(this.display);
        this.shadowRoot.querySelector('p').style.color= this.color;
        if(this.center){
            this.shadowRoot.querySelector('p').style.textAlign= 'center';
        }
        this.shadowRoot.querySelector('p').style.color= this.color;
    }

    get display() {
        return this.getAttribute('display')
    }
    get color(){
        return this.getAttribute('color');
    }
    get center(){
        return this.hasAttribute('center');
    }
}

window.customElements.define('heading-text', HeadingText);
