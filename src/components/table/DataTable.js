import Column from "./types/Column";
import ColumnGroup from "./types/ColumnGroup";
import BaseComponent from "../BaseComponent";
import {Observable as $} from "../../core/data/Observable";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import DebugManager from "../../core/utils/debug-manager";

/**
 * Full-featured data table with sorting, searching, filtering, pagination, selection, editing, expandable rows, bulk actions, and server-side support.
 *
 *
 * @example
 * const table = new DataTable()
 *     .column('id', 'ID').column('name', 'Name').column('email', 'Email')
 *     .data(users)
 *     .pagination(20)
 *     .searchable(true)
 *     .selectable(true)
 *     .onSort((col, dir) => loadData({ sort: col, dir }))
 *     .onPage((page, size) => loadData({ page, size }))
 *     .onSelect((rows) => console.log('selected', rows));
 *
 * DataTable.use((description, instance) => {
 *     // description.columns, description.data, description.loading...
 *     return Div({ class: 'data-table-wrapper' });
 * });
 *
 * @constructor
 * @param {GlobalAttributes} [props]
 */
export default function DataTable(props = {}) {
    if(!(this instanceof DataTable)) {
        return new DataTable(props);
    }

    BaseComponent.call(this, props);

    this.$description = {
        // Colonnes
        header:       [],
        columns:      [],
        hasGroups:    false,

        // Données
        data:         null,
        total:        null,
        mode:         'client',  // 'client' | 'server'
        loading:      null,
        error:        null,

        // Tri
        defaultSort:  null,
        multiSort:    false,

        // Recherche & Filtres
        searchable:   false,
        filterable:   false,
        defaultFilters: null,

        // Pagination
        pageSize:     null,
        pageSizes:    null,
        defaultPage:  1,

        // Sélection
        selectable:   false,
        multiSelect:  false,

        // Édition
        editable:     false,

        // Export
        exports:      [],
        exportFileName: null,

        // Lignes
        expandable:   null,
        masterDetail: null,
        bulkActions:  null,
        rowProps:     null,
        onRowClick:   null,
        onRowDoubleClick: null,
        onRowHover:   null,

        // Empty & Error
        empty:        null,

        // Layout & Labels
        layout:       null,
        labels: {
            searchPlaceholder:      'Rechercher...',
            search:      'Rechercher',
            filters:     'Filtres',
            export:      'Export',
            columns:     'Colonnes',
            rowsPerPage: 'Lignes par page',
            selected:    (n) => `${n} sélectionnés`,
            results:     (total, page, pages) => `${total} résultats · Page ${page} sur ${pages}`,
        },

        // Persistance
        persistKey:   null,
        persistOptions: null,

        // État Observable
        $currentPage:   $(1),
        $pageSize:      $(10),
        $total:         $(0),
        $selectedRows:  $.array([]),
        $sort:          $.array([]),
        $filters:       $({}),
        $search:        $(''),
        $isLoading:     $(false),

        isExpandedIcon: null,
        isNotExpandedIcon: null,
    };
}

BaseComponent.extends(DataTable);
BaseComponent.use(DataTable, HasEventEmitter);

DataTable.defaultTemplate = null;

/**
 * Registers the render template for DataTable.
 * @param {(description: {
 *     header: Array<Column|ColumnGroup>,
 *     columns: Column[],
 *     data: *[]|Observable<*[]>|null,
 *     total: number|Observable<number>|null,
 *     mode: 'client'|'server',
 *     loading: Observable<boolean>|boolean|null,
 *     error: NdChild|null,
 *     searchable: boolean,
 *     filterable: boolean,
 *     pageSize: number|null,
 *     selectable: boolean,
 *     multiSelect: boolean,
 *     editable: boolean,
 *     expandable: ((row: *) => NdChild)|null,
 *     bulkActions: Array<{ label: NdChild, action: (rows: *[]) => void }>|null,
 *     rowProps: ((row: *) => GlobalAttributes)|null,
 *     empty: NdChild|null,
 *     layout: ((desc: *, instance: DataTable) => NdChild)|null,
 *     labels: Record<string, string>,
 *     props: GlobalAttributes,
 * }, instance: DataTable) => NdChild} template
 */
