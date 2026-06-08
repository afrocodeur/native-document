import type { ValidChild }     from '../../../../types/elements';
import type { ObservableItem } from '../../../../types/observable';

type IconVariant = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone' | string;
type IconSize    = 'small' | 'medium' | 'large' | 'extraLarge' | number;

export interface IconDefaultConfigs {
    variant?: IconVariant;
    size?:    IconSize;
    color?:   string;
    weight?:  string;
}

export interface IconDescription {
    name:    string;
    variant: IconVariant | null;
    color:   string | null;
    weight:  string | null;
    size:    IconSize | null;
}

export interface IconInstance {
    $description: IconDescription;

    variant(variant: IconVariant): this;
    thin(): this;
    light(): this;
    regular(): this;
    bold(): this;
    fill(): this;
    duotone(): this;

    weight(weight: string): this;

    size(size: IconSize): this;
    small(): this;
    medium(): this;
    large(): this;
    extraLarge(): this;

    color(color: string | ObservableItem<string>): this;
}

export declare function Icon(name: string, props?: Partial<IconDescription>): IconInstance;

export declare namespace Icon {
    let defaultTemplate: ((description: IconDescription, instance: IconInstance) => ValidChild) | null;
    let defaultConfigs:  IconDefaultConfigs | null;

    function use(
        template: (description: IconDescription, instance: IconInstance) => ValidChild,
        defaultConfigs?: IconDefaultConfigs
    ): void;

    // Icon.{name} getters - each access returns a fresh IconInstance
    const add: IconInstance;
    const alignCenter: IconInstance;
    const alignJustify: IconInstance;
    const alignLeft: IconInstance;
    const alignRight: IconInstance;
    const api: IconInstance;
    const areaChart: IconInstance;
    const arrowDown: IconInstance;
    const arrowLeft: IconInstance;
    const arrowRight: IconInstance;
    const arrowUp: IconInstance;
    const attachment: IconInstance;
    const back: IconInstance;
    const bank: IconInstance;
    const barChart: IconInstance;
    const barcode: IconInstance;
    const bell: IconInstance;
    const bold: IconInstance;
    const bug: IconInstance;
    const calendar: IconInstance;
    const camera: IconInstance;
    const check: IconInstance;
    const checkCircle: IconInstance;
    const chevronDown: IconInstance;
    const chevronLeft: IconInstance;
    const chevronRight: IconInstance;
    const chevronUp: IconInstance;
    const clock: IconInstance;
    const close: IconInstance;
    const cloud: IconInstance;
    const cloudDownload: IconInstance;
    const cloudUpload: IconInstance;
    const code: IconInstance;
    const collapse: IconInstance;
    const comment: IconInstance;
    const compass: IconInstance;
    const copy: IconInstance;
    const creditCard: IconInstance;
    const database: IconInstance;
    const dislike: IconInstance;
    const document: IconInstance;
    const dollar: IconInstance;
    const download: IconInstance;
    const drag: IconInstance;
    const edit: IconInstance;
    const error: IconInstance;
    const euro: IconInstance;
    const expand: IconInstance;
    const externalLink: IconInstance;
    const eye: IconInstance;
    const eyeOff: IconInstance;
    const file: IconInstance;
    const filter: IconInstance;
    const fire: IconInstance;
    const flag: IconInstance;
    const folder: IconInstance;
    const fontColor: IconInstance;
    const forward: IconInstance;
    const frown: IconInstance;
    const fullscreen: IconInstance;
    const fullscreenExit: IconInstance;
    const gift: IconInstance;
    const global: IconInstance;
    const grid: IconInstance;
    const heart: IconInstance;
    const help: IconInstance;
    const highlight: IconInstance;
    const home: IconInstance;
    const image: IconInstance;
    const indent: IconInstance;
    const info: IconInstance;
    const italic: IconInstance;
    const key: IconInstance;
    const like: IconInstance;
    const lineChart: IconInstance;
    const link: IconInstance;
    const list: IconInstance;
    const loading: IconInstance;
    const location: IconInstance;
    const lock: IconInstance;
    const mail: IconInstance;
    const map: IconInstance;
    const medal: IconInstance;
    const menu: IconInstance;
    const message: IconInstance;
    const more: IconInstance;
    const mute: IconInstance;
    const notification: IconInstance;
    const orderedList: IconInstance;
    const outdent: IconInstance;
    const pause: IconInstance;
    const percentage: IconInstance;
    const phone: IconInstance;
    const pieChart: IconInstance;
    const play: IconInstance;
    const print: IconInstance;
    const qrCode: IconInstance;
    const redo: IconInstance;
    const refresh: IconInstance;
    const remove: IconInstance;
    const resize: IconInstance;
    const robot: IconInstance;
    const rocket: IconInstance;
    const safety: IconInstance;
    const save: IconInstance;
    const scan: IconInstance;
    const scissors: IconInstance;
    const search: IconInstance;
    const settings: IconInstance;
    const share: IconInstance;
    const shoppingCart: IconInstance;
    const smile: IconInstance;
    const sort: IconInstance;
    const sound: IconInstance;
    const star: IconInstance;
    const stop: IconInstance;
    const strikethrough: IconInstance;
    const success: IconInstance;
    const table: IconInstance;
    const tag: IconInstance;
    const tags: IconInstance;
    const thunder: IconInstance;
    const tool: IconInstance;
    const trophy: IconInstance;
    const underline: IconInstance;
    const undo: IconInstance;
    const unlock: IconInstance;
    const unorderedList: IconInstance;
    const upload: IconInstance;
    const user: IconInstance;
    const userCircle: IconInstance;
    const users: IconInstance;
    const video: IconInstance;
    const wallet: IconInstance;
    const warning: IconInstance;
}