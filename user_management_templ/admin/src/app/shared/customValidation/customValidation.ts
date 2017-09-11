export class CustomValidations {

    constructor() { }

    isValidateEmail(emailToValidate: string): boolean {
        if (this.isNotNullAndNotEmptyString(emailToValidate)) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(emailToValidate);
        }
        return false;
    }

    isNotNullAndNotEmptyString(stringToValidate: string): boolean {
        if (stringToValidate === null || stringToValidate === undefined) {
            return false;
        }
        if (stringToValidate.trim() === '') {
            return false;
        }
        return true;
    }

    isNotNull(anyValue: any) {
        return anyValue !== null && anyValue !== undefined;
    }

}
