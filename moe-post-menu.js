import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import '@polymer/paper-button';
import '@polymer/paper-icon-button/paper-icon-button-light';
import '@polymer/paper-styles/paper-styles';

class MoePostMenuActionButton extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: inline-block;
    position: relative;
    padding: 8px;
    outline: none;
}
.dropdown-content {
    @apply --shadow-elevation-2dp;
    
    position: absolute;
    right: 0.5em;
    top: 0.5em;
    border-radius: 2px;
    background-color: var(--paper-menu-button-dropdown-background, var(--primary-background-color));
    z-index: 999;
}
</style>
<paper-icon-button-light icon="more-vert" slot="dropdown-trigger" alt="more-vert" on-click="_onMoreClick">
    <button title="more-vert"><iron-icon icon="more-vert"></iron-icon></button>
</paper-icon-button-light>
<template is="dom-if" if="[[displayItem]]">
    <div id="menu" class="dropdown-content">
        <template is="dom-repeat" items="[[items]]">
            <moe-post-menu-action-item board-id="[[boardId]]" no="[[no]]" action="[[item.action]]" text="[[item.text]]"></moe-post-menu-action-item>
        </template>
    </div>
</template>
`;
    }

    static get properties() {
        return {
            displayItem: {
                type: Boolean,
                value: false
            },
            items: {
                type: Array,
                computed: '_computeItems(isAdmin, isFirstPost)'
            },
            isAdmin: {
                type: Boolean,
                value: false
            },
            isFirstPost: {
                type: Boolean,
                value: false
            },
            boardId: {
                type: Number,
            },
            no: {
                type: Number,
            },
        };
    }

    ready() {
        super.ready();
        this.addEventListener('blur', () => {
            this.displayItem = false;
        });
    }

    _computeItems(isAdmin, isFirstPost) {
        const items = [
            {text: '回應', action: 'reply', icon: 'reply'},
            {text: '舉報', action: 'report', icon: 'report'},
            {text: '刪除', action: 'delete', icon: 'delete'},
        ];

        if (isAdmin && isFirstPost) {
            items.push({text: '禁止回應', action: 'stopThread', icon: 'moe:thread-stop'});
            items.push({text: '強制sage', action: 'forceSage', icon: 'moe:thread-sage'});
            items.push({text: '置頂', action: 'pinThread', icon: 'moe:thread-pin'});
        }

        return items;
    }

    _onMoreClick(e) {
        this.displayItem = !this.displayItem;
    }

    _onItemClick(e) {
        console.log(e.currentTarget);
    }
}

class MoePostMenuActionItem extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    @apply --layout-horizontal;
    @apply --layout-center;
    @apply --paper-font-subhead;
}
paper-button {
    margin: 0;
    border-radius: 0;
}
paper-button:hover {
    cursor: pointer;
    background-color: var(--paper-grey-300);
}
</style>
<paper-button on-click="_onClick">
    [[text]]
</paper-button>
`;
    }

    static get properties() {
        return {
            boardId: {
                type: Number
            },
            no: {
                type: Number
            },
            action: {
                type: String
            },
            text: {
                type: String
            }
        };
    }

    _onClick(e) {
        this.blur();
    }
}

window.customElements.define('moe-post-menu-action-button', MoePostMenuActionButton);
window.customElements.define('moe-post-menu-action-item', MoePostMenuActionItem);