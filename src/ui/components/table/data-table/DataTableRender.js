import {Div} from '../../../../../elements';
import './data-table.css';

import {buildColumnsBtn, buildExportBtn, buildFiltersBtn, buildSearch, buildToolbar} from './toolbar';
import {buildBulkActions, buildBulkButtons, buildBulkCount} from './bulk-actions';
import {buildTable} from './tables';
import {buildPageInfo, buildPageNav, buildPageSize, buildPagination} from './pagination';

export default function DataTableRender($desc, instance) {
    const props = instance.getEditableProps();
    props.class.add('data-table');
    // [a11y] aria-label on data table
    if($desc.label) {
        props['aria-label'] = $desc.label;
    }

    const visibleColumns = $desc.columns.filter(col =>
        col.$description.visible !== false,
    );


    // Build Slots
    const search  = buildSearch($desc, instance);
    const filters    = buildFiltersBtn($desc, instance);
    const exportBtn  = buildExportBtn($desc, instance);
    const columnsBtn = buildColumnsBtn($desc, instance);
    const toolbar    = buildToolbar({ search, filters, exportBtn, columnsBtn });

    const bulkCount   = buildBulkCount($desc, instance);
    const bulkButtons = buildBulkButtons($desc, instance);
    const bulkActions = buildBulkActions({bulkCount, bulkButtons}, $desc, instance);

    const table      = buildTable($desc, instance, visibleColumns);

    const pageInfo   = buildPageInfo($desc, instance);
    const pageSize   = buildPageSize($desc, instance);
    const pageNav    = buildPageNav($desc, instance);
    const pagination = buildPagination({pageInfo, pageSize, pageNav});

    const slots = {visibleColumns, toolbar, search, filters, exportBtn, columnsBtn, bulkActions, bulkCount, bulkButtons, table, pagination, pageInfo, pageSize, pageNav};

    const layoutFn = $desc.layout || buildDefaultLayout;

    return layoutFn(slots, instance);
}

const buildDefaultLayout = ({toolbar, bulkActions, table, pagination}) => {
    return Div({class: 'data-table-layout'}, [
        toolbar,
        bulkActions,
        table,
        pagination,
    ]);
};