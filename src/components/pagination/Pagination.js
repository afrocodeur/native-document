import BaseComponent from "../BaseComponent";
import { $ } from "../../core/data/Observable";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import DebugManager from "../../core/utils/debug-manager";

export default function Pagination(props = {}) {
    if(!(this instanceof Pagination)) {
        return new Pagination(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        currentPage: $(1),
        pages: $.array([]),
        totalPages: $(2),
        pageSize: $(10),
        totalItems: $(0),
        siblingCount: 1,
        boundaryCount: 1,
        showFirstLast: true,
        showPreviousNext: true,
        disabled: false,
        data: null,
        renderPage: null,
        renderEllipsis: null,
        renderPrevious: null,
        renderNext: null,
        renderFirst: null,
        renderLast: null,
        render: null,
        props
    };

    this.$element = null;
}

BaseComponent.extends(Pagination);
BaseComponent.use(Pagination, HasEventEmitter);

Pagination.defaultTemplate = null;

Pagination.use = function(template) {
    Pagination.defaultTemplate = template;
};

Pagination.preset = function(name, callback) {
    if (Pagination.prototype[name] || Pagination[name]) {
        DebugManager.warn(`Warning: the ${name} method already exist in Pagination.`);
        return;
    }
    Pagination[name] = (props) => callback(new Pagination(props));
};

Pagination.presets = function(presets) {
    for (const name in presets) {
        Pagination.preset(name, presets[name]);
    }
};

Pagination.prototype.$originalBuild = BaseComponent.prototype.$build;

Pagination.prototype.$build = function() {
    const $desc = this.$description;

    const updatePages = () => {
        $desc.totalPages.set(Math.ceil($desc.totalItems.val() / $desc.pageSize.val()));
        this.$updatePages();
    };

    $desc.pageSize.subscribe(updatePages);
    $desc.currentPage.subscribe(updatePages);
    $desc.totalItems.subscribe(updatePages);
    $desc.totalPages.subscribe(() => this.$updatePages());

    const totalPages = Math.ceil($desc.totalItems.val() / $desc.pageSize.val());
    $desc.totalPages.set(totalPages);
    this.$updatePages();

    return this.$originalBuild();
};
Pagination.prototype.currentPage = function(page) {
    if (typeof page === 'number') {
        this.$description.currentPage.set(page);
    } else {
        this.$description.currentPage = page;
    }
    return this;
};

Pagination.prototype.totalPages = function(total) {
    this.$description.totalPages.set(total);
    return this;
};

Pagination.prototype.pageSize = function(size) {
    this.$description.pageSize = BaseComponent.obs(size);
    return this;
};

Pagination.prototype.totalItems = function(total) {
    this.$description.totalItems = BaseComponent.obs(total);
    return this;
};

Pagination.prototype.siblingCount = function(count) {
    this.$description.siblingCount = count;
    return this;
};

Pagination.prototype.boundaryCount = function(count) {
    this.$description.boundaryCount = count;
    return this;
};

Pagination.prototype.showFirstLast = function(show = true) {
    this.$description.showFirstLast = show;
    return this;
};

Pagination.prototype.showPreviousNext = function(show = true) {
    this.$description.showPreviousNext = show;
    return this;
};

Pagination.prototype.disabled = function(disabled = true) {
    this.$description.disabled = disabled;
    return this;
};

Pagination.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

Pagination.prototype.goToPage = function(page) {
    if (page < 1 || page > this.$description.totalPages.val()) {
        return this;
    }

    this.$description.currentPage.set(page);
    this.emit('pageChange', page);
    return this;
};

Pagination.prototype.next = function() {
    const current = this.$description.currentPage.val();
    return this.goToPage(current + 1);
};

Pagination.prototype.previous = function() {
    const current = this.$description.currentPage.val();
    return this.goToPage(current - 1)
};

Pagination.prototype.first = function() {
    return this.goToPage(1);
};

Pagination.prototype.last = function() {
    return this.goToPage(this.$description.totalPages.val());
};

Pagination.prototype.hasNext = function() {
    return this.$description.currentPage.val() < this.$description.totalPages.last();
};

Pagination.prototype.hasPrevious = function() {
    return this.$description.currentPage.val() > 1;
};

Pagination.prototype.$updatePages = function() {
    this.$description.pages.set(this.getPageNumbers());
};

Pagination.prototype.getPageNumbers = function() {
    const current = this.$description.currentPage.val();
    const total = this.$description.totalPages.val();
    const siblings = this.$description.siblingCount;
    const boundary = this.$description.boundaryCount;

    const pages = [];

    const leftSiblingIndex = Math.max(current - siblings, boundary + 1);
    const rightSiblingIndex = Math.min(current + siblings, total - boundary);

    const showLeftEllipsis = leftSiblingIndex > boundary + 2;
    const showRightEllipsis = rightSiblingIndex < total - boundary - 1;

    for (let i = 1; i <= boundary; i++) {
        pages.push(i);
    }

    if (showLeftEllipsis) {
        pages.push('...');
    }
    else {
        for (let i = boundary + 1; i < leftSiblingIndex; i++) {
            pages.push(i);
        }
    }

    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        pages.push(i);
    }

    if (showRightEllipsis) {
        pages.push('...');
    }
    else {
        for (let i = rightSiblingIndex + 1; i < total - boundary + 1; i++) {
            pages.push(i);
        }
    }

    for (let i = Math.max(total - boundary + 1, boundary + 1); i <= total; i++) {
        if (!pages.includes(i)) {
            pages.push(i);
        }
    }

    return pages;
};

Pagination.prototype.onPageChange = function(handler) {
    this.on('pageChange', handler);
    return this;
};

Pagination.prototype.onChange = function(handler) {
    this.on('pageChange', handler);
    return this;
};

Pagination.prototype.renderPage = function(renderFn) {
    this.$description.renderPage = renderFn;
    return this;
};

Pagination.prototype.renderEllipsis = function(renderFn) {
    this.$description.renderEllipsis = renderFn;
    return this;
};

Pagination.prototype.renderPrevious = function(renderFn) {
    this.$description.renderPrevious = renderFn;
    return this;
};

Pagination.prototype.renderNext = function(renderFn) {
    this.$description.renderNext = renderFn;
    return this;
};

Pagination.prototype.renderFirst = function(renderFn) {
    this.$description.renderFirst = renderFn;
    return this;
};

Pagination.prototype.renderLast = function(renderFn) {
    this.$description.renderLast = renderFn;
    return this;
};