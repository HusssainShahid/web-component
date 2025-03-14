const TemplateImgItem = document.createElement('template');
TemplateImgItem.innerHTML = `
<style>
    .img-card {
      margin: 5px;
      border: 1px solid #ccc;
      width: 280px;
      transition: 0.5s;
      border-radius: 4px;
      display: inline-block;
      /*position: relative;*/
    }
    .img-card:hover{
       box-shadow: 0 0 10px 3px rgba(0,0,0,0.11);
    }
    
    .img-card img {
      width: 100%;
      height: 100%;
    }
    
    .caption {
    /*position: absolute;*/
    /*bottom: 5px;*/
      margin-top:10px;
      padding: 15px;
      text-align: center;
      font-size: 3vmin;
    }
    .caption:hover{
       cursor: pointer;
    }
</style>
<div class="img-card">
    <img>
    <div class="caption"></div>
</div>
  `;

export class ImgItem extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateImgItem.content.cloneNode(true));
    }

    connectedCallback() {
        this.shadowRoot.querySelector('img').src = this.src;
        this.shadowRoot.querySelector('img').alt = this.alt;
        this.shadowRoot.querySelector('div').style.height = this.height;
        this.shadowRoot.querySelector('div').style.width = this.width;
        this.shadowRoot.querySelector('.caption').innerText = this.caption;
        if (this.caption == null) {
            this.shadowRoot.querySelector('.caption').style.display = 'none';
            this.shadowRoot.querySelector('img').style.height = '100%';
            this.shadowRoot.querySelector('.img-card').style.border = 'none';
        }
    }

    get src() {
        return this.getAttribute('src');
    }

    get alt() {
        return this.getAttribute('alt');
    }

    get width() {
        return this.getAttribute('width');
    }

    get height() {
        return this.getAttribute('height');
    }

    get caption() {
        return this.getAttribute('caption');
    }
}

window.customElements.define('img-item', ImgItem);