DataTable.use = function(template) {
    DataTable.defaultTemplate = template;
};

/**
 * @param {GlobalAttributes} [props]
 * @returns {DataTable}
 */
DataTable.create = function(props) {
    return new DataTable(props);
};

DataTable.prototype.$beforeRender = function() {
    const key     = this.$description.persistKey;
    const options = this.$description.persistOptions;

    if(!key || !options) return;

    const storage = options.storage === 'sessionStorage'
        ? sessionStorage
        : localStorage;

    const optionsKeys = {
        page: this.$description.$currentPage,
        pageSize: this.$description.$pageSize,
        sort: this.$description.$sort,
        filters: this.$description.$filters,
        search: this.$description.$search,
    };
    try {
        const saved = JSON.parse(storage.getItem(key) || '{}');

        for(const optionKey in optionsKeys) {
            const source = optionsKeys[optionKey];
            if(options.include.includes(optionKey) && saved[optionKey]) {
                source.set(saved[optionKey]);
            }
        }
        if(options.include.includes('columns') && saved.columns) {
            for(let i = 0, length = this.$description.columns.length; i < length; i++) {
                const col     = this.$description.columns[i];
                const colKey  = col.$description.key;
                if(saved.columns[colKey] !== undefined) {
                    col.$description.visible = saved.columns[colKey];
                }
            }
        }
    }
    catch(e) {
        storage.removeItem(key);
    }

    const save = () => {
        const state = {};

        for(const optionKey in optionsKeys) {
            const source = optionsKeys[optionKey];
            if(options.include.includes(optionKey)) {
                state[optionKey] = source.val()
            }
        }

        if(options.include.includes('columns')) {
            state.columns = {};
            for(let i = 0, length = this.$description.columns.length; i < length; i++) {
                const col = this.$description.columns[i];
                state.columns[col.$description.key] = col.$description.visible;
            }
        }

        storage.setItem(key, JSON.stringify(state));
    };

    for(const optionKey in optionsKeys) {
        const source = optionsKeys[optionKey];
        if(options.include.includes(optionKey)) {
            source.subscribe(save)
        }
    }
};

// ---------------------------------------------
// Columns
// ---------------------------------------------


/**
 * @param {string} key
 * @param {NdChild} title
 * @param {GlobalAttributes} [props]
 * @param {((col: Column) => void)} [callback]
 * @returns {this}
 */
DataTable.prototype.column = function(key, title, props, callback) {
    if(typeof props === 'function') {
        callback = props;
        props = {};
    }
    const column = new Column(key);
    column.title(title);
    column.props(props)
    callback && callback(column);
    this.$description.columns.push(column);
    this.$description.header.push(column);
    return this;
};

/**
 * @param {NdChild} title
 * @param {(group: ColumnGroup) => void} callback
 * @returns {this}
 */
DataTable.prototype.group = function(title, callback) {
    const group = new ColumnGroup(title);
    callback && callback(group);
    this.$description.columns.push(...group.columns());
    this.$description.header.push(group);
    this.$description.hasGroups = true;
    return this;
};

// ---------------------------------------------
// Data
// ---------------------------------------------

/**
 * @param {*[]|Observable<*[]>} data
 * @returns {this}
 */
DataTable.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

/**
 * @param {number|Observable<number>} total
 * @returns {this}
 */
DataTable.prototype.total = function(total) {
    this.$description.$total = BaseComponent.obs(total);
    return this;
};

/**
 * @returns {this}
 */
DataTable.prototype.clientSide = function() {
    this.$description.mode = 'client';
    return this;
};

/**
 * @returns {this}
 */
DataTable.prototype.serverSide = function() {
    this.$description.mode = 'server';
    return this;
};

/**
 * @param {boolean|Observable<boolean>} loading
 * @returns {this}
 */
DataTable.prototype.loading = function(loading) {
    this.$description.loading = loading;
    return this;
};

/**
 * @param {*} error
 * @returns {this}
 */
DataTable.prototype.error = function(error) {
    this.$description.error = error;
    return this;
};

