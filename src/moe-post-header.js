import {html, PolymerElement} from "@polymer/polymer/polymer-element";
import '@polymer/paper-tooltip/paper-tooltip';

import moment from "./moment";

class MoePostHeader extends PolymerElement {
  static get template() {
    return html`
<style>
:host {
    display: block;
}
.post-header {
    @apply --layout-horizontal;
    @apply --layout-end-justified;
    margin-top: 1em;
}
.post-header-no {
    @apply --layout-flex-auto;
    color: var(--moe-post-header-no-text-color);
}
.post-header-no-chip {
    position: relative;
    display: inline-block;
    padding-left: 0.5em;
    padding-right: 0.5em;
    border-radius: 1em;
    background-color: var(--moe-post-header-no-background-color);
}
.post-header-no-chip:hover {
    cursor: pointer;
    background-color: var(--moe-post-header-no-hover-background-color);
}
.post-header-id, #post-header-date {
    flex: 0 1 auto;
    flex-basis: auto;
    text-align: right;
    padding-left: 1em;
}
.post-header-no {
}
.post-header-id {
    color: var(--moe-post-header-id-text-color);
}
#post-header-date {
    color: var(--moe-post-header-date-text-color);
}

paper-tooltip {
    --paper-tooltip-delay-out: 0s;
    --paper-tooltip-delay-in: 0s;
    --paper-tooltip-duration-out: 0s;
    --paper-tooltip-duration-in: 0s;
    white-space: nowrap;
}
</style>
<div class="post-header">
    <div class="post-header-no" on-click="_onPostHeaderNoClick">
        <div class="post-header-no-chip">No.[[no]]<paper-ripple></paper-ripple></div>
    </div>
    <div class="post-header-id">ID:[[tripId]]</div>
    <div id="post-header-date">[[formatCreatedAt(createdAt)]]</div>
    <paper-tooltip for="post-header-date" offset="0">[[fullyFormatCreatedAt(createdAt)]]</paper-tooltip>
</div>
`;
  }

  static get properties() {
    return {
      boardId: {
        type: Number
      },
      threadNo: {
        type: Number
      },
      no: {
        type: Number
      },
      tripId: {
        type: String
      },
      createdAt: {
        type: String
      },
      flagAdminThreadStop: {
        type: Boolean,
        value: false
      }
    };
  }

  formatCreatedAt(created_at) {
    return moment(created_at).calendar();
  }

  fullyFormatCreatedAt(created_at) {
    return moment(created_at).toString();
  }

  _onPostHeaderNoClick(e) {
    if (this.flagAdminThreadStop) {
      return false;
    }

    this.dispatchEvent(new CustomEvent('post-header-no-click', {
      composed: true,
      bubbles: true,
      detail: {
        boardId: this.get('boardId'),
        threadNo: this.get('threadNo'),
        no: this.get('no')
      }
    }));
  }
}

window.customElements.define('moe-post-header', MoePostHeader);
