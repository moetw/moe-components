import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import '@polymer/paper-ripple';
import '@polymer/paper-menu-button';
import '@polymer/paper-icon-button';
import '@polymer/paper-listbox';
import '@polymer/paper-item';

class MoePostMenuActionButton extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
}
paper-listbox {
    min-width: 5em;
    z-index: 100;
}
</style>
<paper-menu-button class="post-action-button" horizontal-align="right">
    <paper-icon-button icon="more-vert" slot="dropdown-trigger" alt="more-vert" ></paper-icon-button>
    <paper-listbox slot="dropdown-content">
        <template is="dom-repeat" items="{{items}}">
            <moe-post-menu-action-item board-id="[[boardId]]" no="[[no]]" action="[[item.action]]" text="[[item.text]]"></moe-post-menu-action-item>
        </template>
    </paper-listbox>
</paper-menu-button>
`;
    }

    static get properties() {
        return {
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

    _onItemClick(e) {
        console.log(e.currentTarget);
    }
}

class MoePostMenuActionItem extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
}
paper-item:hover {
    cursor: pointer;
    background-color: var(--paper-grey-300);
}
</style>
<paper-item on-click="_onClick">
    [[text]]
    <paper-ripple></paper-ripple>
</paper-item>
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
        this.dispatchEvent(new CustomEvent('postActionMenuItemClick', {
            composed: true,
            bubbles: true,
            detail: {
                board_id: this.boardId,
                no: this.no,
                action: this.action
            }
        }));
    }
}

window.customElements.define('moe-post-menu-action-button', MoePostMenuActionButton);
window.customElements.define('moe-post-menu-action-item', MoePostMenuActionItem);