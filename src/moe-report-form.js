import { html, PolymerElement } from '@polymer/polymer/polymer-element.js'
import { MutableData } from '@polymer/polymer/lib/mixins/mutable-data'
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js'
import { AppLocalizeBehavior } from '@polymer/app-localize-behavior/app-localize-behavior.js'
import '@polymer/paper-radio-group/paper-radio-group'
import '@polymer/paper-radio-button/paper-radio-button'
import '@polymer/paper-input/paper-textarea'
import '@polymer/iron-flex-layout/iron-flex-layout'
import '@polymer/iron-icons/iron-icons'

import { ReduxMixin } from './redux/redux-mixin'
import locales from './locales/moe-report-form'

export class MoeReportForm extends mixinBehaviors([AppLocalizeBehavior], MutableData(ReduxMixin(PolymerElement))) {

  static get template () {
    return html`
<style>
:host {
    display: block;
}
paper-radio-group {
    @apply --layout-vertical;
    --paper-radio-group-item-padding: 16px;
}
paper-textarea {
    margin: 0 16px 16px 16px;
}
</style>
<paper-radio-group selected="{{selectedCategoryId}}">
    <template is="dom-repeat" items="[[categories]]" as="item">
        <paper-radio-button name="[[item.id]]" disabled$="[[disabled]]">[[localize(item.name)]]</paper-radio-button>
    </template>
</paper-radio-group>
<template is="dom-if" if="[[reportContentMaxLength]]">
    <paper-textarea label="[[localize('content')]]" maxlength="[[reportContentMaxLength]]" char-counter rows="1" max-rows="3" value="{{content}}" disabled$="[[disabled]]"></paper-textarea>
</template>
`
  }

  static get properties () {
    return {
      disabled: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      loading: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_observeLoading'
      },

      boardId: Number,
      no: Number,

      categories: {
        type: Array,
        statePath: function (state) {
          const categories = []
          for (let id in state.reportCategories) {
            categories.push(state.reportCategories[id])
          }
          categories.sort((a, b) => a.order === b.order ? 0 : a.order > b.order ? 1 : -1)
          return categories
        },
        value: []
      },
      selectedCategoryId: {
        type: Number,
        notify: true,
        reflectToAttribute: true,
        value: 0
      },

      content: {
        type: String,
        notify: true,
        value: ''
      },
      reportContentMaxLength: {
        type: Number,
        statePath: 'validationCriteria.reportContentMaxLength'
      },

      language: {
        type: String,
        statePath: 'language'
      }
    }
  }

  ready () {
    super.ready()
    this.resources = locales
  }

  validate () {
    if (!this.selectedCategoryId) {
      return Error(this.localize('errorUnselected'))
    }

    if (!this.boardId) {
      return Error('Unexpected error: boardId is not set')
    }

    if (!this.no) {
      return Error('Unexpected error: no is not set')
    }

    return null
  }

  getFormData () {
    return {
      boardId: this.boardId,
      no: this.no,
      categoryId: this.selectedCategoryId,
      content: this.content
    }
  }

  reset () {
    this.setProperties({
      content: '',
      selectedCategoryId: 0
    })
  }

  /** Loading State */
  _observeLoading (newValue, oldValue) {
    if (newValue && !oldValue) {
      this.dispatchEvent(new CustomEvent('loading-start', {
        bubbles: true,
        composed: true
      }))
    } else if (!newValue && oldValue) {
      this.dispatchEvent(new CustomEvent('loading-end', {
        bubbles: true,
        composed: true
      }))
    }
  }
}

window.customElements.define('moe-report-form', MoeReportForm)
