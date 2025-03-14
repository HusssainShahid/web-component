const templateTimeCard = document.createElement('template');
templateTimeCard.innerHTML = `
<style>
    .card{
        padding: 40px 20px;
        box-shadow: 0 0 17px 1px rgba(0,0,0,0.07);
        text-align: center;
        display: flex;
    }
    .city-date{    
        width:40%;
        font-size: 3vmax;
    }
    .time{
        width:58%
        float: right;
        display: flex;
        font-size: 6vmax;
        justify-content: center;
        margin: 0 auto;
    }
    
</style>
<div class="card">
    <div class="city-date">
        <slot name="city-name"></slot>
        <slot name="full-date"></slot>
    </div>
    <div class="time">
        <slot name="local-time"></slot>
        <slot name="period"></slot>
    </div>
</div>
`;

export class TimeCard extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(templateTimeCard.content.cloneNode(true));
    }


}

window.customElements.define('time-card', TimeCard);