import Column from "./Column";
import ColumnGroup from "./ColumnGroup";
import { Table, TFoot, TRow } from "../../../elements";
import DataTable from "./DataTable";


export default function SimpleTable(configs = {}) {
    this.$description = {
        header: [],
        columns: [],
        hasGroups: false,
        rowTemplate: null,
        tableTemplate: null,
        data: null,
        layout: null,
        expandable: false,
        ...configs
    };

    this.$element = null;
    this.$thead = null;
    this.$tbody = null;
    this.$tfoot = null;
}

SimpleTable.defaultTableTemplate = null;
SimpleTable.defaultRowTemplate = null;
SimpleTable.defaultEmptyTemplate = null;

/**
 *
 * @param {{
 * column: { header: string|Function|null, render: string|Function|null },
 * columnGroup: { header: string|Function|null },
 * row: string|Function|null,
 * table: string|Function|null
 * empty: string|Function|null
 * }} template
 */
SimpleTable.use = function(template) {
    Column.use(template.column || {});
    ColumnGroup.use(template.columnGroup || {});
    SimpleTable.defaultRowTemplate = template.row || SimpleTable.defaultRowTemplate;
    SimpleTable.defaultTableTemplate = template.table || SimpleTable.defaultTableTemplate;
    SimpleTable.defaultEmptyTemplate = template.empty || SimpleTable.defaultEmptyTemplate;
};

SimpleTable.create = function(configs) {
    return new SimpleTable(configs);
};

SimpleTable.prototype.column = function(key, title, callback) {
    const column = new Column(key);
    column.title(title);
    callback && callback(column);
    this.$description.columns.push(column);
    this.$description.header.push(column);
    return this;
};

SimpleTable.prototype.group = function(title, callback) {
    const group = new ColumnGroup(title);
    callback && callback(group);
    this.$description.columns.push(...group.columns());
    this.$description.header.push(group);
    this.$description.hasGroups = true;
    return this;
};

SimpleTable.prototype.columns = function(columnsArray) {
    columnsArray.forEach(column => this.column(column.key, column.title, column.callback));
    return this;
};

SimpleTable.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

DataTable.prototype.expandable = function() {
    this.$description.expandable = true
    return this;
};

SimpleTable.prototype.renderRow = function(template) {
    this.$description.rowTemplate = template;
    return this;
}

SimpleTable.prototype.buildRow = function(rowData) {
    const rowTemplate = this.$description.rowTemplate || SimpleTable.defaultRowTemplate;

    if(typeof rowTemplate === 'function') {
        return rowTemplate(rowData, this);
    }

    return TRow(this.$description.columns.map(
        column => TBodyCell({}, column.buildCell(rowData))
    ));
};

SimpleTable.prototype.renderTable = function(template) {
    this.$description.tableTemplate = template;
    return this;
};

SimpleTable.prototype.buildTable = function(slots = {}) {
    const { headerRows } = slots;

    const tableTemplate = this.$description.tableTemplate || SimpleTable.defaultTableTemplate;
    if(typeof tableTemplate === 'function') {
        return tableTemplate(slots, this);
    }

    return Table({ border: 2 }, [
        THead(headerRows),
        TBody(
            ForEachArray(this.$description.data, rowData => {
                return this.buildRow(rowData, this);
            })
        )
    ]);
};

SimpleTable.prototype.onClick = function(callback) {
    this.$description.onClick = callback;
};



//-----------------------------------------------------------------
// Expandable Actions
//-----------------------------------------------------------------

DataTable.prototype.expand = function(row) {
    // TODO: implement this action
    return this;
};

DataTable.prototype.collapse = function(row) {
    // TODO: implement this action
    return this;
};

DataTable.prototype.collapseAll = function() {
    // TODO: implement this action
    return this;
};

DataTable.prototype.isRowExpanded = function(row) {
    // TODO: implement this action
    return this;
};


//


SimpleTable.prototype.$build = function() {
    const header = [];
    if(this.$description.hasGroups) {
        const firstRow = [];
        const secondRow = [];

        this.$description.header.forEach(columnOrGroup => {
            if(columnOrGroup.isGroup) {
                const columns = columnOrGroup.columns();
                firstRow.push(columnOrGroup.buildHeader());
                secondRow.push(columns.map(column => THeadCell({}, column.buildHeader())));
            } else {
                firstRow.push(columnOrGroup.buildHeader(2));
            }
        });

        header.push(TRow(firstRow));
        header.push(TRow(secondRow));
    } else {
        header.push(TRow(
            this.$description.columns.map(column => column.buildHeader())
        ));
    }

    return this.buildTable({ headerRows: header });
};

SimpleTable.prototype.toNdElement = function() {
    return this.$build();
};