
export function resolveParams(rule, values) {
    return rule.params ?rule.params.map(param => {
        if (typeof param === 'string') {
            if(values.$parent && param.startsWith('@')) {
                const paramName = param.substring(1);
                if(values.$parent[paramName] !== undefined) {
                    return values.$parent[paramName];
                }
            }
            if(values[param] !== undefined) {
                return values[param];
            }
        }
        return param;
    }): [];
}