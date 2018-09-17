import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';

import FetchQL from 'fetchql'

export class MoeGraphQL extends PolymerElement {
    static get template() {
        return html``
    }

    static get properties() {
        return {
            server: {
                type: String,
                observer: '_observeServer'
            },
            fetchQL: {
                type: Object
            }
        };
    }

    static postTransformer(boardSubdomain, boardAlias, imageServers, post) {
        return Object.assign({}, post, {
            images: post.images.map(image => MoeGraphQL.imageTransformer(boardSubdomain, boardAlias, imageServers, image))
        });
    }

    static imageTransformer(boardSubdomain, boardAlias, imageServers, image) {
        const imageResolver = (sv) => (typeof imageServers[sv] === 'function' ? imageServers[sv] : (f) => f);
        return Object.assign({}, image, {
            imageSrc: imageResolver(image.imageServer)(image.imageSrc, boardSubdomain, boardAlias),
            thumbSrc: imageResolver(image.thumbServer)(image.thumbSrc, boardSubdomain, boardAlias),
        });
    }

    getBoardById(boardId) {
        return this.fetchQL.query({
            operationName: '',
            query: `{
    getBoardById(boardId: ${boardId}) {
        id
        alias
        name
        description
        user {
            id
            subdomain
        }
    }
}`
        });
    }

    getThreads(boardId, threadsOffset, threadsLimit, repliesOffset, repliesLimit) {
        return this.fetchQL.query({
            operationName: '',
            query: `{
  getThreads(boardId:${boardId}, offset:${threadsOffset},limit:${threadsLimit}) {
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

${this.FRAGMENT_POST_FIELDS}`
        });
    }

    getMoreReplies(boardId, no, before, limit) {
        return this.fetchQL.query({
            operationName: '',
            query: `{
    getMoreReplies(boardId:${boardId},no:${no},before:${before},limit:${limit}) { ...PostFields }
}
${this.FRAGMENT_POST_FIELDS}`
        });
    }

    get FRAGMENT_POST_FIELDS() {
        return `fragment PostFields on Post {
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

    _observeServer(newValue) {
        this.fetchQL = new FetchQL({
            url: newValue
        });
    }
}

window.customElements.define('moe-graphql', MoeGraphQL);