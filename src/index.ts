//VALIDATOR
//Validator type
type DefaultRules = {
    required?: boolean;
    optional?: never;
    message?: string
} | {
    required?: never;
    optional?: boolean;
    message?: string,
};

type StringRules = {
    length?: number | {
        min?: number,
        max?: number
    },
    isEmail?: boolean,
    startsWith?: string,
    endsWith?: string,
    isAlpha?: boolean,
    isNumeric?: boolean,
    isUrl?: boolean,
    isAlphanumeric?: boolean,
    regex?: RegExp,
}



type NumberRules = {
    isInt?: boolean,
    min?: number,
    max?: number,
    positive?: boolean,
    negative?: boolean,
    isZero?: boolean,
    isPort?: boolean,
}

type BooleanRules = {
    isTrue?: boolean,
    isFalse?: never
} | {
    isTrue?: never,
    isFalse?: boolean,
}

type ArrayRules<T> = {
    length?: {
        min?: number,
        max?: number
    } | number,
    notEmpty?: boolean,
    unique?: boolean,
    includeElement?: boolean,
    arrayType: DefaultRules & (
        T extends string ? StringRules :
        T extends number ? NumberRules :
        T extends boolean ? BooleanRules :
        T extends Array<infer U> ? ArrayRules<U> :
        T extends Date ? DateRules :
        T extends object ? ValidationRules<T> : never
    ),
    includes?: string,
}

type DateRules = {
    minDate?: Date,
    maxDate?: Date,
    isFuture?: Date,
    isPast?: Date,
}


type ValidationRules<T> = {
    [K in keyof T]: DefaultRules &
    (T[K] extends string ? StringRules :
        (T[K] extends number ? NumberRules :
            (T[K] extends boolean ? BooleanRules :
                T[K] extends Array<infer U> ? ArrayRules<ValidationRules<U>> :
                (T[K] extends Date ? DateRules :
                    (T[K] extends object ? ValidationRules<T[K]> :
                        T[K]
                    ))
            )
        )
    )
}

interface IValidator {
    validate: (value: object, schema: ValidationRules<typeof value>, address?: string) => IValidationError[],
}

interface IValidationError {
    msg: string,
    key: string,
}

function checkIfLength(max: number, min: number): boolean {
    if (max && min && max <= min) {
        return true
    }
    return false;
}

function checkIsAlpha(str: string): boolean {
    return /^[a-zA-Z]+$/.test(str)
}

function checkIsNumeric(str: string): boolean {
    return /^[0-9]+$/.test(str)
}

function checkIsAlphanumeric(str: string): boolean {
    return /^[a-zA-Z0-9]+$/.test(str)
}

function checkIsEmail(str: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str)
}

function checkIsRegex(str: string, regex: RegExp): boolean {
    return regex.test(str)
}

function checkIsUrl(str: string): boolean {
    return /\b(https?:\/\/|www\.)[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/))/g.test(str);
}

type ValueType<T> = ValidationRules<T>[Extract<keyof T, string>]

//asserts

function assertRegex(value: object): asserts value is RegExp {
    if (!(value instanceof RegExp)) throw new Error("Not a regex")
}

function assertError(value: unknown): asserts value is Error {
    if (!(value instanceof Error)) throw new Error("Not an error")
}

function assertNumber(value: unknown): asserts value is number {
    if (typeof value !== "number") {
        throw new Error()
    }
}

//typeguards

function isRegex<T>(value: ValueType<T>): value is (DefaultRules & { regex: string }) {
    return "regex" in value;
}

function isAlpha<T>(value: ValueType<T>): value is (DefaultRules & { isAlpha: boolean }) {
    return "isAlpha" in value && value.isAlpha === true;
}

function isAlphanumeric<T>(value: ValueType<T>): value is (DefaultRules & { isAlphanumeric: boolean }) {
    return "isAlphanumeric" in value && value.isAlphanumeric === true;
}

function isNumeric<T>(value: ValueType<T>): value is (DefaultRules & { isNumeric: boolean }) {
    return "isNumeric" in value && value.isNumeric === true;
}

function isRequired<T>(value: ValueType<T>): value is { required: boolean } {
    return "required" in value && value.required === true;
}

function isOptioal<T>(value: ValueType<T>): value is { optional: boolean } {
    return "optional" in value && value.optional === true
}

function isMessage<T>(value: ValueType<T>): value is (DefaultRules & { message: string }) {
    return "message" in value;
}

function isString(value: unknown): value is string {
    return typeof value === "string"
}

function isNumber(value: unknown): value is number {
    return typeof value === "number"
}

