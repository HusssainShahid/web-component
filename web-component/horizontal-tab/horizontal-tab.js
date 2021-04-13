const templateHorizontalTab = document.createElement('template');
templateHorizontalTab.innerHTML = `
<style>
    .tab-button{
      overflow: hidden;
      border: 1px solid #ccc;
      background-color: #f1f1f1;
    }
</style>
<div class="tab-button"><slot name="tab-button"></slot></div>
<slot name="tab-view"></slot>  `;

export class HorizontalTab extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateHorizontalTab.content.cloneNode(true));
    }

    connectedCallback() {
        this.initialization();
    }

    initialization() {
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].tagName === 'TAB-BUTTON') {
                this.children[i].addEventListener('click', e => {
                    this.activateTab(i);
                })
            }
            if (this.children[i].tagName === 'TAB-VIEW') {
                this.children[i].setAttribute('show', 'false');
            }
        }
    }

    activateTab(activeIndex) {
        let targetId = this.children[activeIndex].getAttribute('target-id');
        for (let i = 0; i < this.children.length; i++) {
            if (this.children[i].tagName === 'TAB-VIEW') {
                if (this.children[i].getAttribute('id') === targetId) {
                    this.children[i].setAttribute('show', 'true');
                } else {
                    this.children[i].setAttribute('show', 'false');
                }
            }
            if (this.children[i].tagName === 'TAB-BUTTON') {
                this.children[i].setAttribute('active', 'false');
            }
        }
        this.children[activeIndex].setAttribute('active', 'true');
    }
}

window.customElements.define('horizontal-tab', HorizontalTab);
