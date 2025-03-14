const templateInputNumber = document.createElement('template');
templateInputNumber.innerHTML = `
<style>
    input{
     width: var(--input-number-width, 100%);
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
<input type="number" id="input">    
<p id="require"></p>
<p id="max"></p>
<p id="min"></p>
`;

export class InputNumber extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateInputNumber.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('input').placeholder = this.placeholder;
        this.shadowRoot.querySelector('input').value = this.value;
        if (this.value === null && this.placeholder===null) {
            this.shadowRoot.querySelector('input').placeholder='';
        }
        this.addEventListener('keyup', this.getValue);
        this.addEventListener('focusout', this.getValue);
        this.shadowRoot.querySelector('input').disabled = this.disable;
    }

    getValue() {
        const inputValue = this.shadowRoot.querySelector("input").value;
        this.verify(inputValue);
        this.setAttribute('value', inputValue);
    }

    verify(inputValue) {
        let valid;
        if (inputValue === '' && this.required === true) {
            valid = "This field is require";
            this.shadowRoot.getElementById("require").innerHTML = valid;
            this.shadowRoot.querySelector('input').style.outline='1px solid red';
            this.setAttribute('valid', 'false')
        } else if (inputValue.length < this.min && this.min !== null) {
            valid = "This field must not be less then " + this.min;
            this.shadowRoot.getElementById("min").innerHTML = valid;
            this.shadowRoot.getElementById("require").innerHTML = null;
            this.shadowRoot.querySelector('input').style.outline='1px solid red';
            this.setAttribute('valid', 'false')
        } else if (inputValue.length > this.max && this.max !== null) {
            valid = "This field must not be greater then " + this.max;
            this.shadowRoot.getElementById("max").innerHTML = valid;
            this.shadowRoot.getElementById("min").innerHTML = null;
            this.shadowRoot.querySelector('input').style.outline='1px solid red';
            this.setAttribute('valid', 'false')
        } else {
            this.shadowRoot.getElementById("require").innerHTML = null;
            this.shadowRoot.getElementById("min").innerHTML = null;
            this.shadowRoot.getElementById("max").innerHTML = null;
            this.shadowRoot.querySelector('input').style.outline='1px solid #6119EA';
            this.setAttribute('valid', 'true')
        }
    }

    get placeholder() {
        return this.getAttribute('placeholder');
    }

    get min() {
        return this.getAttribute('min');
    }

    get max() {
        return this.getAttribute('max');
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

window.customElements.define('input-number', InputNumber);
