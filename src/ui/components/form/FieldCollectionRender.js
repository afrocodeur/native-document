import {Div, Button, ForEachArray} from '../../../../elements';
import { $ } from '../../../core/data/Observable';

import './field-collection.css';

export default function FieldCollectionRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('field-collection');

    const $items     = $desc.value;
    const $itemsMap  = new WeakMap();

    const buildItemFields = (item) => {
        if(!$desc.fieldBuilder) return {};
        const fields = $desc.fieldBuilder();

        // Binder chaque field à la propriété correspondante de l'item
        Object.entries(fields).forEach(([key, field]) => {
            const prop = item[key];
            if(prop?.__$isObservable) {
                field.model(prop);
            }
        });

        return fields;
    };

    const buildActions = (item, $index) => {
        const $isFirst = $index.transform(i => i === 0);
        const $isLast  = $.computed(() => ($index.val() === $items.val().length - 1), [$index, $items]);

        return {
            index:     $index,
            isFirst:   $isFirst,
            isLast:    $isLast,
            item,
            remove: () => {
                instance.removeItem(item);
            },
            moveUp: () => {
                const i   = $items.indexOf(item);
                if(i <= 0) {
                    return;
                }
                $items.swap(i-1, i);
            },
            moveDown: () => {
                const i   = $items.indexOf(item);
                if(i >= $items.length - 1) {
                    return;
                }
                $items.swap(i, i+1);
            },
            duplicate: () => {
                const newItem = item.clone();
                $items.push(newItem);
                instance.emit('add', newItem);
            },
        };
    };

    const buildItem = (item, $index) => {
        if(!$itemsMap.has(item)) {
            const fields  = buildItemFields(item);
            const actions = buildActions(item, $index);
            $itemsMap.set(item, { fields, actions });
        }

        const { fields, actions } = $itemsMap.get(item);

        let el;
        if($desc.renderItem) {
            el = $desc.renderItem(fields, actions);
        } else {
            el = Div({class: 'field-collection-item'}, [
                ...Object.values(fields),
                Button('×')
                    .small()
                    .danger()
                    .nd
                    .onClick(actions.remove),
            ]);
        }

        if($desc.transition) {
            el.nd.transition($desc.transition);
        }

        return el;
    };

    const buildAddButton = () => {
        if(!$desc.renderAdd) {
            return null;
        }
        return Div({ class: 'field-collection-actions'},
            $desc.renderAdd()
                .nd
                .onClick(() => instance.add()),
        );
    };

    return Div(instance.resolveProps(), [
        Div({class: 'field-collection-list'},
            ForEachArray($items, buildItem),
        ),
        buildAddButton(),
    ]);
}