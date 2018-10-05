import { html, PolymerElement } from '@polymer/polymer/polymer-element'

import { Poll } from './poll'

class PixmicatRequest extends PolymerElement {
  static get template () {
    return html`<style>:host{display:none;}</style>
`
  }

  static get properties () {
    return {
      server: {
        type: String
      },
      method: {
        type: String
      },
      progress: {
        type: Object,
        notify: true
      },
      request: {
        type: Object,
        value: null
      }
    }
  }

  inFlight () {
    return this.request && this.request.readyState !== 4
  }

  /**
   *
   * @param {Number} boardId
   * @param {String} comment
   * @param {File} file
   * @param {Poll} poll
   * @param {String[]} videoEmbeds
   * @param {String} subject
   * @param {String} email
   * @param {String} name
   * @param {String} password
   * @returns {Promise}
   */
  makeThread (boardId, comment, file = null, poll = null, videoEmbeds = null, subject = '', email = '', name = '', password = '') {
    if (this.inFlight()) {
      return Promise.reject('Request in progress')
    }

    const formData = this._makeRegistFormData(boardId, null, comment, file, videoEmbeds, poll, subject, email, name, password)
    return this._sendRegistRequest(formData)
  }

  /**
   *
   * @param {Number} boardId
   * @param {Number} threadNo
   * @param {String} comment
   * @param {File} file
   * @param {String[]} videoEmbeds
   * @param {String} subject
   * @param {String} email
   * @param {String} name
   * @param {String} password
   * @returns {Promise}
   */
  makeReply (boardId, threadNo, comment, file = null, videoEmbeds = null, subject = '', email = '', name = '', password = '') {
    if (this.inFlight()) {
      return Promise.reject('Request in progress')
    }

    const formData = this._makeRegistFormData(boardId, threadNo, comment, file, videoEmbeds, null, subject, email, name, password)
    return this._sendRegistRequest(formData)
  }

  /**
   *
   * @param {Number} boardId
   * @param {Number} threadNo
   * @param {String} comment
   * @param {File} file
   * @param {String[]} videoEmbeds
   * @param {Poll} poll
   * @param {String} subject
   * @param {String} email
   * @param {String} name
   * @param {String} password
   * @returns {FormData}
   * @private
   */
  _makeRegistFormData (boardId, threadNo, comment, file, videoEmbeds, poll, subject, email, name, password) {
    const body = new FormData()

    // User provided contents
    body.append('bvUFbdrIC', name)
    body.append('ObHGyhdTR', email)
    body.append('SJBgiFbhj', subject)
    body.append('pOBvrtyJK', comment)
    if (file) {
      body.append('upfile', new Blob([file], {type: file.type}))
    }
    if (videoEmbeds && videoEmbeds.length) {
      videoEmbeds.forEach(videoEmbed => {
        body.append('resid[]', `${videoEmbed.data.type}:${videoEmbed.data.res_id}`)
      })
    }
    if (poll && poll.isValid()) {
      body.append('p_title', poll.title)
      poll.items.forEach(item => {
        body.append('p_item[]', item)
      })
    }

    // Pixmicat options
    body.append('mode', 'regist')
    body.append('noimg', 'on')
    body.append('pwd', password)

    if (threadNo) {
      body.append('resto', `${threadNo}`)
    }

    // Pixmicat specified spam protection
    body.append('email', 'foo@foo.bar')
    body.append('name', 'spammer')
    body.append('sub', 'DO NOT FIX THIS')
    body.append('com', 'EID OG SMAPS')
    body.append('reply', '')

    return body
  }

  _sendRegistRequest (formData) {
    return this._sendRequest(this.server + '?mode=regist', formData)
  }

  /**
   * Delete a post
   * @param {Number} boardId
   * @param {Number} no
   * @param {String} password
   * @returns {Promise}
   */
  delete (boardId, no, password = '') {
    const body = new FormData()
    body.append('pwd', password)
    body.append('func', 'delete')
    body.append(`${no}`, 'delete')
    return this._sendRequest(this.server + '?mode=usrdel', body)
  }

  /**
   * @param {String} url
   * @param {FormData} formData
   * @returns {Promise}
   * @private
   */
  _sendRequest (url, formData) {
    return new Promise((resolve, reject) => {
      this.request = new XMLHttpRequest()
      this.request.addEventListener('progress', e => {
        this.set('progress', {
          lengthComputable: e.lengthComputable,
          loaded: e.loaded,
          total: e.total
        })
      })
      this.request.addEventListener('readystatechange', e => {
        switch (this.request.readyState) {
          // aborted
          case 0:
            reject(new Error('Aborted'))
            break

          // done
          case 4:
            if (this.request.status === 200) {
              resolve(this.request.response)
            } else if (this.request.response && this.request.response.error) {
              reject(new Error(this.request.response.error))
            } else if (this.request.statusText) {
              reject(new Error(`${this.request.statusText} (${this.request.status})`))
            } else {
              reject(new Error('Network error'))
            }
            break
        }
      })
      this.request.open('POST', url)
      this.request.setRequestHeader('x-requested-with', 'pixmicat-request')
      this.request.withCredentials = true
      this.request.responseType = 'json'
      this.request.send(formData)
    })
  }
}

window.customElements.define('pixmicat-request', PixmicatRequest)