function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

function isTrue<T>(value: ValueType<T>): value is (DefaultRules & { isTrue: boolean }) {
    return "isTrue" in value && value.isTrue === true;
}

function isFalse<T>(value: ValueType<T>): value is (DefaultRules & { isFalse: boolean }) {
    return "isFalse" in value && value.isFalse === true;
}

function isLengthString<T>(value: ValueType<T>): value is (DefaultRules & { length: number | { min?: number, max?: number } }) {
    return "length" in value;
}

function isInt<T>(value: ValueType<T>): value is (DefaultRules & { isInt: boolean }) {
    return "isInt" in value;
}
function isStartsWith<T>(value: ValueType<T>): value is (DefaultRules & { startsWith: string }) {
    return "startsWith" in value
}

function isObjectLength<T>(value: ValueType<T>): value is (DefaultRules & { length: { min?: number, max?: number } }) {
    return isLengthString<T>(value) && typeof value.length === "object" && ("max" in value.length || "min" in value.length);
}

function isEmail<T>(value: ValueType<T>): value is (DefaultRules & { isEmail: boolean }) {
    return "isEmail" in value && value.isEmail === true;
}

function isUrl<T>(value: ValueType<T>): value is (DefaultRules & { isUrl: true }) {
    return "isUrl" in value && value.isUrl === true;
}

function isMin<T>(value: ValueType<T>): value is (DefaultRules & { min: number }) {
    return "min" in value;
}

function isMax<T>(value: ValueType<T>): value is (DefaultRules & { max: number }) {
    return "max" in value;
}

function isPositive<T>(value: ValueType<T>): value is (DefaultRules & { positive: boolean }) {
    return 'positive' in value && value.positive === true;
}

function isNegative<T>(value: ValueType<T>): value is (DefaultRules & { negative: boolean }) {
    return "negative" in value && value.negative === true;
}

function isArraySchema<T>(value: unknown): value is (DefaultRules & ArrayRules<any>) {
    return typeof value === "object" && value !== null && "arrayType" in value;
}

function isZero<T>(value: ValueType<T>): value is (DefaultRules & { isZero: boolean }) {
    return "isZero" in value && value.isZero === true;
}

function isPort<T>(value: ValueType<T>): value is (DefaultRules & { isPort: boolean }) {
    return "isPort" in value && value.isPort === true;
}

function isEndWith<T>(value: ValueType<T>): value is (DefaultRules & { endsWith: string }) {
    return "endsWith" in value;
}

function isEmpty<T>(value: ValueType<T>): value is (DefaultRules & { isEmpty: boolean }) {
    return "isEmpty" in value && value.isEmpty === true;
}

function isUnique<T>(value: ValueType<T>): value is (DefaultRules & { unique: boolean }) {
    return "unique" in value && value.unique === true;
}

function isMinDate<T>(value: ValueType<T>): value is (DefaultRules & { minDate: Date }) {
    return "minDate" in value;
}

function isMaxDate<T>(value: ValueType<T>): value is (DefaultRules & { maxDate: Date }) {
    return "maxValue" in value;
}

function isFuture<T>(value: ValueType<T>): value is (DefaultRules & { isFuture: boolean }) {
    return "isFuture" in value;
}

function isPast<T>(value: ValueType<T>): value is (DefaultRules & { isPast: boolean }) {
    return "isPast" in value;
}

function isIncludes<T>(value: ValueType<T>): value is (DefaultRules & { includes: string }) {
    return "includes" in value;
}


