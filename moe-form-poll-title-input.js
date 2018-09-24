import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-input/paper-input';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-icons/iron-icons';

class MoeFormPollTitleInput extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    @apply --layout-horizontal;
    @apply --layout-end;
}
:host([hidden]) {
    display: none;
}
paper-input {
    @apply --layout-auto;
    width: 100%;
}
</style>
<paper-icon-button icon="cancel" disabled$="[[disabled]]" on-click="_onCancelClick"></paper-icon-button>
<paper-input id="input" label="投票主題" value="{{value}}" disabled$="[[disabled]]" autofocus required></paper-input>
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
            }
        };
    }

    reset() {
        this.value = "";
    }

    focus() {
        this.$.input.focus();
    }

    cancel() {
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    _onCancelClick(e) {
        this.cancel();
    }
}

window.customElements.define('moe-form-poll-title-input', MoeFormPollTitleInput);