const templateAutoGrow = document.createElement('template');
templateAutoGrow.innerHTML = `
<style>
    textarea{
     width: var(--autogrow-textarea-width, 100%);
     padding: 12px 20px;
     margin-top: 8px;
     display: inline-block;
     border: 1px solid #ccc;
     border-radius: 4px;
     box-sizing: border-box;
    }
    textarea:focus{
    outline: 1px solid #6119EA;
    }
    ::slotted(*){
        font-size: 18px;
    }
    p{
    color:#DC3545;
    }
</style>
<slot name="label"></slot>
<textarea id="input"></textarea>
<p id="require"></p>
<p id="max"></p>
<p id="min"></p>
`;

export class AutogrowTextarea extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateAutoGrow.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('textarea').placeholder = this.placeholder;
        this.shadowRoot.querySelector('textarea').rows = this.rows;
        this.addEventListener('keyup', this.getValue);
        this.addEventListener('focusout', this.getValue);
        this.textArea = this.shadowRoot.querySelector('textarea');
        this.autoGrow();
        this.shadowRoot.querySelector('textarea').disabled = this.disable;
        this.shadowRoot.querySelector('textarea').value = this.value;
        if (this.value === null && this.placeholder === null) {
            this.shadowRoot.querySelector('textarea').placeholder = '';
        }
    }

    autoGrow() {
        this.textArea.setAttribute('style', 'height:' + (this.textArea.scrollHeight) + 'px;overflow-y:hidden;resize:none;');
        this.textArea.addEventListener("input", function () {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        }, false);
    }

    getValue() {
        const inputValue = this.shadowRoot.querySelector("textarea").value;
        this.verify(inputValue);
        this.setAttribute('value', inputValue);
    }

    verify(inputValue) {
        let valid;
        if (inputValue === '' && this.required === true) {
            valid = "This field is require";
            this.shadowRoot.getElementById("require").innerHTML = valid;
            this.shadowRoot.querySelector('textarea').style.outline = '1px solid red';
            this.setAttribute('valid', 'false')
        } else if (inputValue.length < this.min && this.min !== null) {
            valid = "This field must not be less then " + this.min;
            this.shadowRoot.getElementById("min").innerHTML = valid;
            this.shadowRoot.getElementById("require").innerHTML = null;
            this.shadowRoot.querySelector('textarea').style.outline = '1px solid red';
            this.setAttribute('valid', 'false')
        } else if (inputValue.length > this.max && this.max !== null) {
            valid = "This field must not be greater then " + this.max;
            this.shadowRoot.getElementById("max").innerHTML = valid;
            this.shadowRoot.getElementById("min").innerHTML = null;
            this.shadowRoot.querySelector('textarea').style.outline = '1px solid red';
            this.setAttribute('valid', 'false')
        } else {
            this.shadowRoot.getElementById("require").innerHTML = null;
            this.shadowRoot.getElementById("min").innerHTML = null;
            this.shadowRoot.getElementById("max").innerHTML = null;
            this.shadowRoot.querySelector('textarea').style.outline = '1px solid #6119EA';
            this.setAttribute('valid', 'true')
        }
    }

    get placeholder() {
        return this.getAttribute('placeholder');
    }

    get rows() {
        return this.getAttribute('rows');
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

window.customElements.define('autogrow-textarea', AutogrowTextarea);
