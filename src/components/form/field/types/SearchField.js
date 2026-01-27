import StringField from "./StringField";

export default function SearchField(name, defaultConfig) {
    if(!(this instanceof SearchField)) {
        return new SearchField(name, defaultConfig);
    }

    StringField.call(this, name, 'search', defaultConfig);

    Object.assign(this.$description, {
        debounce: 300
    });
}

SearchField.defaultTemplate = null;

SearchField.use = function(template) {
    SearchField.defaultTemplate = template.searchField;
};

SearchField.prototype = Object.create(StringField.prototype);
SearchField.prototype.constructor = SearchField;

SearchField.prototype.debounce = function(ms) {
    this.$description.debounce = ms;
    return this;
};