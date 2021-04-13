const templateToolTip = document.createElement('template');
templateToolTip.innerHTML = `
<style>
   .tooltip {
    position: relative;
    display: inline-block;
  }
  
  .tooltip .tooltiptext {
    visibility: hidden;
    min-width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 10px;
    position: absolute;
    z-index: 30;
    bottom: 150%;
    left: 50%;
    margin-left: -60px;
  }
  
  .tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: black transparent transparent transparent;
  }
  
  .tooltip:hover .tooltiptext {
    visibility: visible;
  }
</style>
<div class="tooltip">
  <span class="tooltiptext"></span>
</div>
`;

export class ToolTip extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: "open"});
    this.shadowRoot.appendChild(templateToolTip.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector('.tooltiptext').innerHTML = this.tooltip;
    let span = document.createElement('span');
    if (this.trim) {
      span.innerHTML = this.trimText(this.content, this.trim)+ '....';
      if(parseInt(this.trim)>this.content.length){
        span.innerHTML = this.trimText(this.content, this.trim);
      }else {
        span.innerHTML = this.trimText(this.content, this.trim)+ '....';
      }
    } else {
      span.innerHTML = this.content;
    }
    this.shadowRoot.querySelector('.tooltip').insertBefore(span, this.shadowRoot.querySelector('.tooltip').firstChild);
  }

  trimText(string, length) {
    return string.substring(0, length);
  }

  get tooltip() {
    return this.getAttribute('tooltip');
  }

  get trim() {
    return this.getAttribute('trim')
  }

  get content() {
    return this.getAttribute('content')
  }
}

window.customElements.define('tool-tip', ToolTip);
