# 📦 SafeBox-validation
GLOBAL RULES (Any type)
* required    [boolean] - Field must exist (cannot be undefined)
* optional    [boolean] - Field can be missing, validates only if passed
* message     [string]  - Custom error text for the UI output

STRINGS (string)
* length      [num|obj] - Exact string length or a range like { min, max }
* isEmail     [boolean] - Validates basic email format
* startsWith  [string]  - String must strictly start with this single character
* endsWith    [string]  - String must strictly end with this single character
* includes    [string]  - String must contain this specific substring
* isAlpha     [boolean] - Allows latin letters only (a-z, A-Z)
* isNumeric   [boolean] - Allows digits only (0-9)
* isAlphanumeric[bool]  - Allows latin letters and digits only
* isUrl       [boolean] - Validates web address format (http/https/www)
* regex       [RegExp]  - Validates string against a custom regular expression

NUMBERS (number)
* isInt       [boolean] - Number must be an integer (no floats)
* min         [number]  - Minimum allowed value (inclusive)
* max         [number]  - Maximum allowed value (inclusive)
* positive    [boolean] - Number must be strictly greater than zero (> 0)
* negative    [boolean] - Number must be strictly less than zero (< 0)
* isZero      [boolean] - Number must be strictly equal to zero (=== 0)
* isPort      [boolean] - Validates network port integer (range 1 to 65535)

BOOLEANS (boolean)
* isTrue      [boolean] - Value must be strictly true (e.g. checkbox agreement)
* isFalse     [boolean] - Value must be strictly false

DATES (Date)
* minDate     [Date]    - Sets the lowest allowed date constraint
* maxDate     [Date]    - Sets the highest allowed date constraint
* isFuture    [boolean] - Date must be after the current moment of validation
* isPast      [boolean] - Date must be before the current moment of validation

ARRAYS (Array)
* length      [num|obj] - Exact element count or a range like { min, max }
* notEmpty    [boolean] - Array cannot be empty (length must be > 0)
* unique      [boolean] - Enforces unique elements (objects compared via JSON)
* arrayType   [Rules]   - Validation schema applied to every array element

