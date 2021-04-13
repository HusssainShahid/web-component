import {Chart} from "../../../node_modules/chart.js/dist/Chart";

const templateBurnDownChart = document.createElement('template');
templateBurnDownChart.innerHTML = `
<style>
:host {
    display: block;
}
:host([hidden]) {
    display: none 
}
</style>
    <canvas></canvas>
`;

class ChartBurnDown extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(templateBurnDownChart.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['url', 'type', 'src', 'burn-down-label', 'ideal-label'];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'url':
        this.url = newValue
        break;
      case 'type':
        this.type = newValue
        break;
      case 'src':
        this.src = newValue
        break;
      case 'burn-down-label':
        this.burnDownLabel = newValue
        break;
      case 'ideal-label':
        this.idealLabel = newValue
        break;
    }
    this.renderChart();
  }

  connectedCallBack() {

  }

  renderChart() {
    if (!this.burnDownLabel) {
      this.burnDownLabel = 'Burndown';

    }
    if (!this.idealLabel) {
      this.idealLabel = 'Ideal'
    }
    this.burnDownJson = JSON.parse(this.src);
    this.labelsData = this.burnDownJson.labels
    this.idealData = this.burnDownJson['ideal-hours']
    this.burnDownData = this.burnDownJson['burn-down-hours']
    this.chart = this.shadowRoot.querySelector('canvas');
    let myChart = new Chart(this.chart, {
      type: this.type,
      data: {
        labels: this.labelsData,
        datasets: [
          {
            label: this.burnDownLabel,
            data: this.burnDownData,
            fill: false,
            borderColor: "#EE6868",
            backgroundColor: "#EE6868",
            lineTension: 0,
            title: 'Hours'
          },
          {
            label: this.idealLabel,
            borderColor: "#6C8893",
            backgroundColor: "#6C8893",
            lineTension: 0,
            fill: false,
            data: this.idealData,
            title: 'Days'
          },
        ]
      },
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 20,
          fontColor: 'black'
        }
      },
      scales: {
        display: true,
        yAxes: [{
          ticks: {
            min: 0,
            max: Math.round(this.burnDownData[0] * 1.1),
          },
          scaleLabel: {
            display: true,
            labelString: 'Hours'
          }
        }],
        xAxes: [{
          ticks: {
            major: {
              fontStyle: 'bold',
            },
            scaleLabel: {
              display: true,
              labelString: 'Days'
            }
          }
        }],
      }
    });
  }

}

window.customElements.define('chart-burn', ChartBurnDown);

