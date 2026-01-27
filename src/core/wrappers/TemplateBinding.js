

export default function TemplateBinding(hydrate) {
    this.$hydrate = hydrate;
}

TemplateBinding.prototype.__$isTemplateBinding = true;