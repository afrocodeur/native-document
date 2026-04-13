import {
    Div,
    ForEachArray,
    Input,
    ShowIf,
    Span, Switch,
    Table,
    TBody,
    TBodyCell,
    Td,
    THead,
    THeadCell,
    TRow
} from "../../../../../elements";
import { $ } from "../../../../../index";

export const buildTable = ($desc, instance, visibleColumns) => {
    const thead = buildTHead($desc, instance, visibleColumns);
    const tbody = buildTBody($desc, instance, visibleColumns);

    return Div({class: 'data-table-wrapper'}, [
        Table({class: 'data-table-table'}, [thead, tbody]),
        buildLoading($desc),
    ]);
};

export const buildTHead = ($desc, instance, visibleColumns) => {
    const cells = [];

    if($desc.selectable != null) {
        const checkbox = Input({type: 'checkbox'});
        checkbox.nd.onChange((e) => {
            if(e.target.checked) {
                $desc.$selectedRows.set([...$desc.data.val()]);
            } else {
                $desc.$selectedRows.clear();
            }
        });
        cells.push(ShowIf($desc.selectable, () => THeadCell({class: 'data-table-th-checkbox'}, checkbox)));
    }

    if($desc.expandable != null) {
        cells.push(THeadCell({class: 'data-table-th-expand'}, ''));
    }

    const dynamicCells = ForEachArray(visibleColumns, (column) => {
        const $descCol  = column.$description;
        const isSortable = $descCol.sortable !== undefined && $descCol.sortable !== null;

        const content = isSortable
            ? buildSortHeader($desc, instance, column)
            : $descCol.header;

        const classes = {
            'is-sortable': isSortable
        };

        if($descCol.align) {
            if($descCol.align.__$Observable) {
                classes['_'] = $descCol.align.transform((v) => `is-align-${v}`)
            } else {
                classes[`is-align-${$descCol.align}`] = true
            }
        }
        if($descCol.pinned) {
            if($descCol.pinned.__$Observable) {
                classes['__'] = $descCol.pinned.transform((v) => `is-pinned-${v}`)
            } else {
                classes[`is-pinned-${$descCol.pinned}`] = true
            }
        }

        return THeadCell({ class: classes}, content);
    });
    cells.push(dynamicCells);

    return THead({}, TRow({}, cells));
};

export const buildSortHeader = ($desc, instance, column) => {
    const key    = column.$description.key;
    const $sort  = $desc.$sort;

    const itemSortData = { columnKey: key, direction: null };

    // TODO: Refactor this code
    const $direction = $('');

    const btn = Div({class: 'data-table-sort-header'}, [
        Span({}, column.$description.header),
        Span({class: 'data-table-sort-icon'}, $direction.transform(direction => {
            if(direction === 'asc') {
                return '↑';
            }
            if(direction === 'desc') {
                return '↓';
            }
            return '↕';
        })),
    ]);

    $direction.subscribe((direction) => {
        if(!direction) {
            $sort.removeItem(itemSortData);
            return;
        }
        if(!$sort.includes(itemSortData)) {
            $sort.push(itemSortData);
        }

        instance.emit('sort', $sort.val());
    });

    btn.nd.onClick(() => {
        if(!$direction.val()) {
            $direction.set('asc');
            return;
        }
        if($direction.val() === 'asc') {
            $direction.set('desc');
            return;
        }

        $direction.set(null);
    });

    return btn;
};

export const buildTBody = ($desc, instance, visibleColumns) => {
    const tbody   = TBody([
        buildEmpty($desc, visibleColumns),
    ]);

    const createRow = buildRow.bind(null, $desc, instance, visibleColumns);

    if(!$desc.data?.__$isObservableArray) {
        const data = $desc.data || [];
        for(let i = 0, length = data.length; i < length; i++) {
            tbody.append(createRow(data[i]));
        }
        return tbody;
    }

    for(let i = 0, length = $desc.data.length; i < length; i++) {
        tbody.append(createRow($desc.data.at(i)));
    }

    const mutations = {
        toFragment: (args) => {
            const fragment = document.createDocumentFragment();

            for(let i = 0, length = args.length; i < length; i++) {
                fragment.append(createRow(args[i]));
            }

            return fragment;
        },
        set: () => {
            mutations.clear();
            mutations.push($desc.data.val());
        },
        push: (args) => {
            tbody.append(mutations.toFragment(args));
        },
        unshift: (args) => {
            const first = tbody.firstChild;
            tbody.insertBefore(mutations.toFragment(args), first);
        },
        splice: (args) => {
            const [start, deleteCount, ...newRows] = args;
            const rows = [...tbody.children];
            for(let i = 0; i < deleteCount; i++) {
                rows[start + i]?.remove();
            }
            if(newRows.length === 0) {
                return;
            }
            const ref = tbody.children[start] || null;
            tbody.insertBefore(mutations.toFragment(newRows), ref);
        },
        remove: (args) => {
            tbody.children[args[0]]?.remove();
        },
        swap: (args) => {
            const [a, b] = args;
            const rows   = [...tbody.children];
            const elA    = rows[a];
            const elB    = rows[b];
            if(!elA || !elB) {
                return;
            }
            const refB   = elB.nextSibling;
            tbody.insertBefore(elA, refB);
            tbody.insertBefore(elB, rows[a]);
        },
        clear: () => {
            tbody.innerHTML = '';
        },
        merge: (args) => {
            return mutations.push(args);
        },
    };

    $desc.data.subscribe((_, __, operations) => {
        const handler = mutations[operations.action];
        if(handler) {
            handler(operations.args);
        }
    });

    return tbody;
};

