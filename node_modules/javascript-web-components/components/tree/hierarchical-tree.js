const hierarchicalTreeTemplate = document.createElement('Template');
hierarchicalTreeTemplate.innerHTML = `
<div>
    <slot></slot>
</div>
`;

export class HierarchicalTree extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(hierarchicalTreeTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        window.addEventListener('DOMContentLoaded', (event) => {
            this.allNodes = this.querySelectorAll('tree-node');
            this.arrangeNodes();
        });
    }

    arrangeNodes() {
        this.notHaveChild();
        this.closeNodes();
        for (let i = 0; i < this.allNodes.length; i++) {
            this.allNodes[i].shadowRoot.querySelector('.arrow').addEventListener('click', function () {
                this.nodeClick(i);
            }.bind(this));
        }
    }

    notHaveChild() {
        for (let i = 0; i < this.allNodes.length; i++) {
            if (!this.allNodes[i].children.length > 0) {
                this.allNodes[i].shadowRoot.querySelector('.arrow').style.display = 'none';
                this.allNodes[i].shadowRoot.querySelector('.value').style.marginLeft = '25px';
            }
        }
    }

    closeNodes() {
        for (let i = 0; i < this.allNodes.length; i++) {
            this.allNodes[i].style.display = 'none';
        }
        this.allNodes[0].style.display = 'inline';
    }

    nodeClick(x) {
        let allChildren = this.allNodes[x].children;
        for (let i = 0; i < allChildren.length; i++) {
            let display = allChildren[i].getAttribute('style');
            if (display === 'display: none;') {
                for (let j = 0; j < allChildren.length; j++) {
                    allChildren[i].style.display = 'inline'
                }
            } else {
                for (let j = 0; j < allChildren.length; j++) {
                    allChildren[i].style.display = 'none'
                }
            }
        }

    }
}

window.customElements.define('hierarchical-tree', HierarchicalTree);