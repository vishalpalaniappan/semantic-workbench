const saveInvariantPropValues = (invariant, propertyInputs) => {
    console.log(invariant);
    const props = invariant.invariantType.properties;
    const keys = Object.keys(props);

    for (const key of keys) {
        const value = propertyInputs[key];
        if (value === undefined || value.trim() === "") {
            throw new Error(`Property "${props[key].label}" must not be empty.`);
        }
        if (props[key].type === "number" && isNaN(value)) {
            throw new Error(`Property "${props[key].label}" must be a valid number.`);
        }
        if (props[key].type === "boolean" &&
            value.toLowerCase() !== "true" && value.toLowerCase() !== "false") {
            throw new Error(`Property "${props[key].label}" must be true or false.`);
        }
        if (props[key].type.toLowerCase() === "number") {
            props[key].value = Number(value);
        } else if (props[key].type.toLowerCase() === "boolean") {
            props[key].value = value.toLowerCase() === "true";
        } else if (props[key].type.toLowerCase() === "array") {
            props[key].value = value.split(",").map((item) => item.trim());
        } else if (props[key].type.toLowerCase() === "string") {
            props[key].value = value;
        } else {
            throw new Error(`Property "${props[key].label}"\
                 has unsupported type "${props[key].type}\".`);
        }
    };
};

export {saveInvariantPropValues};