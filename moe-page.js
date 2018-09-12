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
    margin-top: 32px;
    width: 100%;
}
.loading {
   	display: flex;
	flex-direction: row;
	flex-wrap: nowrap;
	justify-content: center;
	align-items: center;
	align-content: center;
	margin-top: 32px;
}
.loading .loading-text {
    margin-left: 0.5em;
}
.loading paper-spinner-lite {
    --paper-spinner-color: var(--futaba-red-color);
} 
</style>
<template is="dom-if" if="[[loading]]">
    <div class="loading">
        <paper-spinner-lite active></paper-spinner-lite>
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
            imageServers: {
                type: Object
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
                reflectToAttribute: true,
                notify: true
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
    }

    load() {
        var board;

        const postTransformer = (p) => Object.assign({}, p, {
            images: p.images.map(imageTransformer)
        });

        const imageTransformer = (image) => {
            const imageResolver = (sv) => (typeof this.imageServers[sv] === 'function' ? this.imageServers[sv] : (f) => f);
            return Object.assign({}, image, {
                image_src: imageResolver(image.image_server)(image.image_src, board.user.subdomain, board.alias),
                thumb_src: imageResolver(image.thumb_server)(image.thumb_src, board.user.subdomain, board.alias),
            });
        };

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
                board = resp.data.getBoardById;
                this.set('threads', resp.data.page.threads.map(t => Object.assign({}, t, {
                    first_post: postTransformer(t.first_post),
                    replies: (t.replies || []).reverse().map(postTransformer)
                })));
            })
            .catch(err => console.log(err))
            .finally(() => this.set('loading', false));
    }

    _queryThreads(board_id, threadsOffset, threadsLimit, repliesOffset, repliesLimit) {
        return `{
  getBoardById(id: ${board_id}) {
    id
    alias
    user {
      id
      subdomain
    }
  }
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
    image_server
    image_src
    image_height
    image_width
    thumb_server
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