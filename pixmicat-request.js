import {html, PolymerElement} from "@polymer/polymer/polymer-element";

class PixmicatRequest extends PolymerElement {
    static get template() {
        return html`<style>:host{display:none;}</style>
`;
    }

    static get properties() {
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
        };
    }

    inFlight() {
        return this.request && this.request.readyState !== 4;
    }

    /**
     *
     * @param {Number} boardId
     * @param {String} comment
     * @param {String} password
     * @param {File} file
     * @param {Poll} poll
     * @param {String[]} videoEmbeds
     * @param {String} subject
     * @param {String} email
     * @param {String} name
     * @returns {Promise}
     */
    makeThread(boardId, comment, password, file, poll=null, videoEmbeds=null, subject='', email='', name='') {
        if (this.inFlight()) {
            return Promise.reject("Request in progress");
        }

        const body = this._makeRegistFormData(boardId, null, comment, password, file, videoEmbeds, subject, email, name);
        return this.$.ajax.generateRequest().send({
            url: this.server,
            body,
            withCredentials: true
        });
    }

    /**
     *
     * @param {Number} boardId
     * @param {Number} threadNo
     * @param {String} comment
     * @param {String} password
     * @param {File} file
     * @param {String[]} videoEmbeds
     * @param {String} subject
     * @param {String} email
     * @param {String} name
     * @returns {Promise}
     */
    makeReply(boardId, threadNo, comment, password, file=null, videoEmbeds=null, subject='', email='', name='') {
        if (this.inFlight()) {
            return Promise.reject("Request in progress");
        }

        const formData = this._makeRegistFormData(boardId, threadNo, comment, password, file, videoEmbeds, subject, email, name);
        return this._sendRequest(formData);
    }

    /**
     *
     * @param {Number} boardId
     * @param {Number} threadNo
     * @param {String} comment
     * @param {String} password
     * @param {File} file
     * @param {String[]} videoEmbeds
     * @param {String} subject
     * @param {String} email
     * @param {String} name
     * @returns {FormData}
     * @private
     */
    _makeRegistFormData(boardId, threadNo, comment, password, file, videoEmbeds, subject, email, name) {
        const body = new FormData();

        // User provided contents
        body.append('bvUFbdrIC', name);
        body.append('ObHGyhdTR', email);
        body.append('SJBgiFbhj', subject);
        body.append('pOBvrtyJK', comment);
        if (file) {
            body.append('upfile', new Blob([file], {type: file.type}));
        }
        if (videoEmbeds && videoEmbeds.length) {
            videoEmbeds.forEach(videoEmbed => {
                body.append('resid[]', `${videoEmbed.data.type}:${videoEmbed.data.res_id}`);
            });
        }

        // Pixmicat options
        body.append('mode', 'regist');
        body.append('noimg', 'on');
        body.append('pwd', password);

        if (threadNo) {
            body.append('resto', `${threadNo}`);
        }

        // Pixmicat specified spam protection
        body.append('email', 'foo@foo.bar');
        body.append('name', 'spammer');
        body.append('sub', 'DO NOT FIX THIS');
        body.append('com', 'EID OG SMAPS');
        body.append('reply', '');

        return body;
    }

    /**
     * @param {FormData} formData
     * @returns {Promise}
     * @private
     */
    _sendRequest(formData) {
        return new Promise((resolve, reject) => {
            this.request = new XMLHttpRequest();
            this.request.addEventListener('progress', e => {
                this.set('progress', {
                    lengthComputable: e.lengthComputable,
                    loaded: e.loaded,
                    total: e.total
                });
            });
            this.request.addEventListener('readystatechange', e => {
                switch (this.request.readyState) {
                    // aborted
                    case 0:
                        reject(new Error('Aborted'));
                        break;

                    // done
                    case 4:
                        if (this.request.status === 200) {
                            resolve(this.request.response);
                        } else {
                            reject(this.request.response);
                        }
                        break;
                }
            });
            this.request.open("POST", this.server);
            this.request.setRequestHeader('x-requested-with', 'pixmicat-request');
            this.request.withCredentials = true;
            this.request.responseType = "json";
            this.request.send(formData);
        });
    }
}

window.customElements.define('pixmicat-request', PixmicatRequest);