import {Div, Span} from "../../../../../elements";
import {Button} from "../../../../components/button";
import {ShowIf} from "../../../../core/elements";

export const buildBulkActions = ({bulkCount, bulkButtons}, $desc, instance) => {
    if(!$desc.bulkActions?.length) return null;

    return ShowIf($desc.$selectedRows.is(items => items.length > 0), () => {
        return Div({class: 'data-table-bulk'}, [bulkCount, bulkButtons]);
    });
};

export const buildBulkCount = ($desc, instance) => {
    return Span({ class: 'data-table-bulk-count' },
        $desc.$selectedRows.transform(rows => $desc.labels.selected(rows.length))
    );
};

export const buildBulkButtons = ($desc, instance) => {
    if(!$desc.bulkActions?.length) return null;

    return Div({class: 'data-table-bulk-buttons'},
        $desc.bulkActions.map(action => {
            let btn = action.btn;
            if(!btn) {
                btn = Button(action.label).small();
                if(action.danger) {
                    btn.danger();
                }
            }
            btn.nd.onClick(() => action.onClick($desc.$selectedRows.val()));
            return btn;
        })
    );
};