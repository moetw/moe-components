import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import '@polymer/paper-button/paper-button.js'
import './moe-styles.js'

/**
 * `moe-rate`
 *
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class MoeRate extends PolymerElement {
  static get template () {
    return html`
      <style>
        :host {
          display: block;
          --moe-rate-text-color: var(--futaba-red-color);
          --moe-rate-background-color: var(--futaba-pink-color);
        }

        :host(.small) {
            --moe-rate-font-size: small;
        }

        :host(.x-small) {
            --moe-rate-font-size: x-small;
        }

        :host(.xx-small) {
            --moe-rate-font-size: xx-small;
        }

        paper-button {
            color: var(--moe-rate-text-color);
            background-color: var(--moe-rate-background-color);
            border-radius: 25px;
            text-transform: none;
            font-size: var(--moe-rate-font-size, medium);
            padding: 0;
        }

        .rate {
            margin-left: 5px;
        }

        .votes {
            padding: 5px;
            margin-left: 5px;
            border-radius: 25px;
            background: white;
        }
      </style>
      <paper-button on-click="onDislikeClick" disabled=[[disabled]]>
        <span class="rate">( ・_ゝ・)</span>
        <span class="votes">[[dislike]]</span>
      </paper-button>
      <paper-button on-click="onLikeClick" disabled=[[disabled]]>
        <span class="rate">(・∀・)ｂ</span>
        <span class="votes">[[like]]</span>
      </paper-button>
    `
  }

  static get properties () {
    return {
      dislike: {
        type: Number,
        value: 0,
      },
      like: {
        type: Number,
        value: 0,
      },
      disabled: {
        type: Boolean,
        reflectToAttribute: true,
        value: false,
      }
    }
  }

  onLikeClick (e) {
    this.dispatchEvent(new CustomEvent('onLikeClick'))
  }

  onDislikeClick (e) {
    this.dispatchEvent(new CustomEvent('onDislikeClick'))
  }
}

window.customElements.define('moe-rate', MoeRate)
