const templateResizeableColumns = document.createElement('template');
templateResizeableColumns.innerHTML = `
<style>
.wrapper {
  display: flex;
}

.box {
  box-sizing: border-box;
  background: white;
}
.first{
  flex: 1 1 auto;
}

.second{
    flex: 1 1 auto;
}
.handler {
  width: 7px;
  padding: 0;
  cursor: col-resize;
  flex: 0 0 auto;
  background: #ededed;
}
</style>
<div class="wrapper">
  <div class="box first">
    <slot name="first"></slot>
  </div>
  <div class="handler"></div>
  <div class="box second">
    <slot name="second"></slot>
  </div>
</div>
`;

class ResizeableColumns extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateResizeableColumns.content.cloneNode(true));
  }

  connectedCallback() {
    this.handler = this.shadowRoot.querySelector('.handler');
    this.wrapper = this.shadowRoot.querySelector('.wrapper');
    this.boxA = this.shadowRoot.querySelector('.box');
    if (this.first && this.second) {
      this.shadowRoot.querySelector('.first').style.flex = this.first + ' ' + this.first + ' auto'
      this.shadowRoot.querySelector('.second').style.flex = this.second + ' ' + this.second + ' auto'
    }
    this.isHandlerDragging = false;
    this.handler.addEventListener('mousedown', function (e) {
      this.isHandlerDragging = true;
    }.bind(this));

    window.addEventListener('mousemove', function (e) {
      if (!this.isHandlerDragging) {
        return false;
      }
      var containerOffsetLeft = this.wrapper.offsetLeft;
      var pointerRelativeXpos = e.clientX - containerOffsetLeft;
      var boxAminWidth = 60;
      this.boxA.style.width = (Math.max(boxAminWidth, pointerRelativeXpos - 8)) + 'px';
      this.boxA.style.flexGrow = 0;
    }.bind(this));

    window.addEventListener('mouseup', function (e) {
      this.isHandlerDragging = false;
    }.bind(this));
  }

  get first() {
    return this.getAttribute('first');
  }

  get second() {
    return this.getAttribute('second');
  }
}

window.customElements.define('resizeable-columns', ResizeableColumns);
