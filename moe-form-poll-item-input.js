import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-input/paper-input';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-icons/iron-icons';

class MoeFormPollItemInput extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    @apply --layout-horizontal;
    @apply --layout-end;
}
paper-input {
    @apply --layout-auto;
    width: 100%;
}
</style>
<paper-icon-button icon="cancel" disabled$="[[disabled]]" on-click="_onCancelClick"></paper-icon-button>
<paper-input id="input" label="投票選項 [[index]]" value="{{value}}" disabled$="[[disabled]]"></paper-input>
`;
    }

    static get properties() {
        return {
            value: {
                type: String,
                notify: true,
                reflectToAttribute: true
            },
            disabled: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            },
            index: {
                type: Number,
                reflectToAttribute: true
            }
        };
    }

    focus() {
        this.$.input.focus();
    }

    _onCancelClick(e) {
        this.dispatchEvent(new CustomEvent('remove'));
    }
}

window.customElements.define('moe-form-poll-item-input', MoeFormPollItemInput);