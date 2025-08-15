

/**
 *
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
function HtmlElementPreventEventsWrapper(element) {
    const events = {};
    return new Proxy(events, {
        get(target, property) {
            if(events[property]) {
                return events[property];
            }
            events[property] = function(callback) {
                element.addEventListener(property.toLowerCase(), function(event) {
                    event.preventDefault();
                    callback.apply(this, [event]);
                });
                return element
            };
            return events[property];
        },
        set(target, property, newValue, receiver) {
            //...
            this.get(target, property)(newValue);
            return element;
        }
    });
}

/**
 *
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
export default function HtmlElementEventsWrapper(element) {
    const events = {};
    return new Proxy(events, {
        get(target, property) {
            if(events[property]) {
                return events[property];
            }
            if(property === 'prevent') {
                events[property] = HtmlElementPreventEventsWrapper(element);
                return events[property];
            }
            if(property === 'removeAll') {

                return;
            }
            events[property] = function(callback) {
                element.addEventListener(property.toLowerCase(), callback);
                return element
            };
            return events[property];
        },
        set(target, property, newValue, receiver) {
            //...
            this.get(target, property)(newValue);
            return element;
        }
    });
}