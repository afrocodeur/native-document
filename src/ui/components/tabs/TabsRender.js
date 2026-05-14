import {Div, ForEachArray, Match, Nav, ShowIf, Span} from '../../../core/elements';
import { $ } from '../../../core/data/Observable';
import {Button} from "../../../components/button";
import {Dropdown} from '../../../components/dropdown';
import {nextTick} from "../../../core/utils/helpers";

import './tabs.css';

export default function TabsRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('tabs');
    props.class.add('is-appearance-' + $desc.tabAppearance);
    props.class.add('is-align-' + $desc.tabsAlignment);
    props.class.add('is-overflow-' + $desc.overflow);

    if($desc.stickyHeader) {
        props.class.add('has-sticky-header');
    }
    if($desc.navigationBarPosition) {
        props.class.add('is-navigation-at-' + $desc.navigationBarPosition);
    }

    if($desc.closable) {
        props.class.add('is-closable');
    }

    const tabKeys = Object.keys($desc.tabs);

    if(tabKeys.length && !$desc.active.val()) {
        $desc.active.set(tabKeys[0]);
    }

    const $keys  = $.array(tabKeys);
    const panels = Match($desc.active, buildContentPanels($desc, instance, tabKeys));

    instance.onCloseTab((key) => {
        panels.remove(key);
        $keys.removeItem(key);
    });

    instance.onAddTab((tab) => {
        $keys.push(tab.key);
        panels.add(tab.key, Div({ role: 'tabpanel', class: 'tabs-panel' }, tab.content));
        if($desc.focusOnNewTab) {
            $desc.active.set(tab.key);
        }
    });

    return Div(instance.resolveProps(), [
        Div({class: 'tabs-nav'}, buildNavContent($keys, $desc, instance)),
        Div({class: 'tabs-content'}, panels),
    ]);
}

const buildNavContent = ($keys, $desc, instance) => {
    const tabItemWrapper = Nav({class: 'tabs-nav-wrap', role: 'tablist' },
        ForEachArray($keys, (key) => buildTab(key, $keys, $desc, instance))
    );

    const navOptionsContent = [];

    if($desc.addPlusButton) {
        const btnPlusButton = $desc.renderPlusButton
            ? $desc.renderPlusButton($desc, instance)
            : Button('+').ghost();

        navOptionsContent.push(
            btnPlusButton
                .nd.onClick(() => {
                    $desc.addPLusCallback && $desc.addPLusCallback($desc, instance);
                })
        );
    }

    if($desc.overflow) {
        navOptionsContent.push(
            Div({class: 'tab-nav-overflow'}, buildOverflowMenu(tabItemWrapper, $keys, $desc, instance))
        );
    }

    return [
        tabItemWrapper,
        Div({ class: 'tab-nav-options'}, navOptionsContent)
    ];
};

const buildContentPanels = ($desc, instance, keys) => {
    const panels = {};

    for(const key of keys) {
        const tab    = $desc.tabs[key];
        panels[key] = Div({ role: 'tabpanel', class: 'tabs-panel' }, tab.content);
    }

    return panels;
};

const buildOverflowMenu = (tabItemWrapper, $keys, $desc, instance) => {
    const $overflowKeys = $.array([]);

    const isVerticalNavigationBar = $desc.navigationBarPosition === 'left' || $desc.navigationBarPosition === 'right';
    const checkOverflowHandler = nextTick(() => {
        const wrapperRect = tabItemWrapper.getBoundingClientRect();
        const tabs        = [...tabItemWrapper.children];
        const overflow    = [];

        if(isVerticalNavigationBar) {
            for(const tab of tabs) {
                const rect = tab.getBoundingClientRect();
                if(rect.top < wrapperRect.top || rect.bottom > wrapperRect.bottom) {
                    overflow.push(tab.dataset.key);
                }
            }
        } else {
            for(const tab of tabs) {
                const rect = tab.getBoundingClientRect();
                if(rect.left < wrapperRect.left || rect.right > wrapperRect.right) {
                    overflow.push(tab.dataset.key);
                }
            }
        }

        $overflowKeys.set(overflow);
    });
    const observer = new ResizeObserver(checkOverflowHandler);

    instance.onChange(checkOverflowHandler);
    tabItemWrapper.addEventListener('scroll', checkOverflowHandler);

    observer.observe(tabItemWrapper);
    const $hasOverflowItem = $overflowKeys.is(values => values.length > 0);

    return ShowIf($hasOverflowItem, () => {
        return Dropdown()
            .bind($overflowKeys, (key) => {
                const tab = $desc.tabs[key];
                return { content: tab.label, icon: tab.icon || null, value: key};
            })
            .atBottomTrailing()
            .trigger(Button('▾').ghost().small())
            .onChange((key) => $desc.active.set(key))
    });
};

const buildTab = (key, $keys, $desc, instance) => {
    const tab = $desc.tabs[key];

    if($desc.renderTab) {
        return $desc.renderTab(tab, key, instance);
    }

    const isActive = $desc.active.is(key);

    const tabEl = Div({
        class: { 'tabs-tab': true, 'is-active': isActive },
        'aria-selected': isActive,
        'data-key': key,
        draggable: true,
        role: 'tab'
    }, buildTabContent(tab, $desc, instance));


    tabEl
        .nd
        .onClick(() => {
            instance.emit('tabClick', key, tab);
            instance.emit('beforeChange', key);
            $desc.active.set(key);
            instance.emit('change', key, tab);
        });

    if($desc.sortable) {
        tabEl
            .nd
            .onDragStart((e) => {
                e.dataTransfer.setData('text/plain', key);
                setTimeout(() => tabEl.classList.add('is-dragging'), 0);
            })
            .onDragEnd(() => {
                tabEl.classList.remove('is-dragging');
                tabEl.classList.remove('is-drag-over');
            })
            .onDragOver((e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                tabEl.classList.add('is-drag-over');
            })
            .onDragLeave(() => {
                tabEl.classList.remove('is-drag-over');
            })
            .onDrop((e) => {
                const draggedKey = e.dataTransfer.getData('text/plain');
                tabEl.classList.remove('is-drag-over');
                $keys.swapItems(draggedKey, key);
            });
    }

    return tabEl;
};

const buildTabContent = (tab, $desc, instance) => {
    const content = [];

    if(tab.icon) {
        content.push(Span({class: 'tabs-tab-icon'}, tab.icon));
    }

    content.push(Span({class: 'tabs-tab-label'}, tab.label));

    if($desc.closable) {
        const closeButton = $desc.renderCloseButton
            ? $desc.renderCloseButton(tab)
            : Span({ class: 'tabs-tab-closer' }, '×');

        content.push(
            closeButton
                .nd.onClick((e) => {
                e.stopPropagation();
                instance.closeTab(tab.key);
            })
        );
    }

    return content;
};