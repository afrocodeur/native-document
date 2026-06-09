import {Div, Span, Switch, ForEachArray} from '../../../../../elements';
import { $, Observable } from '../../../../core/data/Observable';
import {Tooltip} from '../../../../components/tooltip';
import './slider.css';

export default function SliderRender($desc, instance) {
    const props = instance.getEditableProps();

    props.class.add('slider');
    // [a11y] aria-valuemin, aria-valuemax
    props['aria-valuemin'] = String($desc.min ?? 0);
    props['aria-valuemax'] = String($desc.max ?? 100);
    props.class.add({
        'is-vertical':  $desc.vertical,
        'is-reverse':   $desc.reverse,
        'is-disabled':  $desc.disabled,
        'is-readonly':  $desc.readonly,
        [`is-${$desc.variant}`]: !!$desc.variant,
    });

    if($desc.height) {
        props.style.add({ '--slider-vertical-height': $desc.height + 'px'});
    }
    if($desc.width) {
        props.style.add({ '--slider-horizontal-width': $desc.width + 'px'});
    }

    if($desc.trackColor) {
        props.style.add({ '--slider-track-color': $desc.trackColor });
    }

    return Div(instance.resolveProps(), [
        buildSlider($desc, instance),
    ]);
}

const buildSlider = ($desc, instance) => {
    if($desc.range?.__$Observable) {
        return Switch($desc.range,
            () => buildRangeSlider($desc, instance),
            () => buildSingleSlider($desc, instance),
        );
    }
    if($desc.range) {
        return buildRangeSlider($desc, instance);
    }
    return buildSingleSlider($desc, instance);
};

const buildSingleSlider = ($desc, instance) => {
    if(!$desc.value?.__$isObservable) {
        $desc.value = $($desc.defaultValue ?? $desc.min ?? 0);
    }

    const $percentValue = $desc.value.transform(v => toPercent(v, $desc));

    const track   = buildTrack($desc, $percentValue, null);
    const thumb   = buildThumb($desc, instance, $percentValue, $desc.value, false);
    const marks   = $desc.showMarks ? buildMarks($desc) : null;
    const valueEl = $desc.showValue ? buildValueDisplay($desc.value, $desc) : null;

    const sliderEl = Div({class: 'slider-inner'}, [track, thumb, marks]);

    setupDrag($desc, instance, sliderEl, $desc.value, false, null);

    return Div({class: 'slider-wrapper'}, [sliderEl, valueEl]);
};

const buildRangeSlider = ($desc, instance) => {
    if(!$desc.valueStart?.__$isObservable) {
        $desc.valueStart = $($desc.min ?? 0);
    }
    if(!$desc.valueEnd?.__$isObservable) {
        $desc.valueEnd = $($desc.max ?? 100);
    }

    const $pctStart = $desc.valueStart.transform(v => toPercent(v, $desc));
    const $pctEnd   = $desc.valueEnd.transform(v => toPercent(v, $desc));

    const track      = buildRangeTrack($desc, $pctStart, $pctEnd);
    const thumbStart = buildThumb($desc, instance, $pctStart, $desc.valueStart, 'start');
    const thumbEnd   = buildThumb($desc, instance, $pctEnd,   $desc.valueEnd,   'end');
    const marks      = $desc.showMarks ? buildMarks($desc) : null;

    const sliderEl = Div({class: 'slider-inner'}, [track, thumbStart, thumbEnd, marks].filter(Boolean));

    setupDrag($desc, instance, sliderEl, $desc.valueStart, 'start', thumbStart);
    setupDrag($desc, instance, sliderEl, $desc.valueEnd,   'end',   thumbEnd);

    return Div({ class: 'slider-wrapper' }, [sliderEl]);
};

