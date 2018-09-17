import {html, PolymerElement} from '@polymer/polymer/polymer-element';
import './moe-board';

class MoeBoardLoader extends PolymerElement {

    static get template() {
        return html`
<style>
:host {
    display: block;
}
</style>
<moe-graphql id="moeGraphQL" server="[[graphqlServer]]"></moe-graphql>
<div id="boardContainer"></div>
`;
    }

    static get properties() {
        return {
            loading: {
                type: Boolean,
                value: false
            },
            boardId: {
                type: Number,
                observer: '_observeBoardId'
            },
            graphqlServer: {
                type: String
            }
        };
    }

    load() {
        this.set('loading', true);
        this.$.moeGraphQL
            .getBoardById(this.boardId)
            .then(resp => {
                const board = document.createElement('moe-board');
                board.boardId = this.boardId;
                board.boardName = resp.data.getBoardById.name;
                board.boardDescription = resp.data.getBoardById.description;
                board.boardAlias = resp.data.getBoardById.alias;
                board.boardSubdomain = resp.data.getBoardById.user.subdomain;
                board.graphqlServer = this.graphqlServer;
                this.$.boardContainer.innerHTML = '';
                this.$.boardContainer.appendChild(board);
            })
            .catch(err => console.error(err))
            .finally(() => this.set('loading', false));
    }

    _observeBoardId() {
        this.load();
    }
}

window.customElements.define('moe-board-loader', MoeBoardLoader);