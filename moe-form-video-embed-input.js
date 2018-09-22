import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/iron-icons/iron-icons';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-input/paper-input';

class MoeFormVideoEmbedInput extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    @apply --layout-horizontal;
    @apply --layout-center;
}
:host([hidden]) {
    display: none;
}
paper-input {
    @apply --layout-flex-auto;
}
paper-icon-button {
    @apply --layout-self-end;    
}
</style>
<paper-icon-button icon="cancel" on-click="cancel" disabled$="[[disabled]]"></paper-icon-button>
<paper-input id="input" label="影片網址 (Youtube)" disabled$="[[disabled]]" on-keypress="_onVideoEmbedInputKeypress" pattern="^https?://.+$" error-message="必須為HTTP網址" auto-validate></paper-input>
<paper-icon-button icon="add" on-click="submit" disabled$="[[disabled]]"></paper-icon-button>
`;
    }

    static get properties() {
        return {
            disabled: {
                type: Boolean,
                value: false,
                reflectToAttribute: true
            }
        };
    }

    reset() {
        this.$.input.value = "";
    }

    cancel() {
        this.reset();
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    submit() {
        if (!this.valid() || this.disabled) {
            return false;
        }

        this.dispatchEvent(new CustomEvent('submit', {
            detail: {
                value: this.$.input.value
            }
        }))
    }

    focus() {
        this.$.input.focus();
    }

    valid() {
        return !this.$.input.invalid && this.$.input.value;
    }

    _onVideoEmbedInputKeypress(e) {
        if (e.code === 'Enter') {
            this.submit();
        }
    }
}

window.customElements.define('moe-form-video-embed-input', MoeFormVideoEmbedInput);