const buildTrack = ($desc, $pct) => {
    const isVertical = $desc.vertical;
    let style;

    if(isVertical?.__$Observable) {
        // TODO: @DIM trouver un meilleur DX pour ce dernier
        const width = Observable.computed(() => {
            if(isVertical.val()) {
                return false;
            }
            return $pct.val()+'%';
        }, [isVertical, $pct]);
        const height = Observable.computed(() => {
            if(!isVertical.val()) {
                return false;
            }
            return $pct.val()+'%';
        }, [isVertical, $pct]);

        style = {
            width,
            height,
        };

    } else {
        if(isVertical) {
            style = {
                height: $pct.transform((v) => v+'%'),
            };
        } else {
            style = {
                width: $pct.transform((v) => v+'%'),
            };
        }
    }

    const fill = Div({
        class: 'slider-fill',
        style,
    });

    return Div({class: 'slider-track'}, fill);
};

const buildRangeTrack = ($desc, $pctStart, $pctEnd) => {
    const isVertical = $desc.vertical;

    const $fillSize = Observable.computed(() => {
        const s = toPercent($desc.valueStart.val() ?? $desc.min, $desc);
        const e = toPercent($desc.valueEnd.val()   ?? $desc.max, $desc);
        return (e - s) + '%';
    }, [$desc.valueStart, $desc.valueEnd]);

    const $fillPos = $pctStart.transform(p => p + '%');

    let style;
    if(isVertical?.__$Observable) {
        const positionDependencies = [isVertical, $pctStart];
        const sizeDependencies = [isVertical, $desc.valueStart, $desc.valueEnd];

        const bottom = $.computed(() => isVertical.val() ? $fillPos.val()  : false, positionDependencies);
        const height = $.computed(() => isVertical.val() ? $fillSize.val() : false, sizeDependencies);
        const left   = $.computed(() => isVertical.val() ? false : $fillPos.val(),  positionDependencies);
        const width  = $.computed(() => isVertical.val() ? false : $fillSize.val(), sizeDependencies);

        style = {bottom, height, left, width};
    } else {
        style = isVertical
            ? {bottom: $fillPos, height: $fillSize}
            : {left:   $fillPos, width:  $fillSize};
    }

    const fill = Div({class: 'slider-fill', style});

    return Div({class: 'slider-track'}, fill);
};

const buildThumb = ($desc, instance, $pct, $value, role) => {
    const isVertical = $desc.vertical;

    const thumbContent = $desc.renderThumb
        ? $desc.renderThumb($value, instance)
        : Div({class: 'slider-thumb-inner'});

    let style, position;
    if(isVertical?.__$Observable) {
        // TODO: @DIM trouver un meilleur DX pour ce dernier
        const pos = (verticalMode) => Observable.computed(() => {
            return (isVertical.val() === verticalMode)
                ? `calc(${ $pct.val() }% - 9px)`
                : false;
        }, [isVertical, $pct]);

        const bottom = pos(true);
        const left   = pos(false);

        position = isVertical.transform((v) => v ? 'right' : 'top');
        style = {
            left,
            bottom,
        };

    } else {
        if(isVertical) {
            position = 'right';
            style = {
                bottom: $pct.transform(p => `calc(${p}% - 9px)`),
            };
        } else {
            position = 'top';
            style = {
                left: $pct.transform(p => `calc(${p}% - 9px)`),
            };
        }
    }

    // TODO: @DIM no focus element available for Div Element
    // thumb.nd.onKeyDown((e) => { ... });

    const thumb = Div({
        class: {'slider-thumb': true, 'is-start': role === 'start', 'is-end': role === 'end'},
        style,
        tabindex: $desc.disabled ? -1 : 0,
    }, [thumbContent]);

    if($desc.showTooltip) {
        const tooltipContent = $desc.renderTooltip
            ? $desc.renderTooltip($value)
            : $desc.tooltipFormat
                ? $value.transform($desc.tooltipFormat)
                : $value.transform(v => String(Math.round(v)));

        return thumb.nd.tooltip(Tooltip(tooltipContent)
            .position(position)
            .updatePositionOn($pct));
    }

    return thumb;
};

