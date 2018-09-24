import isString from 'lodash/isString';
import isArray from 'lodash/isArrayLike';

export class Poll {

    /**
     * @param {string} title
     * @param {string[]} items
     */
    constructor(title, items) {
        this.title = title;
        this.items = items;
    }

    /**
     * @returns {boolean}
     */
    isValid() {
        return isString(this.title) && this.title.trim().length &&
            isArray(this.items) && this.items.length && this.items.every(item => isString(item) && item.length);
    }
}