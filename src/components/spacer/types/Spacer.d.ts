import type { ValidChild } from '../../../../types/elements';
import type { BaseComponent } from '../../BaseComponent';
import type { GlobalAttributes } from '../../../../types/globals';

export type SpacerDescription = { type: 'spacer'; props: GlobalAttributes; };

export interface SpacerInterface extends BaseComponent {
    render(renderFn: (description: SpacerDescription, instance: SpacerInterface) => ValidChild): this;
}


export declare function Spacer(props?: Record<string, unknown>): SpacerInterface;
export declare namespace Spacer {


    function use(template: (description: SpacerDescription, instance: SpacerInterface) => ValidChild): void;


}