const buildValueDisplay = ($value, $desc) => {
    const formatted = $desc.tooltipFormat
        ? $value.transform($desc.tooltipFormat)
        : $value.transform(v => String(Math.round(v)));
    return Span({class: 'slider-value'}, formatted);
};

const buildMarks = ($desc) => {
    const marks = $desc.marks || [];
    const min   = $desc.min ?? 0;
    const max   = $desc.max ?? 100;

    if(!marks.length) return null;

    return Div({class: 'slider-marks'},
        ForEachArray(marks, (mark) => {
            const pct = ((mark.value - min) / (max - min)) * 100;

            let style;
            if($desc.vertical?.__$Observable) {
                style = {
                    bottom: $desc.vertical.transform(v => v ? pct + '%' : false),
                    left:   $desc.vertical.transform(v => v ? false : pct + '%'),
                };
            } else {
                style = $desc.vertical ? {bottom: pct + '%'} : {left: pct + '%'};
            }

            return Div({
                class: 'slider-mark',
                style,
            }, [
                Div({class: 'slider-mark-dot'}),
                mark.label ? Span({class: 'slider-mark-label'}, mark.label) : null,
            ].filter(Boolean));
        }),
    );
};

const setupDrag = ($desc, instance, sliderEl, $value, role, thumbEl) => {
    const isNotEditable = () => {
        return $desc.disabled?.valueOf() || $desc.readonly?.valueOf();
    };

    const onMove = (clientX, clientY) => {
        const rect   = sliderEl.getBoundingClientRect();
        const isVert = $desc.vertical?.valueOf();
        const raw    = isVert
            ? 1 - (clientY - rect.top)  / rect.height
            : (clientX - rect.left) / rect.width;

        const clamped = Math.max(0, Math.min(1, raw));
        const min     = $desc.min ?? 0;
        const max     = $desc.max ?? 100;
        const step    = $desc.step || 1;
        const raw_val = min + clamped * (max - min);
        const stepped = Math.round(raw_val / step) * step;

        setValue($desc, instance, $value, stepped, role);
    };

    const onMouseMove = (e) => onMove(e.clientX, e.clientY);
    const onMouseUp   = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup',   onMouseUp);
        instance.emit('complete', $value.val());
    };

    const targetEl = thumbEl || sliderEl;

    targetEl.nd.onMouseDown((e) => {
        if(isNotEditable()) return;
        e.preventDefault();
        e.stopPropagation();
        onMove(e.clientX, e.clientY);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup',   onMouseUp);
    });

    const onTouchMove = (e) => {
        const t = e.touches[0];
        onMove(t.clientX, t.clientY);
    };
    const onTouchEnd = () => {
        document.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('touchend',  onTouchEnd);
        instance.emit('complete', $value.val());
    };

    targetEl.nd.onTouchStart((e) => {
        if(isNotEditable()) return;
        const touch = e.touches[0];
        onMove(touch.clientX, touch.clientY);
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend',  onTouchEnd);
    });
};

const setValue = ($desc, instance, $value, val, role) => {
    const min     = $desc.min ?? 0;
    const max     = $desc.max ?? 100;
    const clamped = Math.max(min, Math.min(max, val));

    if(role === 'start' && $desc.valueEnd?.__$isObservable) {
        const end = $desc.valueEnd.val() ?? max;
        if(clamped > end) return;
    }
    if(role === 'end' && $desc.valueStart?.__$isObservable) {
        const start = $desc.valueStart.val() ?? min;
        if(clamped < start) return;
    }

    if($desc.snapToMarks && $desc.marks?.length) {
        const closest = $desc.marks.reduce((prev, curr) =>
            Math.abs(curr.value - clamped) < Math.abs(prev.value - clamped) ? curr : prev,
        );
        $value.set(closest.value);
        instance.emit('change', closest.value);
        return;
    }

    $value.set(clamped);
    instance.emit('change', clamped);
};

const toPercent = (value, $desc) => {
    const min = $desc.min ?? 0;
    const max = $desc.max ?? 100;
    return ((value - min) / (max - min)) * 100;
};