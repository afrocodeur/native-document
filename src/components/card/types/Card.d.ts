import type { ValidChild } from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';
import type { BaseComponent } from '../../BaseComponent';

export type CardDescription = {
        [key: string]: unknown;
    };

export interface CardInterface extends BaseComponent {
    title(title: ValidChild): this;
    subtitle(subtitle: ValidChild): this;
    image(src: string, position?: 'top' | 'bottom' | 'left' | 'right'): this;
    content(content: ValidChild): this;
    variant(name: string): this;
    outlined(): this;
    elevated(): this;
    flat(): this;
    clickable(handler: (event: MouseEvent) => void): this;
    hoverable(): this;
    loading(isLoading?: boolean | ObservableItem<boolean>): this;
    horizontal(): this;
    onClick(handler: (event: MouseEvent) => void): this;
    onHover(handler: (event: MouseEvent) => void): this;
    clearActions(): this;
    action(label: ValidChild, callback: () => void): this;
    renderImage(renderFn: (desc: CardDescription, instance: CardInterface) => ValidChild): this;
    renderHeader(renderFn: (desc: CardDescription, instance: CardInterface) => ValidChild): this;
    renderContent(renderFn: (desc: CardDescription, instance: CardInterface) => ValidChild): this;
    renderFooter(renderFn: (desc: CardDescription, instance: CardInterface) => ValidChild): this;
    layout(layoutFn: (desc: CardDescription, instance: CardInterface) => ValidChild): this;
    render(renderFn: (desc: CardDescription, instance: CardInterface) => ValidChild): this;
}


export declare function Card(config?: Record<string, unknown>): CardInterface;
export declare namespace Card {


    function use(template: (description: CardDescription, instance: CardInterface) => ValidChild): void;


}
