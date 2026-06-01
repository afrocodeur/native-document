import {Div, ForEachArray} from '../../../core/elements';

import './pagination.css';

export default function PaginationRender($desc, instance) {
    const props = instance.getEditableProps();
    props.class.add('pagination');

    instance.$updatePages();

    const content = [];

    const $isFirstPage = $desc.currentPage.is(p => p <= 1);
    const $isLastPage = $desc.currentPage.is(p => p >= $desc.totalPages.val());

    if($desc.showFirstLast) {
        content.push(
            buildNavItem(
                '«',
                () => instance.first(),
                $desc,
                'renderFirst',
                $isFirstPage,
            ),
        );
    }

    if($desc.showPreviousNext) {
        content.push(
            buildNavItem(
                '‹',
                () => instance.previous(),
                $desc,
                'renderPrevious',
                $isFirstPage,
            ),
        );
    }

    content.push(buildPages($desc, instance));

    if($desc.showPreviousNext) {
        content.push(
            buildNavItem(
                '›',
                () => instance.next(),
                $desc,
                'renderNext',
                $isLastPage,
            ),
        );
    }

    if($desc.showFirstLast) {
        content.push(
            buildNavItem(
                '»',
                () => instance.last(),
                $desc,
                'renderLast',
                $isLastPage,
            ),
        );
    }

    return Div({ ...instance.resolveProps(), role: 'navigation', 'aria-label': 'Pagination' }, content);
}

const buildNavItem = (label, handler, $desc, renderKey, $isDisabled) => {
    const clickHandler = () => {
        if (!$isDisabled.val()) handler();
    };

    if($desc[renderKey]) {
        return $desc[renderKey](handler).nd.onClick(clickHandler);
    }

    return Div({ class: { 'pagination-item': true, 'is-nav': true, 'is-disabled': $isDisabled } }, label).nd.onClick(clickHandler);
};

const buildPages = ($desc, instance) => {
    return Div({class: 'pagination-pages'},
        ForEachArray($desc.pages, (page) => {
            if(page === '...') {
                return buildEllipsis($desc);
            }
            return buildPage(page, $desc, instance);
        }),
    );
};

const buildPage = (page, $desc, instance) => {
    if($desc.renderPage) {
        return $desc.renderPage(page, instance);
    }

    const isActive = $desc.currentPage.is(page);

    const el = Div({class: isActive.transform(a => 'pagination-item' + (a ? ' is-active' : ''))}, page);

    el.nd.onClick(() => instance.goToPage(page));

    return el;
};

const buildEllipsis = ($desc) => {
    if($desc.renderEllipsis) {
        return $desc.renderEllipsis();
    }

    return Div({class: 'pagination-item is-ellipsis'}, '...');
};