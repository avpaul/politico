class Validator {
    // obj: the object to validate
    // props: an array of properties or property
    static validate(obj, props) {
        let isValid = true;
        const missingProps = [];
        const propsWithoutValue = [];
        props.forEach((prop) => {
            let propHasValue;
            const propFound = (Object.prototype.hasOwnProperty.call(obj, prop));
            if (propFound) {
                if (typeof obj[prop] === 'object') {
                    for (const key in obj[prop]) {
                        if (Object.prototype.hasOwnProperty.call(obj[prop], key)) {
                            propHasValue = true;
                            return;
                        }
                    }
                    propHasValue = false;
                }
                propHasValue = (obj[prop] !== '' && (obj[prop].trim().length !== 0));
            }
            if (!propFound) {
                missingProps.push(prop);
                isValid = false;
            }
            if (propFound && !propHasValue) {
                propsWithoutValue.push(prop);
                isValid = false;
            }
        });
        return { isValid, missingProps, propsWithoutValue };
    }

    static isStringOnly(obj, prop) {
        const value = obj[prop];
        return !(/[0-9]/g.test(value));
    }

    static isNumberOnly(obj, prop) {
        const value = obj[prop];
        return !(/[aA-zZ]/g.test(value));
    }

    static isUri(obj, prop) {
        const value = obj[prop];
        return /^(http|https):\/\//.test(value);
    }

    static isValidPassword(obj, prop) {
        const value = obj[prop];
        return /\w{6,}/.test(value);
    }

    static isValidEmail(obj, prop) {
        const value = obj[prop];
        return /^(\w{3,})@(\w)/.test(value);
    }
}

export default Validator;
