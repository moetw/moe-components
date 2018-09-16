import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-spinner/paper-spinner-lite'
import '@polymer/paper-styles/paper-styles';
import '@polymer/paper-button/paper-button';
import '@polymer/iron-icons/image-icons';
import FetchQL from 'fetchql'
import './moe-styles.js';
import './moe-thread.js';

class MoeThreads extends PolymerElement {
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

#paginator {
    @apply --layout-horizontal;
    align-content: stretch;
    margin-top: 36px;
    color: var(--futaba-red-color)
}

#paginator > * {
    flex: 1 1 auto;
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
        reply-count="[[thread.replyCount]]" 
        flag-admin-sticky="[[thread.flagAdminSticky]]"
        flag-admin-thread-stop="[[thread.flagAdminThreadStop]]"
        flag-admin-sage="[[thread.flagAdminSage]]"
        firstpost="[[thread.firstPost]]"
        replies="[[thread.replies]]">
    </moe-thread>
</template>
<div id="paginator">
    <template is="dom-if" if="[[hasPrevPage]]">
        <paper-button rel="prev" id="prevPageButton" on-click="loadPrevPage" disabled$="[[loading]]"><iron-icon icon="image:navigate-before"></iron-icon>上一頁</paper-button>
    </template>
    <template is="dom-if" if="[[hasNextPage]]">
        <paper-button rel="next" id="nextPageButton" on-click="loadNextPage" disabled$="[[loading]]">下一頁<iron-icon icon="image:navigate-next"></iron-icon></paper-button>
    </template>
</div>

<!-- Route -->
<app-route pattern="/" route="{{route}}" data="{{routeData}}" active="{{active}}"></app-route>
<app-route pattern="/:page" route="{{route}}" data="{{routeData}}" active="{{active}}"></app-route>
`;
    }

    static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            routeData: {
                type: Object,
                notify: true
            },
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
                type: Number,
                reflectToAttribute: true,
                observer: '_observePage'
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
            },
            hasPrevPage: {
                type: Boolean,
                computed: '_computeHasPrevPage(page)'
            },
            hasNextPage: {
                type: Boolean,
                computed: '_computeHasNextPage(threads)'
            }
        };
    }

    static get observers() {
        return [
            '_observeRoutePage(route.path)'
        ];
    }

    load() {
        var board;

        window.scrollTo(0, 0);

        const postTransformer = (p) => Object.assign({}, p, {
            images: p.images.map(imageTransformer)
        });

        const imageTransformer = (image) => {
            const imageResolver = (sv) => (typeof this.imageServers[sv] === 'function' ? this.imageServers[sv] : (f) => f);
            return Object.assign({}, image, {
                imageSrc: imageResolver(image.imageServer)(image.imageSrc, board.user.subdomain, board.alias),
                thumbSrc: imageResolver(image.thumbServer)(image.thumbSrc, board.user.subdomain, board.alias),
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
                    firstPost: postTransformer(t.firstPost),
                    replies: (t.replies || []).reverse().map(postTransformer)
                })));
            })
            .catch(err => console.log(err)) // TODO: error reporting
            .finally(() => this.set('loading', false));
    }

    reload() {
        this.set('threads', []);
        this.load();
    }

    loadPrevPage() {
        if (this.hasPrevPage) {
            this.set('routeData.page', this.page - 1);
        }
    }

    loadNextPage() {
        if (this.hasNextPage) {
            this.set('routeData.page', this.page + 1);
        }
    }

    _computeHasPrevPage(page) {
        return page > 0;
    }

    _computeHasNextPage(threads) {
        return threads.length > 0;
    }

    _observePage() {
        this.set('threads', []);
        this.load();
    }

    _observeRoutePage() {
        console.log('moe-threads: _observeRoutePage', this.route, this.routeData);

        const page = parseInt(this.routeData.page);
        if (typeof page === 'number' && page >= 0) {
            this.set('page', page);
        } else {
            this.set('route.path', '/0');
        }
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
  page(boardId:${board_id}) {
    boardId
    threads(offset:${threadsOffset},limit:${threadsLimit}) {
      boardId
      no
      replyCount
      flagAdminSticky
      flagAdminThreadStop
      flagAdminSage
      firstPost {
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
  boardId
  resto
  no
  sub
  tripId
  name
  email
  com
  root
  embeds {
    data
  }
  images {
    imageServer
    imageSrc
    imageHeight
    imageWidth
    thumbServer
    thumbSrc
    thumbHeight
    thumbWidth
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
  createdAt
}`;
    }
}

window.customElements.define('moe-threads', MoeThreads);