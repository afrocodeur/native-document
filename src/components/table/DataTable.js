import Column from "./Column";
import ColumnGroup from "./ColumnGroup";
import BaseComponent from "../BaseComponent";
import {Observable as $} from "../../core/data/Observable";
import HasEventEmitter from "../../core/utils/HasEventEmitter";
import DebugManager from "../../core/utils/debug-manager";

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

DataTable.use = function(template) {
    DataTable.defaultTemplate = template;
};

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
// COLONNES
// ---------------------------------------------


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

DataTable.prototype.group = function(title, callback) {
    const group = new ColumnGroup(title);
    callback && callback(group);
    this.$description.columns.push(...group.columns());
    this.$description.header.push(group);
    this.$description.hasGroups = true;
    return this;
};

// ---------------------------------------------
// DONNÉES
// ---------------------------------------------

DataTable.prototype.data = function(data) {
    this.$description.data = data;
    return this;
};

DataTable.prototype.total = function(total) {
    this.$description.$total = BaseComponent.obs(total);
    return this;
};

DataTable.prototype.clientSide = function() {
    this.$description.mode = 'client';
    return this;
};

DataTable.prototype.serverSide = function() {
    this.$description.mode = 'server';
    return this;
};

DataTable.prototype.loading = function(loading) {
    this.$description.loading = loading;
    return this;
};

DataTable.prototype.error = function(error) {
    this.$description.error = error;
    return this;
};

// ---------------------------------------------
// TRI
// ---------------------------------------------

DataTable.prototype.defaultSort = function(col, dir = 'asc') {
    this.$description.defaultSort = {col, dir};
    this.$description.$sort.push({col, dir});
    return this;
};

DataTable.prototype.multiSort = function(enabled = true) {
    this.$description.multiSort = enabled;
    return this;
};

DataTable.prototype.onSort = function(handler) {
    this.on('sort', handler);
    return this;
};

// ---------------------------------------------
// RECHERCHE & FILTRES
// ---------------------------------------------

DataTable.prototype.searchable = function(enabled = true) {
    this.$description.searchable = enabled;
    return this;
};

DataTable.prototype.filterable = function(enabled = true) {
    this.$description.filterable = enabled;
    return this;
};

DataTable.prototype.defaultFilters = function(filters) {
    this.$description.defaultFilters = filters;
    this.$description.$filters.set(filters);
    return this;
};

DataTable.prototype.onSearch = function(handler) {
    this.on('search', handler);
    return this;
};

DataTable.prototype.onFilter = function(handler) {
    this.on('filter', handler);
    return this;
};

// ---------------------------------------------
// PAGINATION
// ---------------------------------------------

DataTable.prototype.pagination = function(pageSize) {
    this.$description.pagination = true;
    this.$description.$pageSize.set(pageSize);
    return this;
};

DataTable.prototype.pageSizes = function(sizes) {
    this.$description.pageSizes = sizes;
    return this;
};

DataTable.prototype.defaultPage = function(page) {
    this.$description.defaultPage = page;
    this.$description.$currentPage.set(page);
    return this;
};

DataTable.prototype.onPage = function(handler) {
    this.on('page', handler);
    return this;
};

// ---------------------------------------------
// SÉLECTION
// ---------------------------------------------

DataTable.prototype.selectable = function(enabled = true) {
    this.$description.selectable = enabled;
    return this;
};

DataTable.prototype.multiSelect = function(enabled = true) {
    this.$description.multiSelect = enabled;
    return this;
};

DataTable.prototype.selectedRows = function($obs) {
    if(!$obs.__$isObservableArray) {
        DebugManager.warn('Database', 'selectedRow should take an Observable array');
    }
    this.$description.$selectedRows = $obs;
    return this;
};

DataTable.prototype.onSelect = function(handler) {
    this.on('select', handler);
    return this;
};

// ---------------------------------------------
// ÉDITION
// ---------------------------------------------

DataTable.prototype.editable = function(enabled = true) {
    this.$description.editable = enabled;
    return this;
};

DataTable.prototype.onEdit = function(handler) {
    this.on('edit', handler);
    return this;
};

DataTable.prototype.onEditCancel = function(handler) {
    this.on('editCancel', handler);
    return this;
};

// ---------------------------------------------
// EXPORT
// ---------------------------------------------

DataTable.prototype.export = function(label, format, filename) {
    this.$description.exports.push({ label, format, filename });
    return this;
};

DataTable.prototype.exportFileName = function(name) {
    this.$description.exportFileName = name;
    return this;
};

DataTable.prototype.onExport = function(handler) {
    this.on('export', handler);
    return this;
};

// ---------------------------------------------
// LIGNES
// ---------------------------------------------

DataTable.prototype.expandable = function(renderFn, isExpandedIcon = '▼', isNotExpandedIcon = '▶') {
    this.$description.expandable = renderFn;
    this.$description.isExpandedIcon = isExpandedIcon;
    this.$description.isNotExpandedIcon = isNotExpandedIcon;
    return this;
};

DataTable.prototype.masterDetail = function(renderFn) {
    this.$description.masterDetail = renderFn;
    return this;
};

DataTable.prototype.bulkActions = function(actions) {
    this.$description.bulkActions = actions;
    return this;
};

DataTable.prototype.rowProps = function(fn) {
    this.$description.rowProps = fn;
    return this;
};

DataTable.prototype.onRowClick = function(handler) {
    this.$description.onRowClick = handler;
    return this;
};

DataTable.prototype.onRowDoubleClick = function(handler) {
    this.$description.onRowDoubleClick = handler;
    return this;
};

DataTable.prototype.onRowHover = function(handler) {
    this.$description.onRowHover = handler;
    return this;
};

// ---------------------------------------------
// EMPTY & ERROR
// ---------------------------------------------

DataTable.prototype.layout = function(layoutFn) {
    this.$description.layout = layoutFn;
    return this;
};

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

DataTable.prototype.persist = function(key, options = {}) {
    this.$description.persistKey     = key;
    this.$description.persistOptions = {
        include: options.include || ['sort', 'filters', 'search', 'page', 'pageSize', 'columns'],
        storage: options.storage || 'localStorage',
    };
    return this;
};

// ---------------------------------------------
// ACTIONS PUBLIQUES
// ---------------------------------------------

DataTable.prototype.refresh = function() {
    this.emit('refresh');
    return this;
};

DataTable.prototype.clearSelection = function() {
    this.$description.$selectedRows.clear();
    return this;
};

DataTable.prototype.clearFilters = function() {
    this.$description.$filters.set({});
    this.$description.$search.set('');
    this.emit('filter', {});
    return this;
};

DataTable.prototype.goToPage = function(page) {
    this.$description.$currentPage.set(page);
    this.emit('page', page, this.$description.$pageSize.val());
    return this;
};

DataTable.prototype.empty = function(content) {
    this.$description.empty = content;
    return this;
};