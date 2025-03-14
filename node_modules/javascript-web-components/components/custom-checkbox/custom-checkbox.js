const TemplateCustomCheckBox = document.createElement('template');
TemplateCustomCheckBox.innerHTML = `
<style>
*,
*:after,
*:before {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
.check-boxes {
  margin: 50px auto;
  position: relative;
}

.check-boxes label {
  width: 100%;
  height: 100%;
  position: relative;
  display: block;
}

.check-boxes input {
  top: 0; 
  right: 0; 
  bottom: 0; 
  left: 0;
  opacity: 0;
  z-index: 100;
  position: absolute;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.check-boxes.round {
  width: 30px;
  height: 30px;
}

.check-boxes.round label {
  border-radius: 50%;
  background: #eaeaea;
  box-shadow: 
      0 3px 5px rgba(0,0,0,0.25),
      inset 0 1px 0 rgba(255,255,255,0.3),
      inset 0 -5px 5px rgba(100,100,100,0.1),
      inset 0 5px 5px rgba(255,255,255,0.3);
}

.check-boxes.round label:after {
  content: "";
  position: absolute;
  top: -8%; right: -8%; bottom: -8%; left: -8%;
  z-index: -1;
  border-radius: inherit;
  background: #ddd;
  background: linear-gradient(#ccc, #fff);
  box-shadow: 
    inset 0 2px 1px rgba(0,0,0,0.15),
    0 2px 5px rgba(200,200,200,0.1);
}

.check-boxes.round label:before {
  content: "";
  position: absolute;
  width: 20%;
  height: 20%;
  border-radius: inherit;
  left: 40%;
  top: 40%;
  background: #969696;
  background: radial-gradient(40% 35%, #ccc, #969696 60%);
  box-shadow:
      inset 0 2px 4px 1px rgba(0,0,0,0.3),
      0 1px 0 rgba(255,255,255,1),
      inset 0 1px 0 white;
}

.check-boxes.round input:checked ~ label {
  background: #dedede;
  background: linear-gradient(#dedede, #fdfdfd);
}

.check-boxes.round input:checked ~ label:before {
  background: #25d025;
  background: radial-gradient(40% 35%, #5aef5a, #25d025 60%);
  box-shadow:
      inset 0 3px 5px 1px rgba(0,0,0,0.1),
      0 1px 0 rgba(255,255,255,0.4),
      0 0 10px 2px rgba(0, 210, 0, 0.5);
}

.check-boxes.switch {
  width: 18px;
  height: 35px;
}

.check-boxes.switch label {
  background: #cbc7bc;
  margin: 0 auto;
  border-radius: 5px;
  box-shadow:
      inset 0 1px 0 white,
      0 0 0 1px #999,
      0 0 5px 1px rgba(0,0,0,0.2),
      0 2px 0 rgba(255,255,255,0.6),
      inset 0 10px 1px #e5e5e5,
      inset 0 11px 0 rgba(255,255,255,0.5),
      inset 0 -45px 3px #ddd;
}

.check-boxes.switch label:after {
  content: "";
  position: absolute;
  top: -20px;
  left: -25px;
  bottom: -20px;
  right: -25px;
  background: #ccc;
  background: linear-gradient(#ddd, #bbb);
  z-index: -1;
  border-radius: 5px;
  border: 1px solid #bbb;
  box-shadow:
      0 0 5px 1px rgba(0,0,0,0.15),
      0 3px 3px rgba(0,0,0,0.3),
      inset 0 1px 0 rgba(255,255,255,0.5);
}

.check-boxes.switch input:checked ~ label {
  background: #d2cbc3;
  box-shadow:
      inset 0 1px 0 white,
      0 0 0 1px #999,
      0 0 5px 1px rgba(0,0,0,0.2),
      inset 0 -10px 0 #aaa,
      0 2px 0 rgba(255,255,255,0.1),
      inset 0 45px 3px #e0e0E0,
      0 8px 6px rgba(0,0,0,0.18);
}

.check-boxes.tab {
  width: 120px;
  height: 35px;
}

.check-boxes.tab label {
  display: block;
  width: 100%;
  height: 100%;
  background: #a5a39d;
  border-radius: 40px;
  box-shadow:
      inset 0 3px 8px 1px rgba(0,0,0,0.2),
      0 1px 0 rgba(255,255,255,0.5);
}

.check-boxes.tab label:after {
  content: "";
  position: absolute;
  z-index: -1;
  top: -8px; right: -8px; bottom: -8px; left: -8px;
  border-radius: inherit;
  background: #ababab;
  background: linear-gradient(#f2f2f2, #ababab);
  box-shadow: 0 0 10px rgba(0,0,0,0.3),
        0 1px 1px rgba(0,0,0,0.25);
}

.check-boxes.tab label:before {
  content: "";
  position: absolute;
  z-index: -1;
  top: -18px; right: -18px; bottom: -18px; left: -18px;
  border-radius: inherit;
  background: #eee;
  background: linear-gradient(#e5e7e6, #eee);
  box-shadow:
      0 1px 0 rgba(255,255,255,0.5);
  filter: blur(1px);
}

.check-boxes.tab label i {
  display: block;
  height: 100%;
  width: 60%;
  border-radius: inherit;
  background: silver;
  position: absolute;
  z-index: 2;
  right: 40%;
  top: 0;
  background: linear-gradient(#f7f2f6, #b2ac9e);
  box-shadow:
      inset 0 1px 0 white,
      0 0 8px rgba(0,0,0,0.3),
      0 5px 5px rgba(0,0,0,0.2);
}

.check-boxes.tab label i:after {
  content: "";
  position: absolute;
  left: 15%;
  top: 25%;
  width: 70%;
  height: 50%;
  background: #d2cbc3;
  background: linear-gradient(#cbc7bc, #d2cbc3);
  border-radius: inherit;
}

.check-boxes.tab label i:before {
  content: "off";
  text-transform: uppercase;
  font-style: normal;
  font-weight: bold;
  color: rgba(0,0,0,0.4);
  text-shadow: 0 1px 0 #bcb8ae, 0 -1px 0 #97958e;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 15px;
  position: absolute;
  top: 50%;
  margin-top: -12px;
  right: -50%;
}

.check-boxes.tab input:checked ~ label {
  background: #9abb82;
}

.check-boxes.tab input:checked ~ label i {
  right: -1%;
}

.check-boxes.tab input:checked ~ label i:before {
  content: "on";
  right: 115%;
  color: #82a06a;
  text-shadow: 
    0 1px 0 #afcb9b,
    0 -1px 0 #6b8659;
    font-size: 15px;
}

.check-boxes.power {
  width: 50px;
  height: 50px;
}

.check-boxes.power label {
  border-radius: 50%;
  background: #b2ac9e;
  background: linear-gradient(#f7f2f6, #b2ac9e);
  position: relative;
  color: #a5a39d;
  font-size: 40px;
  text-align: center;
  line-height: 40px;

  transition: all 0.3s ease-out;

  text-shadow: 0 2px 1px rgba(0,0,0,0.25);

  box-shadow:
    inset 0 2px 3px rgba(255,255,255,0.13),
    0 5px 8px rgba(0,0,0,0.3),
    0 10px 10px 4px rgba(0,0,0,0.3);
  z-index: -1;
}

.check-boxes.power label:after {
  content: ""; 
  position: absolute;
  left: -15px;
  right: -15px;
  top: -15px;
  bottom: -15px;
  z-index: -2;
  border-radius: inherit;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.1),
    0 1px 2px rgba(0,0,0,0.3),
    0 0 10px rgba(0,0,0,0.15);
  
}

.check-boxes.power label:before {
  content: ""; 
  position: absolute;
  left: -10px;
  right: -10px;
  top: -10px;
  bottom: -10px;
  z-index: -1;
  border-radius: inherit;
  box-shadow: inset 0 10px 10px rgba(0,0,0,0.13); 
  filter: blur(1px); 
}

.check-boxes.power input:checked ~ label {
  box-shadow:
    inset 0 2px 3px rgba(255,255,255,0.13),
    0 5px 8px rgba(0,0,0,0.35),
    0 3px 10px 4px rgba(0,0,0,0.2);
  color: #9abb82;
} 

.check-boxes.power .icon-off:after {
  content: "";
  display: block;
  position: absolute;
  width: 70%;
  height: 70%;
  left: 50%;
  top: 50%;
  z-index: -1;
  margin: -35% 0 0 -35%;
  border-radius: 50%;
  background: #d2cbc3;
  background: linear-gradient(#cbc7bc, #d2cbc3);
  box-shadow:
    0 -2px 5px rgba(255,255,255,0.05),
    0 2px 5px rgba(255,255,255,0.1);
}
.icon-off:before{ 
    content: "\\229A";
}

    </style>
    <div class="check-boxes">
        <input type="checkbox">
        <label></label>
    </div>
  `;