// ---------------------------------------------
// Order
// ---------------------------------------------

/**
 * @param {*} col
 * @param {*} [dir]
 * @returns {this}
 */
DataTable.prototype.defaultSort = function(col, dir = 'asc') {
    this.$description.defaultSort = {col, dir};
    this.$description.$sort.push({col, dir});
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
DataTable.prototype.multiSort = function(enabled = true) {
    this.$description.multiSort = enabled;
    return this;
};

/**
 * @param {(col: string, dir: 'asc'|'desc') => void} handler
 * @returns {this}
 */
DataTable.prototype.onSort = function(handler) {
    this.on('sort', handler);
    return this;
};

// ---------------------------------------------
// Filters & Search
// ---------------------------------------------

/**
 * @param {*} [enabled]
 * @returns {this}
 */
DataTable.prototype.searchable = function(enabled = true) {
    this.$description.searchable = enabled;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
DataTable.prototype.filterable = function(enabled = true) {
    this.$description.filterable = enabled;
    return this;
};

/**
 * @param {Record<string, *>} filters
 * @returns {this}
 */
DataTable.prototype.defaultFilters = function(filters) {
    this.$description.defaultFilters = filters;
    this.$description.$filters.set(filters);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
DataTable.prototype.onSearch = function(handler) {
    this.on('search', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
DataTable.prototype.onFilter = function(handler) {
    this.on('filter', handler);
    return this;
};

// ---------------------------------------------
// Pagination
// ---------------------------------------------

/**
 * @param {number} pageSize
 * @returns {this}
 */
DataTable.prototype.pagination = function(pageSize) {
    this.$description.pagination = true;
    this.$description.$pageSize.set(pageSize);
    return this;
};

/**
 * @param {number[]} sizes
 * @returns {this}
 */
DataTable.prototype.pageSizes = function(sizes) {
    this.$description.pageSizes = sizes;
    return this;
};

/**
 * @param {number} page
 * @returns {this}
 */
DataTable.prototype.defaultPage = function(page) {
    this.$description.defaultPage = page;
    this.$description.$currentPage.set(page);
    return this;
};

/**
 * @param {(page: number, pageSize: number) => void} handler
 * @returns {this}
 */
DataTable.prototype.onPage = function(handler) {
    this.on('page', handler);
    return this;
};

// ---------------------------------------------
// Selection
// ---------------------------------------------

/**
 * @param {*} [enabled]
 * @returns {this}
 */
DataTable.prototype.selectable = function(enabled = true) {
    this.$description.selectable = enabled;
    return this;
};

/**
 * @param {*} [enabled]
 * @returns {this}
 */
DataTable.prototype.multiSelect = function(enabled = true) {
    this.$description.multiSelect = enabled;
    return this;
};

/**
 * @param {ObservableArray} $obs
 * @returns {this}
 */
DataTable.prototype.selectedRows = function($obs) {
    if(!$obs.__$isObservableArray) {
        DebugManager.warn('Database', 'selectedRow should take an Observable array');
    }
    this.$description.$selectedRows = $obs;
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
DataTable.prototype.onSelect = function(handler) {
    this.on('select', handler);
    return this;
};

// ---------------------------------------------
// Edition
// ---------------------------------------------

/**
 * @param {*} [enabled]
 * @returns {this}
 */
DataTable.prototype.editable = function(enabled = true) {
    this.$description.editable = enabled;
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
DataTable.prototype.onEdit = function(handler) {
    this.on('edit', handler);
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
DataTable.prototype.onEditCancel = function(handler) {
    this.on('editCancel', handler);
    return this;
};

// ---------------------------------------------
// EXPORT
// ---------------------------------------------

/**
 * @param {NdChild} label
 * @param {'csv'|'xlsx'|string} format
 * @param {string} [filename]
 * @returns {this}
 */
DataTable.prototype.export = function(label, format, filename) {
    this.$description.exports.push({ label, format, filename });
    return this;
};

/**
 * @param {string} name
 * @returns {this}
 */
DataTable.prototype.exportFileName = function(name) {
    this.$description.exportFileName = name;
    return this;
};

/**
 * @param {Function} handler
 * @returns {this}
 */
DataTable.prototype.onExport = function(handler) {
    this.on('export', handler);
    return this;
};

// ---------------------------------------------
// Rows
// ---------------------------------------------

/**
 * @param {(row: *) => NdChild} renderFn
 * @param {NdChild} [isExpandedIcon='▼']
 * @param {NdChild} [isNotExpandedIcon='▶']
 * @returns {this}
 */
DataTable.prototype.expandable = function(renderFn, isExpandedIcon = '▼', isNotExpandedIcon = '▶') {
    this.$description.expandable = renderFn;
    this.$description.isExpandedIcon = isExpandedIcon;
    this.$description.isNotExpandedIcon = isNotExpandedIcon;
    return this;
};

/**
 * @param {(desc: *, instance: *) => NdChild} renderFn
 * @returns {this}
 */
DataTable.prototype.masterDetail = function(renderFn) {
    this.$description.masterDetail = renderFn;
    return this;
};

/**
 * @param {{ label: NdChild, action: (rows: *[]) => void }[]} actions
 * @returns {this}
 */
DataTable.prototype.bulkActions = function(actions) {
    this.$description.bulkActions = actions;
    return this;
};

/**
 * @param {(row: *) => GlobalAttributes} fn
 * @returns {this}
 */
DataTable.prototype.rowProps = function(fn) {
    this.$description.rowProps = fn;
    return this;
};

/**
 * @param {(row: *, event: MouseEvent) => void} handler
 * @returns {this}
 */
DataTable.prototype.onRowClick = function(handler) {
    this.$description.onRowClick = handler;
    return this;
};

/**
 * @param {(row: *, event: MouseEvent) => void} handler
 * @returns {this}
 */
DataTable.prototype.onRowDoubleClick = function(handler) {
    this.$description.onRowDoubleClick = handler;
    return this;
};

/**
 * @param {(row: *, event: MouseEvent) => void} handler
 * @returns {this}
 */
DataTable.prototype.onRowHover = function(handler) {
    this.$description.onRowHover = handler;
    return this;
};

// ---------------------------------------------
// EMPTY & ERROR
// ---------------------------------------------

/**
 * @param {(desc: *, instance: *) => NdChild} layoutFn
 * @returns {this}
 */
DataTable.prototype.layout = function(layoutFn) {
    this.$description.layout = layoutFn;
    return this;
};

/**
 * @param {Record<string, string>} labels
 * @returns {this}
 */
DataTable.prototype.labels = function(labels) {
    this.$description.labels = {
        ...this.$description.labels,
        ...labels,
    };
    return this;
};

// ---------------------------------------------
// PERSISTANCE
// ---------------------------------------------

/**
 * @param {string} key
 * @param {Record<string, *>} [options]
 * @returns {this}
 */
DataTable.prototype.persist = function(key, options = {}) {
    this.$description.persistKey     = key;
    this.$description.persistOptions = {
        include: options.include || ['sort', 'filters', 'search', 'page', 'pageSize', 'columns'],
        storage: options.storage || 'localStorage',
    };
    return this;
};

// ---------------------------------------------
// Public Actions
// ---------------------------------------------

/**
 * @returns {this}
 */
DataTable.prototype.refresh = function() {
    this.emit('refresh');
    return this;
};

/**
 * @returns {this}
 */
DataTable.prototype.clearSelection = function() {
    this.$description.$selectedRows.clear();
    return this;
};

/**
 * @returns {this}
 */
DataTable.prototype.clearFilters = function() {
    this.$description.$filters.set({});
    this.$description.$search.set('');
    this.emit('filter', {});
    return this;
};

/**
 * @param {number} page
 * @returns {this}
 */
DataTable.prototype.goToPage = function(page) {
    this.$description.$currentPage.set(page);
    this.emit('page', page, this.$description.$pageSize.val());
    return this;
};

/**
 * @param {NdChild} content
 * @returns {this}
 */
DataTable.prototype.empty = function(content) {
    this.$description.empty = content;
    return this;
};