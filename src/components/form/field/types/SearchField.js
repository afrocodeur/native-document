import StringField from "./StringField";

export default function SearchField(name, props) {
    if(!(this instanceof SearchField)) {
        return new SearchField(name, props);
    }

    StringField.call(this, name, 'search', props);

    Object.assign(this.$description, {
        debounce: 300
    });
}

SearchField.defaultTemplate = null;

SearchField.use = function(template) {
    SearchField.defaultTemplate = template;
};

SearchField.prototype = Object.create(StringField.prototype);
SearchField.prototype.constructor = SearchField;

SearchField.prototype.debounce = function(ms) {
    this.$description.debounce = ms;
    return this;
};