import {Table, THead, TBody, TRow, THeadCell, TBodyCell, Span, ShowIf} from '../../../../core/elements';
import {classPropertyAccumulator} from "../../../../core/utils/property-accumulator";

import './simple-table.css';

export default function SimpleTableRender($desc, instance) {
    const props = instance.getEditableProps();
    props.class.add('simple-table');

    const visibleColumns = $desc.columns.filter(col =>
        col.$description.visible !== false
    );

    return Table(instance.resolveProps(), [
        $desc.noHeader ? null : buildHead($desc, visibleColumns),
        buildBody($desc, instance, visibleColumns),
    ]);
}

const buildGroupRow = ($desc) => {
    return TRow({},
        $desc.header.map(item => {
            if(item.isGroup) {
                const extraProps = $desc.headerProps?.(item) || {};
                return THeadCell({
                    colspan: item.$description.columns.length,
                    class:   item.$description.align ? `is-${item.$description.align}` : null,
                    ...extraProps,
                }, item.$description.header);
            }
            const extraProps = $desc.headerProps?.(item) || {};
            return THeadCell({
                rowspan: 2,
                class:   item.$description.align ? `is-${item.$description.align}` : null,
                ...extraProps,
            }, item.$description.header);
        })
    );
};

const buildHeaderRow = ($desc, visibleColumns) => {
    return TRow({},
        visibleColumns.map(col => {
            const extraProps = $desc.headerProps?.(col) || {};
            return THeadCell({
                class:   col.$description.align ? `is-${col.$description.align}` : null,
                colspan: col.$description.colspan || null,
                rowspan: col.$description.rowspan || null,
                ...extraProps,
            }, col.$description.header);
        })
    );
};

const buildHead = ($desc, visibleColumns) => {
    if($desc.hasGroups) {
        return THead({}, [
            buildGroupRow($desc),
            buildHeaderRow($desc, visibleColumns),
        ]);
    }
    return THead({}, buildHeaderRow($desc, visibleColumns));
};

const buildBody = ($desc, instance, visibleColumns) => {
    const tbody = TBody({}, buildEmpty($desc, visibleColumns));

    const createRow = (row) => buildRow($desc, visibleColumns, row);

    const mutations = {
        toFragment: (args) => {
            const fragment = document.createDocumentFragment();

            for(let i = 0, length = args.length; i < length; i++) {
                fragment.append(createRow(args[i]));
            }

            return fragment;
        },
        set: () => {
            mutations.clear()
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
            const [a, b]  = args;
            const children = tbody.children;
            const elA     = children[a];
            const elB     = children[b];
            if(!elA || !elB) {
                return;
            }
            const refB    = elB.nextSibling;
            tbody.insertBefore(elB, elA);
            tbody.insertBefore(elA, refB);
        },
        clear: () => {
            tbody.textContent = '';
        },
        merge: (args) => {
            return mutations.push(args);
        },
    };

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

    $desc.data.subscribe((data, _, operations) => {
        const handler = mutations[operations.action];
        if(handler) {
            handler(operations.args);
        }
    });

    return tbody;
};


const buildRow = ($desc, visibleColumns, row) => {
    const cells = [];
    for(let i = 0, length = visibleColumns.length; i < length; i++) {
        const column = visibleColumns[i];

        const key     = column.$description.key;
        const value   = row[key];
        const content = column.$description.render
            ? column.$description.render(value, row)
            : value ?? '';

        const extraProps = column.$description.props || $desc.cellProps?.(value, row, column) || {};
        const classProperty = classPropertyAccumulator(extraProps.class || {});
        if(column.$description.align) {
            classProperty.add(`is-${column.$description.align}`)
        }
        const cell = TBodyCell({ ...extraProps, class: classProperty.value() },
            content
        );
        if(column.$description.onClick) {
            cell.nd.onClick((event) => column.$description.onClick(row, event));
        }
        cells.push(cell);
    }

    const rowExtraProps = $desc.rowProps?.(row) || {};
    const classProperty = classPropertyAccumulator(rowExtraProps.class || {});
    classProperty.add({'has-click': !!$desc.onRowClick})

    const tr = TRow({ ...rowExtraProps, class: classProperty.value()}, cells);

    if($desc.onRowClick) {
        tr.nd.onClick(() => $desc.onRowClick(row));
    }

    return tr;
};

const buildEmpty = ($desc, visibleColumns) => {
    if(!$desc.empty) {
        return null;
    }

    const content = typeof $desc.empty === 'function'
        ? $desc.empty()
        : Span({class: 'simple-table-empty-text'}, $desc.empty);

    const row = TRow({class: 'simple-table-empty'}, [
        TBodyCell({colspan: visibleColumns.length, class: 'simple-table-empty-cell'}, content),
    ]);
    if($desc.data?.__$isObservableArray) {
        return ShowIf($desc.data.is((items) => items.length === 0), row);
    }
    return row;
};