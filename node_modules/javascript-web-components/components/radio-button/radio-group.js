const radioButtonGroup = document.createElement("template");
radioButtonGroup.innerHTML = `
<div>
<slot></slot>
</div>
  `;

export class RadioGroup extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.shadowRoot.appendChild(radioButtonGroup.content.cloneNode(true));
    }

    connectedCallback() {
        const config = { attributes: true, childList: true, subtree: true };
        const callback = function(mutationsList, observer) {
            for(let mutation of mutationsList) {
                let allRadioButtons = this.querySelectorAll('radio-button');
                for (let i = 0; i < allRadioButtons.length; i++) {
                    allRadioButtons[i].shadowRoot.querySelector('input').addEventListener('change', function () {
                        for (let j = 0; j < allRadioButtons.length; j++) {
                            allRadioButtons[j].removeAttribute('checked')
                        }
                        allRadioButtons[i].setAttribute('checked', true);
                        this.setAttribute('selected', i.toString());
                    }.bind(this))
                }
            }
        }.bind(this);

        const observer = new MutationObserver(callback);

        observer.observe(this, config);

    };
}

window.customElements.define('radio-group', RadioGroup);
