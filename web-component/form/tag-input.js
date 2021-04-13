import('../pill-badge');
const templateTagInput = document.createElement('template');
templateTagInput.innerHTML = `
<style>
    .tag-input-container{
        border: 1px solid #cccccc;
        padding: 5px;
        cursor: text;
        border-radius: 4px;
    }
    input{
        border: none;
        background: var(--primary-base);
        color: var(--primary-text);
    }
    input:focus{
        outline: none;
    }
    .hint{
        opacity: 0.5;
        font-size: var(--text-caption, 14px);
    }
    #require{
      color:var(--color-danger-darker, hsla(354, 70.3%, 44.9%, 1));
      font-size: var(--text-caption, 14px);
      margin: 2px;
    }
</style>
<div class="tag-input-container">
    <span class="tags"></span>
    <input type="text">
</div>
<div id="require"></div>
<div class="hint">Press enter or comma <b>,</b> to add another</div>
`;

export class TagInput extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateTagInput.content.cloneNode(true));
    }

    static get observedAttributes() {
        return ['validate', 'reset', 'data'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'reset') {
            this.tags = [];
            this.valid = false;
            this.shadowRoot.querySelector('.tags').innerHTML = '';
            this.shadowRoot.getElementById("require").innerHTML = '';
        }
        if (name === 'validate') {
            this.verify();
        }
        if (name === 'data') {
            this.tags = [];
            let data = this.data.split(',');
            for (let i = 0; i < data.length; i++) {
                this.addValue(data[i]);
            }
        }
    }

    connectedCallback() {
        this.input = this.shadowRoot.querySelector('input');
        this.container = this.shadowRoot.querySelector('.tag-input-container');
        if (this.borderNone) {
            this.container.style.border = 'none';
        }
        this.tags = [];
        this.valid = true;
        this.events();
        if (this.hint === 'false') {
            this.shadowRoot.querySelector('.hint').style.display = 'none';
        }
    }

    events() {
        this.input.addEventListener('keyup', e => {
            if (e.keyCode === 13 || e.keyCode === 188 || e.keyCode === 186) {
                if (e.keyCode === 188 || e.keyCode === 186) {
                    this.input.value = this.input.value.substring(0, this.input.value.length - 1);
                } else {
                    e.stopPropagation();
                }
                this.addValue(this.input.value);
            }
        });
        this.input.addEventListener('focusout', e => {
            this.addValue(this.input.value);
            e.stopPropagation();
        });
        this.addEventListener('click', e => {
            this.input.focus();
        })
    }

    addValue(value) {
        if (value !== '') {
            this.tags.push(value);
            this.addTag(this.tags);
            this.setAttribute('value', JSON.stringify(this.tags));
            this.input.value = '';
        }
    }

    addTag(data) {
        this.shadowRoot.getElementById("require").innerHTML = '';
        let tags = this.shadowRoot.querySelector('.tags');
        tags.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            let pillBadge = document.createElement('pill-badge');
            pillBadge.setAttribute('show-cross-button', 'show-cross-button');
            pillBadge.setAttribute('id', i);
            pillBadge.innerText = data[i];
            tags.appendChild(pillBadge);
            this.validateRegex(pillBadge.innerText, i);
            pillBadge.shadowRoot.querySelector('.close').addEventListener('click', function () {
                this.removePill(i);
            }.bind(this));
        }
    }

    validateRegex(text, id) {
        if (this.regex) {
            let regex = new RegExp(this.regex);
            if (!regex.test(text)) {
                let tag = this.shadowRoot.querySelectorAll('pill-badge')[id];
                tag.setAttribute('background', '#D93025');
                tag.setAttribute('color', '#ffffff');
                tag.setAttribute('border-none', 'border-none');
                this.shadowRoot.getElementById("require").innerHTML = 'Value in red is invalid.';
                this.setAttribute('error-message', 'Value in red is invalid.');
                this.valid = false;
            }
        }
    }

    verify() {
        if (this.tags.length === 0 && this.required === true) {
            this.shadowRoot.getElementById("require").innerHTML = 'This field is required';
            this.setAttribute('valid', 'false');
            this.setAttribute('error-message', 'Please add a value')
            return false;
        }
        if (this.valid) {
            this.setAttribute('valid', 'true');
        } else {
            this.setAttribute('valid', 'false');
            return false;
        }
        return true;
    }

    removePill(index) {
        this.tags.splice(index, 1);
        this.valid = true;
        this.addTag(this.tags);
        this.setAttribute('value', JSON.stringify(this.tags));
    }

    get required() {
        return this.hasAttribute('required');
    }

    get hint() {
        return this.getAttribute('hint');
    }

    get regex() {
        return this.getAttribute('regex');
    }

    get borderNone() {
        return this.hasAttribute('border-none');
    }

    get reset() {
        return this.getAttribute('reset');
    }

    get value() {
        return this.getAttribute('value');
    }

    get data() {
        return this.getAttribute('data');
    }

}

window.customElements.define('tag-input', TagInput);

