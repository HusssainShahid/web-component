import BacklogTasksList from './backlog-tasks-list.js';

const ganttChartContainerTemplate = document.createElement('template');
ganttChartContainerTemplate.innerHTML = `

<style>
:host {
    display: block;
}
:host([hidden]) {
    display: none 
}
</style>

<div>
<backlog-tasks-list></backlog-tasks-list>
</div>
`;

class GanttChartContainer extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(ganttChartContainerTemplate.content.cloneNode(true));
  }

  connectedCallback() {
    // this.addEventListener('click', this.thisFunction);
    // window.addEventListener('componentSelected', this.windowFunction);
  }

  disconnectedCallback() {
    // this.removeEventListener('click', this.thisFunction);
    // window.removeEventListener('componentSelected', this.windowFunction);
  }

  static get observedAttributes() {
    return ['projectid'];
  }

  attributeChangedCallback(name, oldValue, newValue) {

    switch (name) {
      case 'projectid':
      this.shadowRoot.querySelector('backlog-tasks-list').setAttribute('projectid', newValue);
        break;
    }
  }
}

window.customElements.define('gantt-chart-container', GanttChartContainer);
export default GanttChartContainer;
