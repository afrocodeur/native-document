import NativeFetch from './src/fetch/NativeFetch';
import * as Cache from './src/core/utils/cache';
import * as filters from './src/core/utils/filters/index';
import {classPropertyAccumulator, cssPropertyAccumulator} from './src/core/utils/property-accumulator';

const Service = Cache;

export {
    NativeFetch,
    Cache,
    Service,
    filters,
    classPropertyAccumulator,
    cssPropertyAccumulator
};