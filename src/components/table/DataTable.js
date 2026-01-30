import SimpleTable from "./SimpleTable";
import { Observable as $ } from "../../../index";

export default function DataTable(name, configs) {
    SimpleTable.call(this, name, configs);

    Object.assign(this.$description, {
        pageSize: 0,
        layout: null,
        selectable: false,
        expandable: false,
        paginationTemplate: null,
        toolbarTemplate: null,
        ...configs
    });

    this.$currentPage = $(1);
    this.$selectedRows = $.array();
    this.$expandedRows = $.array();
}

DataTable.defaultToolbarTemplate = null;
DataTable.defaultPaginationTemplate = null;
DataTable.defaultLayout = null;

DataTable.use = function(template) {
    SimpleTable.use(template);
    DataTable.defaultToolbarTemplate = template.toolbar;
    DataTable.defaultPaginationTemplate = template.pagination;
    DataTable.defaultLayout = template.layout;
};

DataTable.prototype = Object.create(SimpleTable.prototype);
DataTable.prototype.constructor = DataTable;

DataTable.prototype.paginate = function(size) {
    this.$description.pageSize = size;
    return this;
};

DataTable.prototype.selectable = function() {
    this.$description.selectable = true
    return this;
};


DataTable.prototype.layout = function(layoutFn) {
    this.$description.layout = layoutFn;
    return this;
};

DataTable.prototype.toolbarTemplate = function(template) {
    this.$description.toolbarTemplate = template;
    return this;
};

DataTable.prototype.paginationTemplate = function(template) {
    this.$description.paginationTemplate = template;
    return this;
};


DataTable.prototype.buildToolbar = function() {
    const toolbarTemplate = this.$description.toolbarTemplate || DataTable.defaultToolbarTemplate;
    if(typeof toolbarTemplate === 'function') {
        return toolbarTemplate(this);
    }
    return null;
};

DataTable.prototype.buildPagination = function() {
    const paginationTemplate = this.$description.paginationTemplate || DataTable.defaultPaginationTemplate;
    if(typeof paginationTemplate === 'function') {
        return paginationTemplate(this);
    }
    return null;
};


DataTable.prototype.toNdElement = function() {
    const layout = this.$description.layout || DataTable.defaultLayout;
    if (typeof layout === 'function') {
        return layout(this);
    }
    return Div({ class: 'data-table-container' }, [
        this.buildToolbar(),
        this.build(),
        this.buildPagination()
    ]);
};


//-----------------------------------------------------------------
// Page Actions
//-----------------------------------------------------------------

DataTable.prototype.goToPage = function(page) {
    // TODO: implement this action
    return this;
};

DataTable.prototype.goToLastPage = function(page) {
    // TODO: implement this action
    return this;
};

DataTable.prototype.goToFirstPage = function(page) {
    // TODO: implement this action
    return this;
};

DataTable.prototype.nextPage = function() {
    // TODO: implement this action
    return this;
};

DataTable.prototype.previousPage = function() {
    // TODO: implement this action
    return this;
};

DataTable.prototype.paginationConfig = function() {
    return {
        size: this.$description.pageSize
    };
};


//-----------------------------------------------------------------
// Sort Actions
//-----------------------------------------------------------------

DataTable.prototype.defaultSort = function() {
    // TODO: implement this action
    return this;
};

DataTable.prototype.sortBy = function() {
    // TODO: implement this action
    return this;
};

DataTable.prototype.clearSort = function() {
    // TODO: implement this action
    return this;
};

DataTable.prototype.getSortState = function() {
    // TODO: implement this action
    return this;
};


//-----------------------------------------------------------------
// Selectable Actions
//-----------------------------------------------------------------

DataTable.prototype.select = function(row) {
    // TODO: implement this action
    return this;
};

DataTable.prototype.deselect = function(row) {
    // TODO: implement this action
    return this;
};

DataTable.prototype.selectAll = function() {
    // TODO: implement this action
    return this;
};

DataTable.prototype.deselectAll = function() {
    // TODO: implement this action
    return this;
};

DataTable.prototype.clearSelection = function() {
    // TODO: implement this action
    return this;
};

DataTable.prototype.getSelectedRows = function() {
    // TODO: implement this action
    return this;
};

DataTable.prototype.isRowSelected = function(row) {
    // TODO: implement this action
    return this;
};

