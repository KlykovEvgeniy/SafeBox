"use strict";
function checkIfLength(max, min) {
    if (max && min && max <= min) {
        return true;
    }
    return false;
}
function checkIsAlpha(str) {
    return /^[a-zA-Z]+$/.test(str);
}
function checkIsNumeric(str) {
    return /^[0-9]+$/.test(str);
}
function checkIsAlphanumeric(str) {
    return /^[a-zA-Z0-9]+$/.test(str);
}
function checkIsEmail(str) {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str);
}
function checkIsRegex(str, regex) {
    return regex.test(str);
}
function checkIsUrl(str) {
    return /\b(https?:\/\/|www\.)[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/))/g.test(str);
}
//asserts
function assertRegex(value) {
    if (!(value instanceof RegExp))
        throw new Error("Not a regex");
}
function assertError(value) {
    if (!(value instanceof Error))
        throw new Error("Not an error");
}
function assertNumber(value) {
    if (typeof value !== "number") {
        throw new Error();
    }
}
//typeguards
function isRegex(value) {
    return "regex" in value;
}
function isAlpha(value) {
    return "isAlpha" in value && value.isAlpha === true;
}
function isAlphanumeric(value) {
    return "isAlphanumeric" in value && value.isAlphanumeric === true;
}
function isNumeric(value) {
    return "isNumeric" in value && value.isNumeric === true;
}
function isRequired(value) {
    return "required" in value && value.required === true;
}
function isOptioal(value) {
    return "optional" in value && value.optional === true;
}
function isMessage(value) {
    return "message" in value;
}
function isString(value) {
    return typeof value === "string";
}
function isNumber(value) {
    return typeof value === "number";
}
function isBoolean(value) {
    return typeof value === "boolean";
}
function isTrue(value) {
    return "isTrue" in value && value.isTrue === true;
}
function isFalse(value) {
    return "isFalse" in value && value.isFalse === true;
}
function isLengthString(value) {
    return "length" in value;
}
function isInt(value) {
    return "isInt" in value;
}
function isStartsWith(value) {
    return "startsWith" in value;
}
function isObjectLength(value) {
    return isLengthString(value) && typeof value.length === "object" && ("max" in value.length || "min" in value.length);
}
function isEmail(value) {
    return "isEmail" in value && value.isEmail === true;
}
function isUrl(value) {
    return "isUrl" in value && value.isUrl === true;
}
function isMin(value) {
    return "min" in value;
}
function isMax(value) {
    return "max" in value;
}
function isPositive(value) {
    return 'positive' in value && value.positive === true;
}
function isNegative(value) {
    return "negative" in value && value.negative === true;
}
function isArraySchema(value) {
    return typeof value === "object" && value !== null && "arrayType" in value;
}
function isZero(value) {
    return "isZero" in value && value.isZero === true;
}
function isPort(value) {
    return "isPort" in value && value.isPort === true;
}
function isEndWith(value) {
    return "endsWith" in value;
}
function isEmpty(value) {
    return "isEmpty" in value && value.isEmpty === true;
}
function isUnique(value) {
    return "unique" in value && value.unique === true;
}
function isMinDate(value) {
    return "minDate" in value;
}
function isMaxDate(value) {
    return "maxValue" in value;
}
function isFuture(value) {
    return "isFuture" in value;
}
function isPast(value) {
    return "isPast" in value;
}
function isIncludes(value) {
    return "includes" in value;
}
//Validator
class Validator {
    validate(value, schema, address) {
        const errors = [];
        for (const key in schema) {
            const currentKey = address ? `${address}.${key}` : key;
            const fieldSchema = schema[key];
            const fieldValue = value[key];
            const m = fieldSchema.message;
            if (fieldValue instanceof Date) {
                if (isMinDate(fieldSchema) && fieldValue.getTime() < fieldSchema.minDate.getTime()) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} in less than ${fieldSchema.minDate}(mindate)`
                    });
                }
                if (isMaxDate(fieldSchema) && fieldValue.getDate() > fieldSchema.maxDate.getTime()) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} is bigger than ${fieldSchema.maxDate}(maxtime)`
                    });
                }
                if (isFuture(fieldSchema) && Date.now() >= fieldValue.getTime()) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} is not future`
                    });
                }
                if (isPast(fieldSchema) && Date.now() <= fieldValue.getTime()) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} in not past`
                    });
                }
            }
            if (Array.isArray(fieldValue)) {
                if (isEmpty(fieldSchema) && fieldValue.length <= 0) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} must not be empty`
                    });
                }
                if (isLengthString(fieldSchema) && fieldValue.length !== fieldSchema.length && typeof fieldValue !== "object") {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} must contain exactly ${fieldSchema.length} values`
                    });
                }
                if (isObjectLength(fieldSchema)) {
                    const { max, min } = fieldSchema.length;
                    const hasMax = typeof max === "number";
                    const hasMin = typeof min === "number";
                    if (hasMax && hasMin) {
                        if (fieldValue.length < min || fieldValue.length > max) {
                            if (checkIfLength(max, min)) {
                                errors.push({
                                    msg: m !== null && m !== void 0 ? m : `Parameters syntax error`,
                                    key: currentKey,
                                });
                            }
                            else {
                                errors.push({
                                    msg: m !== null && m !== void 0 ? m : `${key} length must be between ${min} and ${max}`,
                                    key: currentKey,
                                });
                            }
                        }
                    }
                    else if (hasMin && !hasMax) {
                        if (fieldValue.length < min) {
                            errors.push({
                                key: currentKey,
                                msg: m !== null && m !== void 0 ? m : `${key} length is less than ${min}`
                            });
                        }
                    }
                    else if (hasMax && !hasMin) {
                        if (fieldValue.length > max) {
                            errors.push({
                                key: currentKey,
                                msg: m !== null && m !== void 0 ? m : `${key} length is higher than ${max}`
                            });
                        }
                    }
                    else {
                        errors.push({
                            key: currentKey,
                            msg: m !== null && m !== void 0 ? m : `Parameter syntax error: length object is empty`
                        });
                    }
                }
                if (isIncludes(fieldSchema) && !fieldValue.includes(fieldSchema.includes)) {
                    errors.push({
                        msg: m !== null && m !== void 0 ? m : `${key} must include "${fieldSchema.includes}"`,
                        key: currentKey,
                    });
                }
                if (isUnique(fieldSchema)) {
                    const arr = [];
                    for (const id in fieldValue) {
                        if (typeof fieldValue[id] === "string") {
                            arr.push(fieldValue[id]);
                        }
                        else {
                            arr.push(JSON.stringify(fieldValue[id]));
                        }
                    }
                    const set = new Set(arr);
                    if (set.size !== fieldValue.length) {
                        errors.push({
                            key: currentKey,
                            msg: m !== null && m !== void 0 ? m : `${key} is not contains only unique values`
                        });
                    }
                }
                if (isArraySchema(fieldSchema)) {
                    const processArray = (arr, currentSchema, path) => {
                        for (const [idx, item] of arr.entries()) {
                            const itemKey = `${path}[${idx}]`;
                            if (Array.isArray(item)) {
                                if (currentSchema && currentSchema.arrayType) {
                                    processArray(item, currentSchema.arrayType, itemKey);
                                }
                            }
                            else if (typeof item === "object" && item !== null) {
                                const recurse = new Validator();
                                errors.push(...recurse.validate(item, currentSchema.arrayType, itemKey));
                            }
                            else {
                                const recurse = new Validator();
                                const virtualObject = { value: item };
                                const virtualSchema = { value: currentSchema.arrayType };
                                const primitiveErrors = recurse.validate(virtualObject, virtualSchema);
                                primitiveErrors.forEach(err => {
                                    errors.push({
                                        msg: m !== null && m !== void 0 ? m : err.msg.replace("value", `Element at index ${idx}`),
                                        key: itemKey
                                    });
                                });
                            }
                        }
                    };
                    processArray(fieldValue, fieldSchema, currentKey);
                }
                continue;
            }
            if (typeof fieldValue === "object" && fieldValue !== null) {
                const recurseValidate = new Validator();
                errors.push(...recurseValidate.validate(fieldValue, fieldSchema, currentKey));
                continue;
            }
            if (isRequired(fieldSchema) && typeof fieldValue === "undefined") {
                errors.push({
                    msg: m !== null && m !== void 0 ? m : `${key} is required`,
                    key: currentKey,
                });
            }
            if (isOptioal(fieldSchema) && typeof fieldValue === "undefined") {
                continue;
            }
            if (isOptioal(fieldSchema) && isRequired(fieldSchema)) {
                errors.push({
                    msg: m !== null && m !== void 0 ? m : `Parametars syntax error: optional and required at the same schema`,
                    key: currentKey,
                });
                return errors;
            }
            if (isString(fieldValue)) {
                if (isLengthString(fieldSchema) && fieldValue.length !== fieldSchema.length && !isObjectLength(fieldSchema)) {
                    errors.push({
                        msg: m !== null && m !== void 0 ? m : `${key} is not ${fieldSchema.length} chars`,
                        key: currentKey,
                    });
                }
                if (isObjectLength(fieldSchema)) {
                    const { max, min } = fieldSchema.length;
                    if (max && min && (fieldValue.length < min || fieldValue.length > max)) {
                        if (checkIfLength(max, min)) {
                            errors.push({
                                msg: m !== null && m !== void 0 ? m : `Parametars syntax error`,
                                key: currentKey,
                            });
                            continue;
                        }
                        errors.push({
                            msg: m !== null && m !== void 0 ? m : `${key}.length is not higher then ${min} or less than ${max}`,
                            key: currentKey,
                        });
                    }
                    if (max && typeof min === "undefined" && fieldValue.length > max) {
                        errors.push({
                            msg: m !== null && m !== void 0 ? m : `${key}.length is bigger than ${max}`,
                            key: currentKey
                        });
                    }
                    if (min && typeof max === "undefined" && fieldValue.length < min) {
                        errors.push({
                            msg: m !== null && m !== void 0 ? m : `${key}.length is less than ${min}`,
                            key: currentKey,
                        });
                    }
                    if (typeof max === "undefined" && typeof min === "undefined") {
                        errors.push({
                            key: currentKey,
                            msg: m !== null && m !== void 0 ? m : `Parametar syntax error`
                        });
                    }
                }
                if (isEmail(fieldSchema) && !checkIsEmail(fieldValue)) {
                    errors.push({
                        msg: m !== null && m !== void 0 ? m : `${key} is not email`,
                        key: currentKey,
                    });
                }
                if (isStartsWith(fieldSchema) && fieldSchema.startsWith !== fieldValue[0] || fieldValue.length <= 0) {
                    errors.push({
                        msg: m !== null && m !== void 0 ? m : `${key} is not starts correct letter`,
                        key: currentKey,
                    });
                }
                if (isEndWith(fieldSchema) && fieldSchema.endsWith !== fieldValue[fieldValue.length - 1] || fieldValue.length <= 0) {
                    errors.push({
                        msg: m !== null && m !== void 0 ? m : `${key} is not end with right letter`,
                        key: currentKey,
                    });
                }
                if (isNumeric(fieldSchema) && !checkIsNumeric(fieldValue)) {
                    errors.push({
                        msg: m !== null && m !== void 0 ? m : `${key} is not number string`,
                        key: currentKey,
                    });
                }
                if (isAlpha(fieldSchema) && !checkIsAlpha(fieldValue)) {
                    errors.push({
                        msg: m !== null && m !== void 0 ? m : `${key} is not only letters string`,
                        key: currentKey,
                    });
                }
                if (isAlphanumeric(fieldSchema) && !checkIsAlphanumeric(fieldValue)) {
                    errors.push({
                        msg: m !== null && m !== void 0 ? m : `${key} in not only letters and number string`,
                        key: currentKey,
                    });
                }
                if (isRegex(fieldSchema)) {
                    if (!isString(fieldSchema.regex)) {
                        try {
                            assertRegex(fieldSchema.regex);
                            if (!(checkIsRegex(fieldValue, fieldSchema.regex))) {
                                throw new Error(`${key} in satisfies regex expression`);
                            }
                        }
                        catch (error) {
                            assertError(error);
                            errors.push({
                                msg: m !== null && m !== void 0 ? m : error.message,
                                key: currentKey,
                            });
                        }
                    }
                }
                if (isUrl(fieldSchema) && !checkIsUrl(fieldValue)) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} is not url`
                    });
                }
            }
            if (isNumber(fieldValue)) {
                if (isInt(fieldSchema) && !Number.isInteger(fieldValue)) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} is not integer`
                    });
                }
                if (isMin(fieldSchema) && fieldValue < fieldSchema.min) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} is less than ${fieldSchema.min}`
                    });
                }
                if (isMax(fieldSchema) && fieldValue > fieldSchema.max) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} is bigger than ${fieldSchema.max}`
                    });
                }
                if (isPositive(fieldSchema) && fieldValue <= 0) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} is less than 0 or equal to 0`
                    });
                }
                if (isNegative(fieldSchema) && fieldValue >= 0) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} is bigger than 0 or equal to 0`
                    });
                }
                if (isZero(fieldSchema)) {
                    if (fieldValue === 0) {
                        continue;
                    }
                    else {
                        errors.push({
                            key: currentKey,
                            msg: m !== null && m !== void 0 ? m : `${key} is not 0`
                        });
                    }
                }
                if (isZero(fieldSchema) && (isPositive(fieldSchema) || isNegative(fieldSchema))) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `Parametars syntax error: isZero and isPositive or isNegative at the same time`
                    });
                }
                if (isPort(fieldSchema)) {
                    if (!Number.isInteger(fieldValue) || fieldValue < 1 || fieldValue > 65535) {
                        errors.push({
                            key: currentKey,
                            msg: m !== null && m !== void 0 ? m : `${key} is not a valid port (must be an integer between 1 and 65535)`
                        });
                    }
                }
            }
            if (isBoolean(fieldValue)) {
                if (isFalse(fieldSchema) && isTrue(fieldSchema)) {
                    errors.push({
                        msg: m !== null && m !== void 0 ? m : `Parametars syntax error`,
                        key: currentKey,
                    });
                    continue;
                }
                if (isTrue(fieldSchema) && fieldValue !== true) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} is not true`
                    });
                }
                if (isFalse(fieldSchema) && fieldValue !== false) {
                    errors.push({
                        key: currentKey,
                        msg: m !== null && m !== void 0 ? m : `${key} is not false`
                    });
                }
            }
        }
        return errors;
    }
}
//typeguard
function isName(value) {
    return typeof value === "string";
}
function nonTypeOmit(obj, key) {
    const newObj = {};
    for (const item in obj) {
        if (String(item) !== key) {
            newObj[item] = obj[item];
        }
    }
    return newObj;
}
//Store
class Store {
    constructor() {
        this.states = [];
    }
    ;
    findUser(name) {
        const value = this.states.filter((state) => state.name === name);
        if (value.length === 0)
            throw new Error(`${String(name)} does not exist`);
        if (value.length > 1)
            throw new Error(`${String(name)} has ${value.length - 1} copies`);
        return value[0];
    }
    findIfUserDontExist(name) {
        return !this.states.some((state) => state.name === name);
    }
    showState(name) {
        try {
            if (isName(name)) {
                const user = this.findUser(name);
                return [user];
            }
            return this.states;
        }
        catch (error) {
            assertError(error);
            throw error;
        }
    }
    createState(name, value) {
        try {
            if (!this.findIfUserDontExist(name)) {
                throw new Error(`${name} is already exist`);
            }
            this.states.push({
                name,
                value,
                isLocked: false,
                subscribes: [],
            });
        }
        catch (error) {
            assertError(error);
            throw error;
        }
    }
    lock(name) {
        try {
            const user = this.findUser(name);
            user.isLocked = true;
            return `${name} has been locked`;
        }
        catch (error) {
            assertError(error);
            throw error;
        }
    }
    unlock(name) {
        try {
            const user = this.findUser(name);
            user.isLocked = false;
            return `${name} has been unlocked`;
        }
        catch (error) {
            assertError(error);
            throw error;
        }
    }
    setSafe(name, newValue) {
        try {
            const user = this.findUser(name);
            if (user.isLocked)
                throw new Error(`${name} is locked`);
            user.value = newValue;
            if (user.subscribes)
                user.subscribes.forEach((cb) => cb.cb(newValue));
            return nonTypeOmit(user, "subscribes");
        }
        catch (error) {
            assertError(error);
            throw error;
        }
    }
    createValidation(name, schema) {
        try {
            const user = this.findUser(name);
            user.validation = schema;
            return user;
        }
        catch (error) {
            assertError(error);
            throw error;
        }
    }
    validation(name) {
        try {
            const user = this.findUser(name);
            if (!user.validation)
                throw new Error(`${name} has no validation schema`);
            const obj = {
                [user.name]: user.value,
            };
            const validator = new Validator();
            return validator.validate(obj, { [user.name]: user.validation });
        }
        catch (error) {
            assertError(error);
            throw error;
        }
    }
    subscribe(name, cbName, callback) {
        var _a, _b;
        try {
            const user = this.findUser(name);
            const someCallback = (_a = user.subscribes) === null || _a === void 0 ? void 0 : _a.find(item => item.name === cbName);
            if (someCallback)
                throw new Error(`${cbName} subscribe if already exist`);
            (_b = user.subscribes) === null || _b === void 0 ? void 0 : _b.push({
                name: cbName,
                cb: callback,
            });
            return () => { var _a; return user.subscribes = (_a = user.subscribes) === null || _a === void 0 ? void 0 : _a.filter(item => item.name !== cbName); };
        }
        catch (error) {
            assertError(error);
            throw error;
        }
    }
}
