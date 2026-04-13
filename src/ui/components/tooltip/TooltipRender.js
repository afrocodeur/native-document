import PopoverRender from "../popover/PopoverRender";

import './tooltip.css';

export default function TooltipRender($desc, instance) {

    return PopoverRender($desc, instance, 'tooltip');
}