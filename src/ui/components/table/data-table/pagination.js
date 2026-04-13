import {Div, Span} from "../../../../../elements";
import { $ } from "../../../../../index";
import {SelectField} from "../../../../components/form";
import {Pagination} from "../../../../components/pagination";

export const buildPagination = ({ pageInfo, pageSize, pageNav }) => {
    return Div({class: 'data-table-pagination'}, [
        pageInfo,
        Div({class: 'data-table-pagination-right'}, [pageSize, pageNav]),
    ]);
};

export const buildPageInfo = ($desc, instance) => {
    const pageInfo = $.computed((total, data, pageSize, page) => {
        total = total || data?.length || 0;
        const pages = Math.ceil(total / pageSize);
        return $desc.labels.results(total || 0, page || 0, pages || 0);
    }, [$desc.$total, $desc.data, $desc.$pageSize, $desc.$currentPage ]);

    return Span({class: 'data-table-page-info'}, pageInfo);
};

export const buildPageSize = ($desc, instance) => {
    if(!$desc.pageSizes?.length) {
        return null;
    }

    const select = SelectField({ class: 'data-table-page-size' })
        .model($desc.$pageSize)
        .options($desc.pageSizes)
        .onChange((value) => {
            const size = Number(value);
            $desc.$pageSize.set(size);
            $desc.$currentPage.set(1);
            instance.emit('page', 1, size);
        });

    return Div({class: 'data-table-page-size-wrapper'}, [
        Span({class: 'data-table-page-size-label'}, $desc.labels.rowsPerPage),
        select,
    ]);
};

export const buildPageNav = ($desc, instance) => {
    return Div({class: 'data-table-page-nav'}, [
        Pagination()
            .currentPage($desc.$currentPage)
            .totalItems($desc.$total)
            .pageSize($desc.$pageSize)
            .showFirstLast(true)
            .showPreviousNext(true)
            .onPageChange((page) => {
                instance.emit('page', page, $desc.$pageSize.val());
            })
    ]);
};