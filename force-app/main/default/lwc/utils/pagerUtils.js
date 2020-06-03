const PAGER_NAME = 'c-pager';

export function getPagesOrDefault() {
    const pager = this.template.querySelector(PAGER_NAME);
    return !!pager ? pager.currentlyShown : [];
}

export function handlePagerChanged() {
    this.currentlyVisible = this.getPagesOrDefault();
}
