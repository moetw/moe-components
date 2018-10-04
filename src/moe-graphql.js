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
        subdomain
        alias
        name
        description
        config {
            topLinks {
                link
                text
            }
            descriptionLinks {
                link
                text
            }
        }
        embedRequestServer
        postServer
        pollServer
    }
    getValidationCriteria(boardId: ${boardId}) {
        nameMaxLength
        emailMaxLength
        subjectMaxLength
        commentMaxLength
        fileMaxSize
        videoMaxEmbeds
        pollTitleMaxLength
        pollMinItems
        pollMaxItems
        pollItemMaxLength
        reportContentMaxLength
    }
    getReportCategories {
        id
        name
        order
    }
}`
        });
    }

    getThreads(boardId, threadsOffset, threadsLimit, repliesOffset, repliesLimit) {
        return this.fetchQL.query({
            operationName: '',
            query: `{
  getThreads(boardId:${boardId}, offset:${threadsOffset},limit:${threadsLimit}) {
      ...ThreadFields
      firstPost {
        ...PostFields
      }
      replies(offset:${repliesOffset},limit:${repliesLimit}) {
        ...PostFields
      }
  }
}
${this.FRAGMENT_THREAD_FIELDS}
${this.FRAGMENT_POST_FIELDS}`
        });
    }

    getThreadByNo(boardId, threadNo, repliesOffset, repliesLimit) {
        return this.fetchQL.query({
            operationName: '',
            query: `{
  getThreadByNo(boardId:${boardId}, no:${threadNo}) {
      ...ThreadFields
      firstPost {
        ...PostFields
      }
      replies(offset:${repliesOffset},limit:${repliesLimit}) {
        ...PostFields
      }
  }
}
${this.FRAGMENT_THREAD_FIELDS}
${this.FRAGMENT_POST_FIELDS}`
        });
    }

    getReplyAck(boardId, threadNo, no) {
        return this.fetchQL.query({
            operationName: '',
            query: `{
    getThreadByNo(boardId:${boardId},no:${threadNo}) {
        boardId
        no
        replyCount
    }
    getPostByNo(boardId:${boardId},no:${no}) {
        ...PostFields
    }
}
${this.FRAGMENT_POST_FIELDS}`
        });
    }

    getDeleteReplyAck(boardId, threadNo) {
        return this.fetchQL.query({
            operationName: '',
            query: `{
    getThreadByNo(boardId:${boardId},no:${threadNo}) {
        boardId
        no
        replyCount
    }
}`
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

    get FRAGMENT_THREAD_FIELDS() {
        return `fragment ThreadFields on Thread {
    boardId
    no
    replyCount
    flagAdminSticky
    flagAdminThreadStop
    flagAdminSage
}`
    }

    get FRAGMENT_POST_FIELDS() {
        return `fragment PostFields on Post {
  id
  boardId
  threadNo
  no
  sub
  tripId
  name
  email
  com
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
  bumpedAt
}`;
    }

    _observeServer(newValue) {
        this.fetchQL = new FetchQL({
            url: newValue
        });
    }
}

window.customElements.define('moe-graphql', MoeGraphQL);
