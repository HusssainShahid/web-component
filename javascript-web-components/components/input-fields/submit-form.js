const TemplateSubmitForm = document.createElement('template');
TemplateSubmitForm.innerHTML = `

<div>
    <slot></slot>
    <slot name="submit"></slot>
    <p style="color: green" id="message"></p>
</div>
  `;

export class SubmitForm extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateSubmitForm.content.cloneNode(true));
    }

    connectedCallback() {
        this.allFields = ['INPUT-TEXT', 'INPUT-NUMBER', 'EMAIL-ADDRESS', 'INPUT-PASSWORD', 'AUTOGROW-TEXTAREA'];
        this.formData = [];
        this.shadowRoot.querySelector('slot[name="submit"]').addEventListener('click', this.inputValues.bind(this));
    }

    inputValues() {
        this.allChild = this.children;
        for (let i = 0; i < this.allChild.length; i++) {
            for (let j = 0; j < this.allFields.length; j++) {
                if (this.allChild[i].tagName === this.allFields[j]) {
                    if (this.allChild[i].getAttribute('valid') !== 'false') {
                        let data = {};
                        let key = this.allChild[i].getAttribute('name');
                        let value = this.allChild[i].value;
                        data[key] = value;
                        this.formData.push(data);
                        if (this.api !== null || this.method !== null) {
                            this.submitForm();
                        } else {
                            this.setAttribute('data', JSON.stringify(this.formData));
                        }
                    }
                }
            }
        }
    }

    submitForm() {
        fetch(this.api, {
            method: this.method,
            body: JSON.stringify(this.formData)
        })
            .then(response => response.json())
            .then(json => {
                this.shadowRoot.querySelector('#message').innerHTML = 'Form submitted successfully';
                let that = this;
                setTimeout(function () {
                    that.shadowRoot.querySelector('#message').innerHTML = '';
                }, 2000)
            })
    }

    get api() {
        return this.getAttribute('api')
    }

    get method() {
        return this.getAttribute('method')
    }
}

window.customElements.define('submit-form', SubmitForm);