export const buildEmpty = ($desc, visibleColumns) => {
    if(!$desc.empty) return null;

    let colspan
    if(visibleColumns.__$Observable) {
        colspan = visibleColumns.transform((columns) => {
            return columns.length
                + ($desc.selectable ? 1 : 0)
                + ($desc.expandable ? 1 : 0)
        })
    } else {
        colspan = visibleColumns.length
            + ($desc.selectable ? 1 : 0)
            + ($desc.expandable ? 1 : 0);
    }

    const content = (typeof $desc.empty === 'function')
        ? $desc.empty()
        : Span({class: 'data-table-empty-text'}, $desc.empty);

    return ShowIf($desc.data?.is(items => items.length === 0), () => {
        return TRow(Td({ colspan }, [
            Div({ class: 'data-table-empty' }, content)
        ]));
    });
};

export const buildLoading = ($desc) => {

    return ShowIf($desc.loading, () => {
        return Div({ class: 'data-table-loading' }, Span({class: 'data-table-spinner'}))
    });
};


export const buildRow = ($desc, instance, visibleColumns, row) => {
    const cells = [];

    if($desc.selectable) {
        const $isSelected = $desc.$selectedRows.is((rows) => rows.includes(row));
        const checkbox = Input({type: 'checkbox', checked: $isSelected });
        checkbox
            .nd
            .onChange((e) => {
                if(e.target.checked) {
                    $desc.$selectedRows.push(row);
                } else {
                    $desc.$selectedRows.removeItem(row);
                }
                instance.emit('select', $desc.$selectedRows.val());
            });

        cells.push(
            ShowIf($desc.selectable,
                () => TBodyCell({class: 'data-table-td-checkbox'}, checkbox)
            )
        );
    }

    // Expandable
    let detailRow = null;
    if($desc.expandable) {
        const $isExpanded = $(false);
        const toggleBtn   = Span({class: 'data-table-expand-btn',},
            Switch($isExpanded, $desc.isExpandedIcon, $desc.isNotExpandedIcon)
        );

        toggleBtn.nd.onClick(() => {
            $isExpanded.toggle();
            if($isExpanded.val() && !detailRow) {
                detailRow = ShowIf($isExpanded, buildDetailRow($desc, visibleColumns, row));
                tr.parentNode.insertBefore(detailRow, tr.nextSibling);
            }
        });

        cells.push(TBodyCell({class: 'data-table-td-expand'}, toggleBtn));
    }

    const dynamicCells = ForEachArray(visibleColumns, (column) => {
        const $descCol = column.$description;
        const value = row[$descCol.key];
        const content = $descCol.render
            ? $descCol.render(value, row)
            : value ?? '';

        const classes = {};
        if($descCol.align) {
            if($descCol.align.__$Observable) {
                classes['_'] = $descCol.align.transform((v) => `is-align-${v}`);
            } else {
                classes[`is-align-${$descCol.align}`] = true;
            }
        }
        if($descCol.pinned) {
            if($descCol.pinned.__$Observable) {
                classes['__'] = $descCol.pinned.transform((v) => `is-pinned-${v}`);
            } else {
                classes[`is-pinned-${$descCol.pinned}`] = true;
            }
        }

        return TBodyCell({ class: classes, }, content)
    });

    cells.push(dynamicCells);

    const rowExtraProps = $desc.rowProps?.(row) || {};

    const tr = TRow({
        class: {
            'has-click':  !!$desc.onRowClick,
            'is-selected': $desc.$selectedRows.transform(rows => rows.includes(row)),
        },
        ...rowExtraProps,
    }, cells);

    if($desc.onRowClick) {
        tr.nd.onClick(() => $desc.onRowClick(row));
    }
    if($desc.onRowDoubleClick) {
        tr.nd.onDblClick(() => $desc.onRowDoubleClick(row));
    }
    if($desc.onRowHover) {
        tr.nd.onMouseEnter(() => $desc.onRowHover(row));
    }

    return tr;
};

export const buildDetailRow = ($desc, visibleColumns, row) => {
    let colspan;
    if(visibleColumns.__$Observable) {
        colspan = visibleColumns.transform((columns) => {
            return columns.length
                + ($desc.selectable ? 1 : 0)
                + ($desc.expandable ? 1 : 0);
        })
    } else {
        colspan = visibleColumns.length
            + ($desc.selectable ? 1 : 0)
            + ($desc.expandable ? 1 : 0);
    }

    const content = $desc.expandable(row);

    return TRow({class: 'data-table-detail-row'},
        TBodyCell({colspan, class: 'data-table-detail-cell'}, content)
    );
};
