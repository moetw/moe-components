import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button';
import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-icon';
import '@polymer/iron-flex-layout/iron-flex-layout';

import './moe-form-poll-item-input';

class MoeFormPollItems extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block
}
:host([hidden]) {
    display: none;
}
#add {
    @apply --layout-horizontal;
    @apply --layout-center-center;
    width: 100%;
}
#add > * {
    height: 24px;
    line-height: 24px;
}
ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
}
</style>
<ul>
    <template is="dom-repeat" items="[[items]]">
        <li><moe-form-poll-item-input index="[[index]]" value="{{item}}" on-remove="_onItemRemove" max-length="[[maxLength]]" disabled$="[[disabled]]"></moe-form-poll-item-input></li>
    </template>
</ul>
<paper-button id="add" on-click="_onAddClick" disabled$="[[disabled]]">
    <iron-icon icon="add"></iron-icon>
    <div>新增選項</div>
</paper-button>
`;
    }

    static get properties() {
        return {
            items: {
                type: Array,
                value: [],
                notify: true
            },
            minItems: Number,
            maxItems: Number,
            maxLength: Number,
            disabled: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        }
    }

    static get observers() {
        return [
            '_observeMinItems(minItems)'
        ];
    }

    add(value="") {
        if (this.items.length >= this.maxItems) {
            alert(`最多只能有${this.maxItems}個選項`);
            return false;
        }

        this.push('items', value);
        setTimeout(() => {
            this.shadowRoot.querySelector(`moe-form-poll-item-input[index="${this.items.length-1}"]`).focus();
        }, 0);
    }

    reset() {
        this.splice('items', 0, this.items.length);
        for (let i = 0;i < this.minItems;i++) {
            this.push('items', '');
        }
    }

    changed() {
        return !this.items.every(item => item === '');
    }

    _observeMinItems(minItems) {
        this.reset();
    }

    _onAddClick(e) {
        this.add();
    }

    _onItemRemove(e) {
        if (this.items.length <= 2) {
            alert('至少要有2個選項');
        } else {
            this.splice('items', e.currentTarget.index, 1);
        }
    }
}

window.customElements.define('moe-form-poll-items', MoeFormPollItems);