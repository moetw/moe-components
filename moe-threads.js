import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import {MutableData} from '@polymer/polymer/lib/mixins/mutable-data';
import '@polymer/paper-spinner/paper-spinner-lite'
import '@polymer/paper-styles/paper-styles';
import '@polymer/paper-button/paper-button';
import '@polymer/iron-icons/image-icons';
import './moe-styles.js';
import './moe-thread.js';
import {MoeGraphQL} from './moe-graphql';
import {ReduxMixin} from './redux/redux-mixin';
import * as actions from './redux/redux-actions';
import * as selectors from './redux/redux-selectors';

class MoeThreads extends MutableData(ReduxMixin(PolymerElement)) {
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
    display: block;    
    --paper-spinner-color: var(--futaba-red-color);
    background: white;
    border-radius: 50%;
    padding: 5px;
    @apply --shadow-elevation-6dp;
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
<template is="dom-repeat" mutable-data items="[[threads]]" as="thread" sort="_sortByBump">
    <moe-thread 
        is-admin="[[isAdmin]]"
        board-id="[[boardId]]" board-alias="[[boardAlias]]" board-subdomain="[[boardSubdomain]]"
        no="[[thread.no]]" 
        reply-count="[[thread.replyCount]]" 
        flag-admin-sticky="[[thread.flagAdminSticky]]"
        flag-admin-thread-stop="[[thread.flagAdminThreadStop]]"
        flag-admin-sage="[[thread.flagAdminSage]]"
        graphql-server="[[graphqlServer]]"
        poll-server="[[pollServer]]"
        image-servers="[[imageServers]]"
        initial-reply-count="[[repliesPerThread]]">
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

<!-- GraphQL -->
<moe-graphql id="moeGraphQL" server="[[graphqlServer]]"></moe-graphql>

<!-- Route -->
<app-route pattern="/" route="{{route}}" data="{{routeData}}" active="{{active}}"></app-route>
<app-route pattern="/:page" route="{{route}}" data="{{routeData}}" active="{{active}}"></app-route>
`;
    }

    static get properties() {
        return {
            boardId: Number,
            boardAlias: String,
            boardSubdomain: String,

            route: {
                type: Object,
                notify: true
            },
            routeData: {
                type: Object,
                notify: true
            },
            graphqlServer: String,
            pollServer: String,
            imageServers: Object,
            isAdmin: {
                type: Boolean,
                value: false,
                reflectToAttribute: true,
                notify: true
            },
            threads: {
                type: Array,
                statePath: function (state) {
                  return selectors.threadsSelector(state);
                }
            },
            page: {
                type: Number,
                reflectToAttribute: true,
                observer: '_observePage'
            },
            threadsPerPage: Number,
            repliesPerThread: Number,
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

    ready() {
        super.ready();

        this.addEventListener('reply-ack', (e) => {
            this.$.moeGraphQL.getReplyAck(e.detail.boardId, e.detail.threadNo, e.detail.no)
                .then(resp => {
                    this.dispatch({
                        type: actions.UPDATE_THREAD,
                        thread: resp.data.getThreadByNo
                    });
                    this.dispatch({
                        type: actions.APPEND_REPLY_TO_THREAD,
                        reply: this._postTransformer(resp.data.getPostByNo)
                    });
                })
                .catch(err => console.error(err));
        });

        this.addEventListener('create-thread-ack', (e) => {
            this.goHome();
        });
    }

    load() {
        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'instant'
        });

        this.set('loading', true);
        return this.$.moeGraphQL
            .getThreads(this.boardId, this.page * this.threadsPerPage, this.threadsPerPage, 0, this.repliesPerThread)
            .then(resp => {
                this.dispatch({
                    type: actions.UPDATE_THREADS,
                    threads: resp.data.getThreads.map(t => this._threadTransformer(t))
                });
            })
            .catch(err => console.log(err)) // TODO: error reporting
            .finally(() => this.set('loading', false));
    }

    _threadTransformer(thread) {
        return Object.assign({}, thread, {
            firstPost: this._postTransformer(thread.firstPost),
            replies: (thread.replies || []).reverse().map(reply => this._postTransformer(reply))
        });
    }

    _postTransformer(post) {
        return MoeGraphQL.postTransformer(this.boardSubdomain, this.boardAlias, this.imageServers, post);
    }

    reload() {
        this.set('threads', []);
        return this.load();
    }

    goHome() {
        this.set('routeData.page', 0);
        return this.reload();
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

    _observePage(newValue) {
        this.set('threads', []);
        this.load();
        this.dispatchEvent(new CustomEvent('page-change', {
            detail: {
                page: newValue
            }
        }));
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

    _sortByBump(a, b) {
        a = a.firstPost;
        b = b.firstPost;

        if (!a.bumpedAt && !b.bumpedAt) {
            return 0;
        }

        if (!a.bumpedAt && b.bumpedAt) {
            return -1;
        }

        if (a.bumpedAt && !b.bumpedAt) {
            return 1;
        }

        const aDate = new Date(a.bumpedAt), bDate = new Date(b.bumpedAt);
        return aDate === bDate ? 0 : aDate < bDate ? 1 : 0;
    }
}

window.customElements.define('moe-threads', MoeThreads);
