import {Div, Span, ShowIf, Form} from '../../../../elements';
import './form-control.css';
import {Button} from "../../../components/button";

export default function FormControlRender($desc, instance) {
    const props = instance.getEditableProps();
    props.class.add('form-control');

    const fieldsObject = $desc.fieldBuilder
        ? $desc.fieldBuilder()
        : instance.$fields;

    if($desc.errorsMode === 'summary') {
        for(const [_, field] of Object.entries(instance.$fields)) {
            field.forceShowErrors(false);
        }
    }

    const errorsSummary = buildErrorsSummary($desc, instance);

    const layoutFn = $desc.layout || buildDefaultLayout;

    if(!layoutFn) {
        throw new Error('FormControl: layout() must be defined');
    }

    const form = layoutFn({
        fields: fieldsObject,
        errors: errorsSummary,
        form:   instance,
    }, instance);

    if(!((form instanceof HTMLFormElement) || form?.$element instanceof HTMLFormElement)) {
        throw new Error('FormControl: layout must return an HtmlFormElement');
    }

    instance.$element = form;

    form.nd.onSubmit(async (event) => {
        return await instance.submit(event);
    });

    return form;
}

const buildDefaultLayout = ({ fields, errors, form }) => {
    return Form({ class: 'form-control-default', ...form.resolveProps() }, [
        ...Object.values(fields),
        errors,
        Div({ class: 'form-actions' }, [
            Button('Reset').type('reset'),
            Button('Submit').type('submit'),
        ])
    ]);
};


const buildErrorsSummary = ($desc, instance) => {
    if($desc.errorsMode === 'dispatch') {
        return null;
    }

    return ShowIf($desc.errors, () => {
        const errors = $desc.errors.val();
        if(!errors) {
            return null;
        }

        if($desc.renderErrors) {
            return $desc.renderErrors(errors);
        }

        return Div({class: 'form-errors'},
            Object.entries(errors).map(([field, msgs]) =>
                Div({class: 'form-error-group'}, [
                    Span({class: 'form-error-field'}, field),
                    Div({class: 'form-error-messages'},
                        msgs.map(msg => Span({class: 'form-error-message'}, msg))
                    ),
                ])
            )
        );
    });
};