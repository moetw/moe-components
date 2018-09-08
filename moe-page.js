import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-spinner/paper-spinner-lite'
import '@polymer/paper-styles/paper-styles';
import FetchQL from 'fetchql'
import './moe-styles.js';
import './moe-thread.js';

class MoePage extends PolymerElement {
    static get template() {
        return html`
<style>
:host {
    display: block;
}
moe-thread {
    margin-top: 2em;
    width: 100%;
}
.loading {
   	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	align-content: center;
}
.loading .loading-text {
    margin-left: 0.5em;
}
</style>
<template is="dom-if" if="[[loading]]">
    <div class="loading">
        <paper-spinner-lite active></paper-spinner-lite>
        <div class="loading-text">Loading...</div>
    </div>
</template>
<template is="dom-repeat" items="[[threads]]" as="thread">
    <moe-thread 
        is-admin="[[isAdmin]]" 
        no="[[thread.no]]" 
        reply-count="[[thread.reply_count]]" 
        flag-admin-sticky="[[thread.flag_admin_sticky]]"
        flag-admin-thread-stop="[[thread.flag_admin_thread_stop]]"
        flag-admin-sage="[[thread.flag_admin_sage]]"
        firstpost="[[thread.first_post]]"
        replies="[[thread.replies]]">
    </moe-thread>
</template>
`;
    }

    static get properties() {
        return {
            graphqlServer: {
                type: String,
            },
            isAdmin: {
                type: Boolean,
                value: false,
                reflectToAttribute: true,
                notify: true
            },
            threads: {
                type: Array,
                value: [],
                reflectToAttribute: true
            },
            boardId: {
                type: Number
            },
            page: {
                type: Number
            },
            threadsPerPage: {
                type: Number
            },
            repliesPerThread: {
                type: Number
            },
            loading: {
                type: Boolean,
                value: true
            }
        };
    }

    ready() {
        super.ready();
        const query = this._queryThreads(this.boardId, this.page * this.threadsPerPage, this.threadsPerPage, 0, this.repliesPerThread);
        const fetchQL = new FetchQL({
            url: this.graphqlServer
        });
        this.set('loading', true);
        fetchQL
            .query({
                operationName: '',
                query
            })
            .then(resp => {
                this.set('threads', resp.data.page.threads.map(t => Object.assign({}, t, {
                    replies: (t.replies || []).reverse()
                })));
            })
            .catch(err => console.log(err))
            .finally(() => this.set('loading', false));
    }

    _queryThreads(board_id, threadsOffset, threadsLimit, repliesOffset, repliesLimit) {
        return `{
  page(board_id:${board_id}) {
    board_id
    threads(offset:${threadsOffset},limit:${threadsLimit}) {
      board_id
      no
      reply_count
      flag_admin_sticky
      flag_admin_thread_stop
      flag_admin_sage
      first_post {
        ...PostFields
      }
      replies(offset:${repliesOffset},limit:${repliesLimit}) {
        ...PostFields
      }
    }
  }
}

fragment PostFields on Post {
  id
  board_id
  resto
  no
  sub
  trip_id
  name
  email
  com
  root
  embeds {
    data
  }
  images {
    image_src
    image_height
    image_width
    thumb_src
    thumb_height
    thumb_width
  }
  poll {
    subject
    items {
      text
      votes
    }
    voted
  }
  rate {
    like
    dislike
    rated
  }
  created_at
}`;
    }
}

window.customElements.define('moe-page', MoePage);