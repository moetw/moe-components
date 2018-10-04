import {html, PolymerElement} from "@polymer/polymer/polymer-element";

class MoeFormEmbedRequest extends PolymerElement {
  static get template() {
    return html`<style>:host{display:none;}</style>`;
  }

  static get properties() {
    return {
      server: {
        type: String
      }
    }
  }

  static errorMessage(id) {
    switch (id) {
      case 'NOT_SUPPORTED':
        return `Error: 不支援的網址格式 (${id})`;
      default:
        return `Error: ${id}`
    }
  }

  query(url) {
    const urlRecord = new URL(this.server);
    urlRecord.searchParams.set('url', url);
    return fetch(urlRecord.toString(), {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      headers: {
        'X-Requested-With': 'moe-form-embed-request'
      }
    }).then(resp => resp.json()).then(json => {
      if (json.error) {
        return Promise.reject(new Error(MoeFormEmbedRequest.errorMessage(json.error)));
      } else {
        return Promise.resolve(json);
      }
    });
  }
}

window.customElements.define('moe-form-embed-request', MoeFormEmbedRequest);
