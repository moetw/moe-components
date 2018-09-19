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
paper-input {
    @apply --layout-flex-auto;
}
paper-icon-button {
    @apply --layout-self-end;    
}
</style>
<paper-icon-button icon="cancel" on-click="cancel"></paper-icon-button>
<paper-input id="input" label="影片網址 (Youtube)" disabled$="[[disabled]]" on-keypress="_onVideoEmbedInputKeypress" pattern="^https?://.+$" error-message="必須為HTTP網址" auto-validate></paper-input>
<paper-icon-button icon="send" on-click="submit"></paper-icon-button>
`;
    }

    static get properties() {
        return {
            hidden: {
                type: Boolean,
                value: false
            },
            disabled: {
                type: Boolean,
                value: false
            }
        };
    }

    static get observers() {
        return [
            '_observeHidden(hidden)'
        ];
    }

    reset() {
        this.$.input.value = "";
    }

    cancel() {
        this.reset();
        this.dispatchEvent(new CustomEvent('cancel'));
    }

    submit() {
        if (!this.valid()) {
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

    _observeHidden(hidden) {
        if (hidden) {
            this.style.display = 'none';
        } else {
            this.style.display = 'flex';
            this.focus();
        }
    }
}

window.customElements.define('moe-form-video-embed-input', MoeFormVideoEmbedInput);