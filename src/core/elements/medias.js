import HtmlElementWrapper from '../wrappers/HtmlElementWrapper';

/**
 * Creates an `<audio>` element.
 * @type {function(AudioAttributes=, NdChild|NdChild[]=): HTMLAudioElement}
 */
export const Audio = HtmlElementWrapper('audio');

/**
 * Creates a `<video>` element.
 * @type {function(VideoAttributes=, NdChild|NdChild[]=): HTMLVideoElement}
 */
export const Video = HtmlElementWrapper('video');

/**
 * Creates a `<source>` element.
 * @type {function(SourceAttributes=): HTMLSourceElement}
 */
export const Source = HtmlElementWrapper('source');

/**
 * Creates a `<track>` element.
 * @type {function(TrackAttributes=): HTMLTrackElement}
 */
export const Track = HtmlElementWrapper('track');

/**
 * Creates a `<canvas>` element.
 * @type {function(CanvasAttributes=, NdChild|NdChild[]=): HTMLCanvasElement}
 */
export const Canvas = HtmlElementWrapper('canvas');

/**
 * Creates an `<svg>` element.
 * @type {function(SvgAttributes=, NdChild|NdChild[]=): SVGSVGElement}
 */
export const Svg = HtmlElementWrapper('svg');