export class CustomCheckbox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(TemplateCustomCheckBox.content.cloneNode(true));
    }

    connectedCallback() {
        this.initializing();
        this.addEventListener('click', this._onClick);
        if (this.checked) {
            this.shadowRoot.querySelector('input').checked = true;
        }
    }

    initializing() {
        if (this.round) {
            this.shadowRoot.querySelector('div').classList.add('round');
        } else if (this.switch) {
            this.shadowRoot.querySelector('div').classList.add('switch');
        } else if (this.tab) {
            this.shadowRoot.querySelector('label').innerHTML = '<i></i>';
            this.shadowRoot.querySelector('div').classList.add('tab');
        } else if (this.power) {
            this.shadowRoot.querySelector('div').classList.add('power');
            this.shadowRoot.querySelector('label').innerHTML = '<span class="icon-off"></span>';
        }
    }

    get round() {
        return this.hasAttribute('round');
    }

    get tab() {
        return this.hasAttribute('tab');
    }

    get switch() {
        return this.hasAttribute('switch');
    }

    get power() {
        return this.hasAttribute('power');
    }

    get checked() {
        return this.hasAttribute('checked');
    }

    set checked(value) {
        const isChecked = Boolean(value);
        if (isChecked)
            this.setAttribute('checked', '');
        else
            this.removeAttribute('checked');
    }

    _onClick(event) {
        this.checked = !this.checked;
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                checked: this.checked,
            },
            bubbles: true,
        }));
    }
}

window.customElements.define('custom-checkbox', CustomCheckbox);
