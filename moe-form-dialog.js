import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-styles/shadow';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/iron-icons/image-icons';
import '@polymer/paper-progress/paper-progress';
import '@polymer/paper-tooltip/paper-tooltip';
import isError from 'lodash-es/isError';
import './color';

import './moe-icons';

class MoeFormDialog extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    @apply --shadow-elevation-24dp;
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    z-index: 5;
    width: 500px;
}
:host([hidden]) {
    display: none;
}
@media (max-width: 500px) {
    :host {
        width: 100%;
        height: 100%;
        margin: 0;
        top: 0;
        left: 0;
    }
}
#container {
    display: block;
    position: relative;
    padding: 16px;
    background: white;
    max-height: 70vh;
    overflow-y: auto;
    overflow-x: hidden; 
}
.handle {
    @apply --layout-horizontal;
    @apply --layout-center;
    cursor: move;
    user-select: none;
}

app-header {
  background-color: var(--moe-thread-no-background-color);
  color: white;
}

paper-tooltip {
    --paper-tooltip-delay-out: 0s;
    --paper-tooltip-delay-in: 0s;
    --paper-tooltip-duration-out: 0s;
    --paper-tooltip-duration-in: 0s;
    white-space: nowrap;
}

paper-progress {
    width: 100%;
}
paper-progress:not([active]) {
    display: none;
}
</style>
<app-header class="handle">
    <app-toolbar>
        <paper-icon-button id="closeButton" icon="close" on-click="_onCloseClick"></paper-icon-button>
        <paper-tooltip for="closeButton">關閉</paper-tooltip>
        <div main-title>[[dialogTitle]]</div>
        <paper-icon-button id="sendButton" icon="send" on-click="_onSendClick"></paper-icon-button>
        <paper-tooltip for="sendButton">送出</paper-tooltip>
    </app-toolbar>
</app-header>
<paper-progress indeterminate active$="[[loading]]"></paper-progress>
<div id="container">
    <slot id="form"></slot>
</div>
`;
    }

    static get properties() {
        return {
            dialogTitle: String,
            dragging: {
                type: Boolean,
                value: false
            },
            draggingXDelta: {
                type: Number,
                value: 0
            },
            draggingYDelta: {
                type: Number,
                value: 0
            },
            loading: {
                type: Boolean,
                value: false
            },
            width: Number,
            height: Number,
            formElement: Object
        };
    }

    static get observedAttributes() {
        return [
            'hidden',
            'dialog-title'
        ];
    }

    /**
     * @param {Object} node a component that implements getFormData and validate methods
     * @returns {boolean}
     */
    static isForm(node) {
        return typeof node === "object" &&
          typeof node.getFormData === 'function' &&
          typeof node.validate === 'function';
    }

    ready() {
        super.ready();

        // drag-n-drop
        this.shadowRoot.querySelectorAll('.handle').forEach(handle => handle.addEventListener('mousedown', this._onHandleMouseDown.bind(this)));
        this.addEventListener('dragstart', this._onDragStart.bind(this));
        this.addEventListener('drag', this._onDrag.bind(this));
        this.addEventListener('dragend', this._onDragEnd.bind(this));

        // search for moe-form element in the form slot
        for (let node of this.$.form.assignedNodes()) {
            if (MoeFormDialog.isForm(node)) {
                this.formElement = node;
                break;
            }
        }
        if (!this.formElement) {
            console.error("There must be a moe-form/moe-reply-form slotted inside of moe-form-dialog", this);
        } else {
            this.formElement.addEventListener('loading-start', () => {
                this.set('loading', true);
            });
            this.formElement.addEventListener('loading-end', () => {
                this.set('loading', false);
            });
        }
    }

    hide() {
      this.setAttribute('hidden', 'hidden');
    }

    show() {
      this.removeAttribute('hidden');
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'hidden' && oldValue !== null && newValue === null) {
            this.centralizeDialog();
        }

        if (name === 'dialog-title') {
            this.dialogTitle = newValue;
        }
    }

    centralizeDialog() {
        if (window.matchMedia('(max-width: 500px)').matches) {
            this.style.top = this.style.left = "0";
        } else {
            this.style.left = (document.documentElement.clientWidth / 2 - this.offsetWidth / 2) + 'px';
            this.style.top = '16px';
        }
    }

    _onHandleMouseDown(e) {
        this.draggable = true;
    }

    _onDragStart(e) {
        this.draggingXDelta = e.clientX - this.offsetLeft;
        this.draggingYDelta = e.clientY - this.offsetTop;
        e.dataTransfer.setDragImage(document.createElement('img'),0,0); // remove drag image
    }

    _onDrag(e) {
        if (e.clientX > 0 && e.clientX < document.documentElement.clientWidth &&
            e.clientY > 0 && e.clientY < document.documentElement.clientHeight ) {
            this.style.top = Math.min(Math.max(0, e.clientY - this.draggingYDelta), document.documentElement.clientHeight - this.clientHeight) + 'px';
            this.style.left = Math.min(Math.max(0, e.clientX - this.draggingXDelta), document.documentElement.clientWidth - this.clientWidth) + 'px';
        }
    }

    _onDragEnd(e) {
        this.draggable = false;
    }

    _onCloseClick() {
        this.dispatchEvent(new CustomEvent('close'));
    }

    _onSendClick() {
      const error = this.formElement.validate();
      if (isError(error)) {
        this.dispatchEvent(new CustomEvent('error', {
          detail: {error}
        }));
      } else {
        this.dispatchEvent(new CustomEvent('submit', {
          detail: this.formElement.getFormData()
        }));
      }
    }

}

window.customElements.define('moe-form-dialog', MoeFormDialog);
