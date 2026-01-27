import StringField from "./types/StringField";
import EmailField from "./types/EmailField";
import PasswordField from "./types/PasswordField";
import NumberField from "./types/NumberField";
import TextAreaField from "./types/TextAreaField";
import CheckboxField from "./types/CheckboxField";
import RadioField from "./types/RadioField";
import SelectField from "./types/SelectField";
import HiddenField from "./types/HiddenField";
import FileField from "./types/FileField";
import DateField from "./types/DateField";
import TimeField from "./types/TimeField";
import TelField from "./types/TelField";
import UrlField from "./types/UrlField";
import ColorField from "./types/ColorField";
import RangeField from "./types/RangeField";
import ImageField from "./types/ImageField";
import CheckboxGroupField from "./types/CheckboxGroupField";
import AutocompleteField from "./types/AutocompleteField";

import Field from "./Field";
import FieldCollection from "./FieldCollection";


Field.string = function(name, defaultConfig) {
    return new StringField(name, 'text', defaultConfig);
};

Field.text = function(name, defaultConfig) {
    return new StringField(name, 'text', defaultConfig);
};

Field.email = function(name, defaultConfig) {
    return new EmailField(name, defaultConfig);
};

Field.password = function(name, defaultConfig) {
    return new PasswordField(name, defaultConfig);
};

Field.number = function(name, defaultConfig) {
    return new NumberField(name, 'number', defaultConfig);
};

Field.textarea = function(name, defaultConfig) {
    return new TextAreaField(name, defaultConfig);
};

Field.checkbox = function(name, defaultConfig) {
    return new CheckboxField(name, defaultConfig);
};

Field.radio = function(name, options, defaultConfig) {
    return new RadioField(name, options, defaultConfig);
};

Field.select = function(name, options, defaultConfig) {
    return new SelectField(name, options, defaultConfig);
};

Field.hidden = function(name, defaultConfig) {
    return new HiddenField(name, defaultConfig);
};

Field.file = function(name, defaultConfig) {
    return new FileField(name, 'file', defaultConfig);
};

Field.date = function(name, defaultConfig) {
    return new DateField(name, defaultConfig);
};

Field.time = function(name, defaultConfig) {
    return new TimeField(name, defaultConfig);
};

Field.tel = function(name, defaultConfig) {
    return new TelField(name, defaultConfig);
};

Field.url = function(name, defaultConfig) {
    return new UrlField(name, defaultConfig);
};

Field.color = function(name, defaultConfig) {
    return new ColorField(name, defaultConfig);
};

Field.range = function(name, defaultConfig) {
    return new RangeField(name, defaultConfig);
};

Field.image = function(name, defaultConfig) {
    return new ImageField(name, defaultConfig);
};

Field.checkboxGroup = function(name, options, defaultConfig) {
    return new CheckboxGroupField(name, options, defaultConfig);
};

Field.autocomplete = function(name, defaultConfig) {
    return new AutocompleteField(name, defaultConfig);
};

Field.collection = function(name, defaultConfig) {
    return new FieldCollection(name, defaultConfig);
};
