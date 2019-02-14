class Validator {
    // obj: the object to validate
    // props: an array of properties
    static validate(obj, props) {
        let isValid = true;
        const missingProps = [];
        props.forEach((prop) => {
            const propFound = (Object.prototype.hasOwnProperty.call(obj, prop) && (obj[prop] !== ''));
            if (!propFound) {
                missingProps.push(prop);
                isValid = false;
            }
        });
        return { isValid, missingProps };
    }

    static isStringOnly(obj, prop) {
        const value = obj[prop];
        console.log(value);
        return !(/\d/g.test(value));
    }

    static isNumber(obj, prop) {
        const value = obj[prop];
        return (/\w/g.test(value));
    }
}

module.exports = Validator;
