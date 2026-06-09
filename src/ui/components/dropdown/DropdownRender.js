import {Div, Input, ForEachArray} from '../../../core/elements';
import PopoverRender from '../popover/PopoverRender';
import {createFilter} from '../../../core/utils/filters';
import {normalizeDropdownItem} from '../../../components/dropdown/helpers';

import './dropdown.css';
import {ariaTrigger} from '../../utils/aria';

export default function DropdownRender($desc, instance) {
    $desc.content = buildDropdownContent($desc, instance);
    ariaTrigger($desc.trigger, $desc.isOpen, 'listbox');


    return PopoverRender($desc, instance, 'dropdown');
}

const buildDropdownContent = ($desc, instance) => {
    const content = [];

    if($desc.searchable) {
        content.push(buildSearch($desc, instance));
    }

    if($desc.renderContent) {
        content.push(Div({class: 'dropdown-content'}, $desc.renderContent($desc, instance)));
    }
    else {
        let items = $desc.items;

        if($desc.filter) {
            if($desc.filterDependencies) {
                items = items.where({
                    _: createFilter($desc.filterDependencies, (...args) => {
                        return $desc.filter(...args);
                    }),
                });
            }
            else {
                items = items.where({
                    _: createFilter($desc.searchValue, (item, key) => {
                        return $desc.filter(item, key);
                    }),
                });
            }
        }

        const itemsContainer = Div({class: 'dropdown-items'},
            ForEachArray(items, (item) => {
                item = normalizeDropdownItem($desc.mapper ? $desc.mapper(item) : item);
                $desc.renderItem ? item.renderContent($desc.renderItem) : null;

                return item.nd.onClick(() => {
                    const desc = item.$description;
                    const emittedValue = desc.data ?? desc.value ?? desc;

                    instance.emit('itemClick', item, emittedValue);
                    instance.emit('change', emittedValue);

                    if($desc.closeOnSelect) {
                        instance.close();
                    }
                });
            }),
        );
        content.push(itemsContainer);
    }

    return content;
};

const buildSearch = ($desc, instance) => {
    if(!$desc.filter) {
        $desc.filter = (item, key) => {
            const description = item.$description;
            if(!description) {
                const content = item.content ?? item.label ?? item.label;
                const value = item.value;

                return content?.toLowerCase().includes(key.toLowerCase())
                    || value?.toLowerCase().includes(key.toLowerCase());
            }
            return description.value?.toLowerCase().includes(key.toLowerCase())
                || description.content?.toLowerCase().includes(key.toLowerCase());
        };
    }

    return Div({class: 'dropdown-search'},
        Input({
            class: 'dropdown-search-input',
            type: 'text',
            placeholder: $desc.searchPlaceholder || 'Search...',
            value: $desc.searchValue,
        }).nd.onInput((e) => instance.emit('search', e.target.value)),
    );
};