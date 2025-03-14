const imageUploadingTemplate = document.createElement('template');
imageUploadingTemplate.innerHTML = `
<div>
<slot></slot>
</div>
`;

export class ImageUploading extends HTMLElement {
    static get observedAttributes() {
        return ['close'];
    }

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(imageUploadingTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        window.addEventListener('DOMContentLoaded', (event) => {
            this.children[0].shadowRoot.querySelector('input').addEventListener('change', function (e) {
                this.preview = this.children[1].shadowRoot.querySelector('#preview');
                this.files = this.children[0].shadowRoot.querySelector('.file-input').files;
                this.selectedImage(e);

            }.bind(this));
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.closeImage();
    }

    selectedImage() {
        if (this.files) {
            [].forEach.call(this.files, this.readAndPreview.bind(this));
        }
    }

    readAndPreview(file) {
        let reader = new FileReader();
        reader.addEventListener("load", function () {
            let div = document.createElement('div');
            let image = new Image();
            div.classList.add('image-container');
            image.title = file.name;
            image.src = this.result;
            let imageDescription = document.createElement('div');
            imageDescription.classList.add('image-description');
            imageDescription.innerHTML = `
                    <span class="close-image">&#10060;</span>
                    <b>Name:</b><span class="image-name"></span><br>
                    <b>Size</b><span class="image-size"></span><br>
            `;
            div.appendChild(image);
            div.appendChild(imageDescription);
            this.preview.appendChild(div);
            let imageName = div.querySelector('.image-name');
            let imageSize = div.querySelector('.image-size');
            imageName.innerHTML = ' ' + file.name;
            imageSize.innerHTML = ' ' + Math.round(file.size / 1024) + 'KB';
            this.children[1].setAttribute('imagesLoaded', 'true');
        }, false);
        reader.readAsDataURL(file);
    }

    closeImage() {
        let imgArray = Object.values(this.files);

        for (let i = 0; i < imgArray.length; i++) {
            if (imgArray[i].name === this.close) {
                imgArray.splice(i, 1);
            }
        }

        if (imgArray) {
            [].forEach.call(imgArray, this.readAndPreview).bind(this);
        }
    }

    get close() {
        return this.getAttribute('close');
    }
}

window.customElements.define('image-uploading', ImageUploading);