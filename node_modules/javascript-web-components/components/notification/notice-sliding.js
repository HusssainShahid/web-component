const templateNotification = document.createElement('template');
templateNotification.innerHTML = `
<style>
    .slider {
        margin-top: 30px;
        border-radius: 3px;
        height: 90px;
        width: 0;
        position: fixed;
        z-index: 100;
        top: 0;
        right: -40px;
        overflow: hidden;
        transition: 0.5s;
        border: 1px solid rgba(0,0,0,0.05);
        box-shadow: 0 0 7px 1px rgba(0,0,0,0.07);
        padding: 3px 10px;
        border-left:4px solid black; 
        background: white;
        color: rgba(0,0,0,0.73);
    }
    .cross{
        position: relative;
        color: #000;
        float: right;
    }
    .cross-span{
        position: absolute;
        top: -50px;
        right:5px;
        text-shadow: 2px 2px rgba(0,0,0,0.05);
        cursor: pointer;
        transition: 0.2s;
    }
    .cross-span:hover{
        color: #e50000;
        font-size: 17px;
    }
    .text{
        display: inline;
    }
    ::slotted([slot="icon"]){
        width: 20%;
        height: 80%;
        float: left;
        font-size: calc(3vw + 3vh);
        padding: 10px;
        margin: 0;
    }
</style>
<div class="container">
    <slot name="button"></slot>
    <div class="slider">
        <slot name="icon"></slot>
        <h3 class="heading"></h3>
        <p class="text"></p>
        <div class="cross">
            <span class="cross-span">&#10006;</span>
        </div>
    </div>
</div>
  `;

export class NoticeSliding extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateNotification.content.cloneNode(true));
    }

    connectedCallback() {
        this.colorList = ['primary', 'secondary', 'info', 'success', 'warning', 'danger'];
        this.colors = ['#337AB7', '#6C757D', '#5BC0DE', '#5CB85C', '#F0AD4E', '#D9534F'];
        this.notification = 0;
        this.shadowRoot.querySelector('h3').innerHTML = this.header;
        this.shadowRoot.querySelector('p').innerHTML = this.body;
        this.shadowRoot.querySelector('slot[name=button]').addEventListener('click', this.showHideNotice.bind(this), false);
        this.SliderStyle();
        this.autoClose();
        this.shadowRoot.querySelector('.cross-span').addEventListener('click', this.closeSlide.bind(this), false);
    }

    showHideNotice() {
        if (this.notification === 0) {
            this.shadowRoot.querySelector('.slider').style.width = "350px";
            this.shadowRoot.querySelector('.slider').style.right = '0';
            let that = this;
            setTimeout(function () {
                that.shadowRoot.querySelector('.slider').style.width = "320px";
            }, 400);
            this.notification = 1;
        } else {
            this.closeSlide();
        }
    }

    autoClose() {
        if (this.autoclose) {
            let that = this;
            setTimeout(that.closeSlide.bind(this), 5000);
        }
    }

    closeSlide() {
        this.shadowRoot.querySelector('.slider').style.width = "0";
        this.shadowRoot.querySelector('.slider').style.right = '-40px';
        this.notification = 0;
    }

    SliderStyle() {
        for (let i = 0; i < this.colorList.length; i++) {
            if (this.colorList[i] === this.is) {
                let borderColors = this.colors[i];
                this.shadowRoot.querySelector('.slider').style.borderLeftColor = borderColors;
            }
        }
    }

    get is() {
        let color = 'default';
        if (this.hasAttribute('is')) {
            let askedType = this.getAttribute("is");
            if (this.colorList.indexOf(askedType) !== -1) {
                color = askedType;
            }
        }
        return color;
    }

    get header() {
        return this.getAttribute("header")
    }

    get body() {
        return this.getAttribute("body")
    }

    get autoclose() {
        return this.hasAttribute('autoclose');
    }

}

window.customElements.define('notice-sliding', NoticeSliding);