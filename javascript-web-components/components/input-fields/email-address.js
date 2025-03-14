const templateEmailAddress = document.createElement('template');
templateEmailAddress.innerHTML = `
<style>
    input{
     width: var(--email-address-width, 100%);
     padding: 12px 20px;
     display: inline-block;
     border: 1px solid #ccc;
     border-radius: 4px;
     box-sizing: border-box;
    }
    input:focus{
    outline: 1px solid #6119EA;
    }
    ::slotted(*){
        font-size: 18px;
        margin-bottom: 8px;
    }
    p{
    color:#DC3545;
    }
</style>
<slot name="label"></slot>
<input type="email" id="input">    
<p id="require"></p>
<p id="wrong-format"></p>
`;
const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

export class EmailAddress extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateEmailAddress.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('input').placeholder = this.placeholder;
        this.addEventListener('focusout', this.getValue);
        this.shadowRoot.querySelector('input').disabled = this.disable;
        this.shadowRoot.querySelector('input').value = this.value;
        if (this.value === null && this.placeholder===null) {
            this.shadowRoot.querySelector('input').placeholder='';
        }
    }

    getValue() {
        const inputValue = this.shadowRoot.querySelector("input").value;
        this.verify(inputValue);
        this.setAttribute('value', inputValue);
    }

    verify(inputValue) {
        let valid;
        if (inputValue === '' && this.required === true) {
            valid = "Email is require";
            this.shadowRoot.getElementById("require").innerHTML = valid;
            this.shadowRoot.getElementById("wrong-format").innerHTML = null;
            this.shadowRoot.querySelector('input').style.outline='1px solid red';
            this.setAttribute('valid', 'false')
        } else if (!inputValue.match(mailformat)) {
            this.shadowRoot.getElementById("require").innerHTML = null;
            valid = "Wrong email format";
            this.shadowRoot.getElementById("wrong-format").innerHTML = valid;
            this.shadowRoot.querySelector('input').style.outline='1px solid red';
            this.setAttribute('valid', 'false')
        } else {
            this.shadowRoot.getElementById("require").innerHTML = null;
            this.shadowRoot.getElementById("wrong-format").innerHTML = null;
            this.shadowRoot.querySelector('input').style.outline='1px solid #6119EA';
            this.setAttribute('valid', 'true')
        }
    }

    get placeholder() {
        return this.getAttribute('placeholder');
    }

    get required() {
        return this.hasAttribute('required');
    }

    get value() {
        return this.getAttribute('value');
    }

    get disable() {
        return this.hasAttribute('disable');
    }

    set disable(value) {
        if (value)
            this.setAttribute('disable', '');
        else
            this.removeAttribute('disable');
    }
}

window.customElements.define('email-address', EmailAddress);
