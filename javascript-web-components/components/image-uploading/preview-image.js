const previewImageTemplate = document.createElement('template');
previewImageTemplate.innerHTML = `
<style>
    #preview{
        display: flex;
        flex-wrap: wrap;
    }
    .images{
        width: 300px;
        height: 200px;
        padding: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        margin: 5px;
        transition: 0.3s;
    }
    .images:hover{
        box-shadow: 0 0 7px 2px rgba(117,117,117,0.22);
    }
    .image-container{
        position: relative;  
        margin: 15px;    
    }
    .image-description .close-image{
        position: absolute;
        top: -3px;
        right: -20px;
        z-index: 2;
        cursor: pointer;
    }
</style>
<div id="preview">
    
</div>
`;

export class PreviewImage extends HTMLElement {
    static get observedAttributes() {
        return ['imagesloaded'];
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(previewImageTemplate.content.cloneNode(true));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.imagesloaded === 'true') {
            this.viewImages();
        }
    }

    viewImages() {
        let image = this.shadowRoot.querySelectorAll("img");
        let div = this.shadowRoot.querySelectorAll(".image-container");
        let preview = this.shadowRoot.querySelector('#preview').children;
        for (let i = 0; i < preview.length; i++) {
            image[i].classList.add('images');
            image[i].style.width = this.width;
            image[i].style.height = this.height;
            div[i].style.width = this.width;
        }
        this.events();
    }

    events() {
        let closeButtons = this.shadowRoot.querySelectorAll('.close-image');
        for (let i = 0; i < closeButtons.length; i++) {
            closeButtons[i].addEventListener('click', function () {
                let imgTitle = this.shadowRoot.querySelectorAll('img')[i].getAttribute('title');
                this.closeImage(imgTitle);
            }.bind(this));
        }
    }

    closeImage(i) {
        let imageContainer = this.shadowRoot.querySelectorAll('.image-container')[i];
        this.parentNode.setAttribute('close', i);
    }


    get imagesloaded() {
        return this.getAttribute('imagesloaded');
    }

    get width() {
        return this.getAttribute('width');
    }

    get height() {
        return this.getAttribute('height');
    }
}

window.customElements.define('preview-image', PreviewImage);