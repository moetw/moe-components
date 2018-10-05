import {html, PolymerElement} from '@polymer/polymer/polymer-element';

import {ReduxMixin} from './redux/redux-mixin';
import './moe-board';
import * as actions from './redux/redux-actions';

class MoeBoardLoader extends ReduxMixin(PolymerElement) {

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

        // board
        board.boardId = this.boardId;
        board.boardName = resp.data.getBoardById.name;
        board.boardDescription = resp.data.getBoardById.description;
        board.boardAlias = resp.data.getBoardById.alias;
        board.boardSubdomain = resp.data.getBoardById.subdomain;
        board.boardExternalLinks = [
          {title: '外部連結1', links: resp.data.getBoardById.config.topLinks},
          {title: '外部連結2', links: resp.data.getBoardById.config.descriptionLinks}
        ];
        board.graphqlServer = this.graphqlServer;
        board.embedRequestServer = resp.data.getBoardById.embedRequestServer;
        board.postServer = resp.data.getBoardById.postServer;
        board.pollServer = resp.data.getBoardById.pollServer;
        board.reportServer = resp.data.getBoardById.reportServer;

        // validation criteria
        this.dispatch({
          type: actions.UPDATE_VALIDATION_CRITERIA,
          validationCriteria: resp.data.getValidationCriteria
        });

        // report categories
        this.dispatch({
          type: actions.UPDATE_REPORT_CATEGORIES,
          reportCategories: resp.data.getReportCategories
        });

        this.$.boardContainer.innerHTML = '';
        this.$.boardContainer.appendChild(board);
      })
      .catch(err => console.error(err))
      .finally(() => this.set('loading', false));
  }

  _observeBoardId() {
    if (this.boardId) {
      this.load();
    }
  }
}

window.customElements.define('moe-board-loader', MoeBoardLoader);
