import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import '@polymer/paper-styles/shadow';
import '@polymer/iron-icon/iron-icon';
import '@polymer/iron-flex-layout/iron-flex-layout';

import './moe-icons';

class MoeFormDialog extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    margin: 0;
    padding: 0;
    z-index: 5;
}
:host([hidden]) {
    display: none;
}
#container {
    @apply --shadow-elevation-24dp;
    display: block;
    position: relative;
    padding: 16px;
    background: white;
}
.handle {
    @apply --layout-horizontal;
    @apply --layout-center;
    cursor: move;
    user-select: none;
}
</style>
<div id="container">
    <h2 class="handle"><iron-icon icon="moe:handle"></iron-icon>[[title]]</h2>
    <slot id="form"></slot>
</div>
`;
    }

    static get properties() {
        return {
            title: {
                type: String,
                value: 'Dialog'
            },
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
            width: Number,
            height: Number
        };
    }

    static get observedAttributes() {
        return ['hidden'];
    }

    ready() {
        super.ready();
        this.shadowRoot.querySelectorAll('.handle').forEach(handle => handle.addEventListener('mousedown', this._onHandleMouseDown.bind(this)));
        this.addEventListener('dragstart', this._onDragStart.bind(this));
        this.addEventListener('drag', this._onDrag.bind(this));
        this.addEventListener('dragend', this._onDragEnd.bind(this));
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'hidden' && oldValue !== null && newValue === null) {
            this.centralizeDialog();
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
        e.dataTransfer.setDragImage(document.createElement('img'),0,0);
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
}

window.customElements.define('moe-form-dialog', MoeFormDialog);