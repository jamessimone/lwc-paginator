import { api, LightningElement, wire } from 'lwc';
import getFAQs from '@salesforce/apex/FAQController.getFAQs';

import { getPagesOrDefault, handlePagerChanged } from 'c/pagerUtils';

export default class FAQList extends LightningElement {
    @wire(getFAQs) faqs;
    _currentlyVisible = [];

    getPagesOrDefault = getPagesOrDefault.bind(this);
    handlePagerChanged = handlePagerChanged.bind(this);

    @api
    get currentlyVisible() {
        const pages = this.getPagesOrDefault();
        return pages.length === 0 ? this._currentlyVisible : pages;
    }
    set currentlyVisible(value) {
        this._currentlyVisible = value;
    }
}
