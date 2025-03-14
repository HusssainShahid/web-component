const treeNodeTemplate = document.createElement('template');
treeNodeTemplate.innerHTML = `
<style>
    .row{
        display: flex;
        flex-wrap: wrap;
        position: relative;
    }
    p.arrow{
          transform: rotate(90deg);
          width: 20px;
          height: 20px;
          cursor: pointer;
          margin: 3px;
          font-size: 14px;
    }
    .value{
        white-space: nowrap;
        margin: 0;
    }
    .node{
            margin-left: 40px;
    }
</style>
<div class="row">
    <p class="arrow">&#9650;</p>
    <p class="value"></p>
    </div>
    <div class="node">
        <slot></slot>
    </div>
`;

export class TreeNode extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(treeNodeTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        this.angle=90;
        this.shadowRoot.querySelector('.value').innerHTML = this.value;
        this.shadowRoot.querySelector('.arrow').addEventListener("click", function () {
            if(this.angle===90){
                this.shadowRoot.querySelector('.arrow').style.transform= 'rotate(180deg)';
                this.shadowRoot.querySelector('.arrow').style.marginTop= '0';
                this.angle=180;
            }else if(this.angle===180){
                this.shadowRoot.querySelector('.arrow').style.transform= 'rotate(90deg)';
                this.shadowRoot.querySelector('.arrow').style.marginTop= '3px';
                this.angle=90;
            }
        }.bind(this))
    }

    get value() {
        return this.getAttribute('value');
    }
}

window.customElements.define('tree-node', TreeNode);