//Validator
class Validator implements IValidator {
    validate<T>(value: T, schema: ValidationRules<T>, address?: string): IValidationError[] {
        const errors: IValidationError[] = [];
        for (const key in schema) {
            const currentKey = address ? `${address}.${key}` : key;
            const fieldSchema = schema[key];
            const fieldValue = value[key];
            const m = fieldSchema.message;
            if (fieldValue instanceof Date) {
                if (isMinDate<T>(fieldSchema) && fieldValue.getTime() < fieldSchema.minDate.getTime()) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} in less than ${fieldSchema.minDate}(mindate)`
                    })
                }
                if (isMaxDate<T>(fieldSchema) && fieldValue.getDate() > fieldSchema.maxDate.getTime()) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} is bigger than ${fieldSchema.maxDate}(maxtime)`
                    })
                }
                if (isFuture<T>(fieldSchema) && Date.now() >= fieldValue.getTime()) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} is not future`
                    })
                }
                if (isPast<T>(fieldSchema) && Date.now() <= fieldValue.getTime()) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} in not past`
                    })
                }
            }
            if (Array.isArray(fieldValue)) {
                if (isEmpty<T>(fieldSchema) && fieldValue.length <= 0) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} must not be empty`
                    });
                }

                if (isLengthString<T>(fieldSchema) && fieldValue.length !== fieldSchema.length && typeof fieldValue !== "object") {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} must contain exactly ${fieldSchema.length} values`
                    });
                }

                if (isObjectLength<T>(fieldSchema)) {
                    const { max, min } = fieldSchema.length;
                    const hasMax = typeof max === "number";
                    const hasMin = typeof min === "number";

                    if (hasMax && hasMin) {
                        if (fieldValue.length < min || fieldValue.length > max) {
                            if (checkIfLength(max, min)) {
                                errors.push({
                                    msg: m ?? `Parameters syntax error`,
                                    key: currentKey,
                                });
                            } else {
                                errors.push({
                                    msg: m ?? `${key} length must be between ${min} and ${max}`,
                                    key: currentKey,
                                });
                            }
                        }
                    } else if (hasMin && !hasMax) {
                        if (fieldValue.length < min) {
                            errors.push({
                                key: currentKey,
                                msg: m ?? `${key} length is less than ${min}`
                            });
                        }
                    } else if (hasMax && !hasMin) {
                        if (fieldValue.length > max) {
                            errors.push({
                                key: currentKey,
                                msg: m ?? `${key} length is higher than ${max}`
                            });
                        }
                    } else {
                        errors.push({
                            key: currentKey,
                            msg: m ?? `Parameter syntax error: length object is empty`
                        });
                    }
                }

                if (isIncludes<T>(fieldSchema) && !fieldValue.includes(fieldSchema.includes)) {
                    errors.push({
                        msg: m ?? `${key} must include "${fieldSchema.includes}"`,
                        key: currentKey,
                    });
                }


                if (isUnique<T>(fieldSchema)) {
                    const arr: string[] = [];
                    for (const id in fieldValue) {
                        if (typeof fieldValue[id] === "string") {
                            arr.push(fieldValue[id])
                        } else {
                            arr.push(JSON.stringify(fieldValue[id]));
                        }
                    }
                    const set = new Set(arr);
                    if (set.size !== fieldValue.length) {
                        errors.push({
                            key: currentKey,
                            msg: m ?? `${key} is not contains only unique values`
                        })
                    }
                }

                if (isArraySchema(fieldSchema)) {
                    const processArray = (arr: any[], currentSchema: any, path: string) => {
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
                                        msg: m ?? err.msg.replace("value", `Element at index ${idx}`),
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
                errors.push(...recurseValidate.validate(fieldValue, fieldSchema as ValidationRules<typeof fieldValue>, currentKey));
                continue;
            }
            if (isRequired<T>(fieldSchema) && typeof fieldValue === "undefined") {
                errors.push({
                    msg: m ?? `${key} is required`,
                    key: currentKey,
                })
            }
            if (isOptioal<T>(fieldSchema) && typeof fieldValue === "undefined") {
                continue;
            }
            if (isOptioal<T>(fieldSchema) && isRequired<T>(fieldSchema)) {
                errors.push({
                    msg: m ?? `Parametars syntax error: optional and required at the same schema`,
                    key: currentKey,
                })
                return errors;
            }
            if (isString(fieldValue)) {
                if (isLengthString<T>(fieldSchema) && fieldValue.length !== fieldSchema.length && !isObjectLength<T>(fieldSchema)) {
                    errors.push({
                        msg: m ?? `${key} is not ${fieldSchema.length} chars`,
                        key: currentKey,
                    })
                }
                if (isObjectLength<T>(fieldSchema)) {
                    const { max, min } = fieldSchema.length;
                    if (max && min && (fieldValue.length < min || fieldValue.length > max)) {
                        if (checkIfLength(max, min)) {
                            errors.push({
                                msg: m ?? `Parametars syntax error`,
                                key: currentKey,
                            })
                            continue;
                        }
                        errors.push({
                            msg: m ?? `${key}.length is not higher then ${min} or less than ${max}`,
                            key: currentKey,
                        })
                    }
                    if (max && typeof min === "undefined" && fieldValue.length > max) {
                        errors.push({
                            msg: m ?? `${key}.length is bigger than ${max}`,
                            key: currentKey
                        })
                    }
                    if (min && typeof max === "undefined" && fieldValue.length < min) {
                        errors.push({
                            msg: m ?? `${key}.length is less than ${min}`,
                            key: currentKey,
                        })
                    }
                    if (typeof max === "undefined" && typeof min === "undefined") {
                        errors.push({
                            key: currentKey,
                            msg: m ?? `Parametar syntax error`
                        })
                    }
                }
                if (isEmail<T>(fieldSchema) && !checkIsEmail(fieldValue)) {
                    errors.push({
                        msg: m ?? `${key} is not email`,
                        key: currentKey,
                    })
                }
                if (isStartsWith<T>(fieldSchema) && fieldSchema.startsWith !== fieldValue[0] || fieldValue.length <= 0) {
                    errors.push({
                        msg: m ?? `${key} is not starts correct letter`,
                        key: currentKey,
                    })
                }
                if (isEndWith<T>(fieldSchema) && fieldSchema.endsWith !== fieldValue[fieldValue.length - 1] || fieldValue.length <= 0) {
                    errors.push({
                        msg: m ?? `${key} is not end with right letter`,
                        key: currentKey,
                    })
                }
                if (isNumeric<T>(fieldSchema) && !checkIsNumeric(fieldValue)) {
                    errors.push({
                        msg: m ?? `${key} is not number string`,
                        key: currentKey,
                    })
                }
                if (isAlpha<T>(fieldSchema) && !checkIsAlpha(fieldValue)) {
                    errors.push({
                        msg: m ?? `${key} is not only letters string`,
                        key: currentKey,
                    })
                }
                if (isAlphanumeric<T>(fieldSchema) && !checkIsAlphanumeric(fieldValue)) {
                    errors.push({
                        msg: m ?? `${key} in not only letters and number string`,
                        key: currentKey,
                    })
                }
                if (isRegex<T>(fieldSchema)) {
                    if (!isString(fieldSchema.regex)) {
                        try {
                            assertRegex(fieldSchema.regex);
                            if (!(checkIsRegex(fieldValue, fieldSchema.regex))) {
                                throw new Error(`${key} in satisfies regex expression`)
                            }
                        } catch (error) {
                            assertError(error);
                            errors.push({
                                msg: m ?? error.message,
                                key: currentKey,
                            })
                        }
                    }
                }
                if (isUrl<T>(fieldSchema) && !checkIsUrl(fieldValue)) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} is not url`
                    })
                }
            }
            if (isNumber(fieldValue)) {
                if (isInt<T>(fieldSchema) && !Number.isInteger(fieldValue)) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} is not integer`
                    })
                }
                if (isMin<T>(fieldSchema) && fieldValue < fieldSchema.min) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} is less than ${fieldSchema.min}`
                    })
                }
                if (isMax<T>(fieldSchema) && fieldValue > fieldSchema.max) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} is bigger than ${fieldSchema.max}`
                    })
                }
                if (isPositive<T>(fieldSchema) && fieldValue <= 0) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} is less than 0 or equal to 0`
                    })
                }
                if (isNegative<T>(fieldSchema) && fieldValue >= 0) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} is bigger than 0 or equal to 0`
                    })
                }
                if (isZero<T>(fieldSchema)) {
                    if (fieldValue === 0) {
                        continue
                    } else {
                        errors.push({
                            key: currentKey,
                            msg: m ?? `${key} is not 0`
                        })
                    }
                }
                if (isZero<T>(fieldSchema) && (isPositive<T>(fieldSchema) || isNegative<T>(fieldSchema))) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `Parametars syntax error: isZero and isPositive or isNegative at the same time`
                    })
                }
                if (isPort(fieldSchema)) {
                    if (!Number.isInteger(fieldValue) || fieldValue < 1 || fieldValue > 65535) {
                        errors.push({
                            key: currentKey,
                            msg: m ?? `${key} is not a valid port (must be an integer between 1 and 65535)`
                        });
                    }
                }
            }
            if (isBoolean(fieldValue)) {
                if (isFalse<T>(fieldSchema) && isTrue<T>(fieldSchema)) {
                    errors.push({
                        msg: m ?? `Parametars syntax error`,
                        key: currentKey,
                    });
                    continue;
                }
                if (isTrue<T>(fieldSchema) && fieldValue !== true) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} is not true`
                    })
                }
                if (isFalse<T>(fieldSchema) && fieldValue !== false) {
                    errors.push({
                        key: currentKey,
                        msg: m ?? `${key} is not false`
                    })
                }
            }
        }
        return errors;
    }
}

//STORE
//types
type ReturnLocked<K extends string> = `${K} has been locked`;
type ReturnUnlock<K extends string> = `${K} has been unlocked`;
type ValidationFlatRules<T, K extends keyof T> = DefaultRules & (
    NonNullable<T[K]> extends string ? StringRules :
    NonNullable<T[K]> extends number ? NumberRules :
    NonNullable<T[K]> extends boolean ? BooleanRules :
    NonNullable<T[K]> extends Array<infer U> ? ArrayRules<U> : (
        NonNullable<T[K]> extends Date ? DateRules :
        (NonNullable<T[K]> extends object ? ValidationRules<NonNullable<T[K]>> :
            T[K])
    )
);
type Listener<T> = (value: IState<T>) => void;

type Subscriber<T> = {
    name: string,
    cb: Listener<T>,
}

interface IState<T> {
    value: T,
    name: string,
    subscribes?: Subscriber<T>[],
    isLocked: boolean,
    validation?: ValidationRules<T>,
}

//typeguard

function isName<T>(value: unknown): value is string & keyof T {
    return typeof value === "string"
}

function nonTypeOmit<T extends object, K extends keyof T & string>(obj: T, key: K): Omit<T, K> {
    const newObj: Partial<T> = {};

    for (const item in obj) {
        if (String(item) !== key) {
            newObj[item] = obj[item];
        }
    }

    return newObj as Omit<T, K>;
}


//Store
class Store<T extends Record<string, any> = Record<string, any>> {
    public states: IState<unknown>[] = [];
    constructor() { };
    private findUser<K extends keyof T & string>(name: K): IState<unknown> {
        const value = this.states.filter((state: IState<unknown>) => state.name === name);
        if (value.length === 0) throw new Error(`${String(name)} does not exist`);
        if (value.length > 1) throw new Error(`${String(name)} has ${value.length - 1} copies`);
        return value[0];
    }
    private findIfUserDontExist(name: string): boolean {
        return !this.states.some((state: IState<unknown>) => state.name === name);
    }
    public showState<K extends keyof T & string>(name?: K): IState<unknown>[] {
        try {
            if (isName<T>(name)) {
                const user = this.findUser(name);
                return [user];
            }
            return this.states;
        } catch (error) {
            assertError(error);
            throw error;
        }
    }
    public createState<K extends keyof T & string>(name: K, value: T[K]): void {
        try {
            if (!this.findIfUserDontExist(name)) {
                throw new Error(`${name} is already exist`);
            }
            this.states.push({
                name,
                value,
                isLocked: false,
                subscribes: [],
            })
        } catch (error) {
            assertError(error);
            throw error;
        }
    }
    public lock<K extends keyof T & string>(name: K): ReturnLocked<K> {
        try {
            const user = this.findUser(name);
            user.isLocked = true;
            return `${name} has been locked` as ReturnLocked<K>;
        } catch (error) {
            assertError(error);
            throw error;
        }
    }

    public unlock<K extends keyof T & string>(name: K): ReturnUnlock<K> {
        try {
            const user = this.findUser(name);
            user.isLocked = false;
            return `${name} has been unlocked` as ReturnUnlock<K>;
        } catch (error) {
            assertError(error);
            throw error;
        }
    }

    public setSafe<K extends keyof T & string>(name: K, newValue: T[K]): Omit<IState<unknown>, "subscribes"> {
        try {
            const user = this.findUser(name);
            if (user.isLocked) throw new Error(`${name} is locked`);
            user.value = newValue;
            if (user.subscribes) user.subscribes.forEach((cb) => cb.cb(newValue));
            return nonTypeOmit(user, "subscribes");
        } catch (error) {
            assertError(error)
            throw error;
        }
    }
    public createValidation<K extends keyof T & string>(name: K, schema: ValidationFlatRules<T, K>): IState<unknown> {
        try {
            const user = this.findUser(name);
            user.validation = schema;
            return user;
        } catch (error) {
            assertError(error);
            throw error;
        }
    }

    public validation<K extends keyof T & string>(name: K) {
        try {
            const user = this.findUser(name);
            if (!user.validation) throw new Error(`${name} has no validation schema`);
            const obj = {
                [user.name]: user.value,
            };
            const validator = new Validator();
            return validator.validate(obj, { [user.name]: user.validation })
        } catch (error) {
            assertError(error);
            throw error;
        }
    }

    public subscribe<K extends keyof T & string>(name: K, cbName: string, callback: Listener<T[K]>) {
        try {
            const user = this.findUser(name) as IState<T[K]>;
            const someCallback = user.subscribes?.find(item => item.name === cbName);
            if (someCallback) throw new Error(`${cbName} subscribe if already exist`);
            user.subscribes?.push({
                name: cbName,
                cb: callback,
            });
            return () => user.subscribes = user.subscribes?.filter(item => item.name !== cbName);
        } catch (error) {
            assertError(error);
            throw error;
        }
    }
}