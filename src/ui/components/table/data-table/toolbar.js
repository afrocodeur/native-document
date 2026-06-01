import {Div, Input, Span} from '../../../../../elements';
import {Button} from '../../../../components/button';
import {SelectField} from '../../../../components/form';

export const buildToolbar = ({ search, filters, exportBtn, columnsBtn }) => {
    return Div({class: 'data-table-toolbar'}, [
        Div({class: 'data-table-toolbar-left'}, [search, filters]),
        Div({class: 'data-table-toolbar-right'}, [exportBtn, columnsBtn]),
    ]);
};

export const buildSearch = ($desc, instance) => {
    if(!$desc.searchable) {
        return null;
    }

    return Div({class: 'data-table-search-wrapper'}, [
        Span({class: 'data-table-search-icon'}, $desc.searchIcon),
        Input({
            class:       'data-table-search',
            type:        'text',
            placeholder: $desc.labels.searchPlaceholder,
            value:       $desc.$search,
        }).nd.onInput((e) => instance.emit('search', e.target.value)),
    ]);
};

export const buildFiltersBtn = ($desc, instance) => {
    if(!$desc.filterable) {
        return null;
    }

    const btn = Button($desc.labels.filters)
        .secondary()
        .small();

    btn.nd.onClick(() => instance.emit('openFilters'));

    return btn;
};

export const buildExportBtn = ($desc, instance) => {
    if(!$desc.exports?.length) return null;

    if($desc.exports.length === 1) {
        const btn = Button($desc.labels.export)
            .secondary()
            .small();

        return btn.nd.onClick(() => instance.emit('export', $desc.exports[0].format));
    }

    return SelectField()
        .placeholder($desc.labels.export)
        .options($desc.exports.map((item) => ({ label: item.label, value: item.format })))
        .onChange((value) => instance.emit('export', value));
};

export const buildColumnsBtn = ($desc, instance) => {
    const btn = Button($desc.labels.columns)
        .secondary()
        .small();

    btn.nd.onClick(() => instance.emit('openColumns'));

    return btn;
};