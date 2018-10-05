import { html, PolymerElement } from '@polymer/polymer/polymer-element'

import isArray from 'lodash-es/isArrayLike'
import isObject from 'lodash-es/isObject'

class MoePollRequest extends PolymerElement {
  static get template () {
    return html`<style>:host{display:none;}</style>
`
  }

  static get properties () {
    return {
      server: {
        type: String
      },
    }
  }

  static errorMessage (code) {
    switch (code) {
      case 'VOTED':
        return '你已經投過了'
      case 'NOT_FOUND':
        return '投票已被刪除'
      default:
        return code
    }
  }

  /**
   * @param {Number} no
   * @param {String} item
   * @returns {Promise<Object | Error>}
   */
  vote (no, item) {
    return fetch(this.server, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Requested-With': 'moe-poll-request'
      },
      body: JSON.stringify({poll_no: no, poll_item: item})
    })
      .then(resp => resp.json())
      .then(resp => {
        if (resp.error) {
          return Promise.reject(new Error(MoePollRequest.errorMessage(resp.error)))
        }

        if (!resp.items || !isObject(resp.items) || !isArray(resp.items.k) || !isArray(resp.items.v)) {
          return Promise.reject(new Error('Invalid response'))
        }

        const items = []
        for (let index in resp.items.k) {
          items.push({
            text: resp.items.k[index],
            votes: parseInt(resp.items.v[index])
          })
        }
        return Promise.resolve(items)
      })
  }
}

window.customElements.define('moe-poll-request', MoePollRequest)
