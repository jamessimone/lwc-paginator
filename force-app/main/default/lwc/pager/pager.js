import { api, LightningElement, track } from 'lwc';

const IS_ACTIVE = 'active';

export default class Pager extends LightningElement {
    @api pagedata = [];
    @api title = '';

    @track currentPageIndex = 0;
    @track maxNumberOfPages = 0;
    MAX_PAGES_TO_SHOW = 5;

    _pageRange = [];

    @api
    get currentlyShown() {
        const currentPage = this.MAX_PAGES_TO_SHOW * this.currentPageIndex;
        const pageStartRange =
            currentPage >= this.pagedata.length
                ? this.pagedata.length - this.MAX_PAGES_TO_SHOW
                : currentPage;
        const pageEndRange =
            this.currentPageIndex === 0
                ? this.MAX_PAGES_TO_SHOW
                : pageStartRange + this.MAX_PAGES_TO_SHOW;

        return this.pagedata.slice(pageStartRange, pageEndRange);
    }

    @api
    get currentVisiblePageRanges() {
        if (this._pageRange.length === 0) {
            this._pageRange = this._fillRange(
                this.currentPageIndex * this.MAX_PAGES_TO_SHOW,
                this.MAX_PAGES_TO_SHOW
            );
        }
        return this._pageRange;
    }
    set currentVisiblePageRanges(nextRange) {
        const lastPossibleRange =
            nextRange + this.MAX_PAGES_TO_SHOW > this.maxNumberOfPages
                ? this.maxNumberOfPages
                : nextRange + this.MAX_PAGES_TO_SHOW;
        this._pageRange = this._fillRange(
            lastPossibleRange - this.MAX_PAGES_TO_SHOW,
            lastPossibleRange
        );
    }

    renderedCallback() {
        this.maxNumberOfPages = !!this.pagedata
            ? this.pagedata.length / this.MAX_PAGES_TO_SHOW
            : 0;
        this.currentShownPages =
            this.maxNumberOfPages <= this.MAX_PAGES_TO_SHOW
                ? this.maxNumberOfPages
                : this.MAX_PAGES_TO_SHOW;
        this.dispatchEvent(new CustomEvent('pagerchanged'));
        if ([...this.template.querySelectorAll('button.active')].length === 0) {
            //first render
            this._highlightPageButtonAtIndex(1);
        }
    }

    handlePrevious() {
        this.currentPageIndex =
            this.currentPageIndex > 0 ? this.currentPageIndex - 1 : 0;
        this.currentVisiblePageRanges =
            this.currentPageIndex - 1 <= 0 ? 1 : this.currentPageIndex - 1;
        this.dispatchEvent(new CustomEvent('pagerchanged'));
        this._highlightPageButtonAtIndex(
            this.currentPageIndex <= 0 ? 1 : this.currentPageIndex - 1
        );
    }

    handleNext() {
        this.currentPageIndex =
            this.currentPageIndex < this.maxNumberOfPages
                ? this.currentPageIndex + 1
                : this.maxNumberOfPages;
        this.currentVisiblePageRanges =
            this.currentPageIndex <= this.maxNumberOfPages
                ? this.currentPageIndex
                : this.currentPageIndex + 1;
        this.dispatchEvent(new CustomEvent('pagerchanged'));
        this._highlightPageButtonAtIndex(
            this.currentPageIndex >= this.maxNumberOfPages
                ? this.maxNumberOfPages
                : this.currentPageIndex + 1
        );
    }

    handleClick(event) {
        this.currentPageIndex = parseInt(event.target.innerHTML);
        this.currentVisiblePageRanges = this.currentPageIndex;
        this._clearCurrentlyActive();
        event.target.classList.toggle(IS_ACTIVE);
    }

    _clearCurrentlyActive() {
        const alreadySelected = [
            ...this.template.querySelectorAll('.' + IS_ACTIVE)
        ];
        if (alreadySelected.length === 1) {
            alreadySelected[0].classList.toggle(IS_ACTIVE);
        }
    }

    _fillRange(start, end) {
        const safeEnd = end < start ? start + this.MAX_PAGES_TO_SHOW : end;
        return Array(safeEnd - start)
            .fill()
            .map((_, index) => (start === 0 ? 1 + index : start + index));
    }

    _highlightPageButtonAtIndex(pageNumber) {
        this._clearCurrentlyActive();
        const pageButtons = [...this.template.querySelectorAll('button')];
        const firstButton = pageButtons.filter(
            (button) => button.textContent === String(pageNumber)
        );
        if (firstButton.length === 1) {
            firstButton[0].classList.toggle(IS_ACTIVE);
        }
    }
}
