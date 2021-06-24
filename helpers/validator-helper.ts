import React from 'react';

type ValidatorType = {
    type: 'minlength';
    errorMessage: string;
    errorMessagePlaceHolder?: string;
    minlength: number;
} | {
    type: 'maxlength';
    errorMessage: string;
    errorMessagePlaceHolder?: string;
    maxlength: number;
} | {
    type: 'function';
    errorMessage: string;
    validate: (value: string) => boolean;
} | {
    type: 'match';
    errorMessage: string;
    matchValue: string;
} | {
    type: 'required';
    errorMessage: string;
};

interface IRequestValidatorInput {
    listValidators: ValidatorType[];
    defaultValue?: string;
}

interface IResponseValidatorInput {
    props: {
        value: string;
        onChangeText: (text: string) => void;
        errorMessage: string;
    };
    validate: () => {
        isValid: boolean;
    };
    ref?: React.RefObject<any>;
}

// an input can have many validators, so we need to pass an array listValidators
export function useValidatorInput({
    listValidators,
    defaultValue,
}: IRequestValidatorInput): IResponseValidatorInput {
    // an input has a value
    const [value, setValue] = React.useState(defaultValue ?? '');
    const [errorMessage, setErrorMessage] = React.useState('');
    const ref = React.createRef<any>();

    // validate should return error message when check array listValidators
    function validate(): string {
        for (let i = 0; i < listValidators.length; i++) {
            const validator = listValidators[i];
            switch(validator.type) {
                default: return '';
                case 'minlength':
                    const min = validator.minlength > 0 ? validator.minlength : 1;
                    const minErrorMessage = validator.errorMessage ?? `Minlength is ${validator.errorMessagePlaceHolder}`;
                    if (value.length < min) {
                        return minErrorMessage.replace(validator.errorMessagePlaceHolder, `${min}`);
                    }
                    break;
                case 'maxlength':
                    const max = validator.maxlength > 0 ? validator.maxlength : 1;
                    const maxErrorMessage = validator.errorMessage ?? `Maxlength is ${validator.errorMessagePlaceHolder}`
                    if (value.length > max) {
                        return maxErrorMessage.replace(validator.errorMessagePlaceHolder, `${max}`);
                    }
                    break;
                case 'function':
                    if (validator.validate(value) === false) {
                        return validator.errorMessage ?? 'Invalid value';
                    }
                    break;
                case 'match':
                    if (value !== validator.matchValue) {
                        return validator.errorMessage ?? 'Invalid value';
                    }
                    break;
                case 'required':
                    if (!value || value.trim() === '') {
                        return validator.errorMessage ?? 'Invalid value';
                    }
                    break;
            }
        }

        return '';
    }

    React.useEffect(() => {
        setErrorMessage(validate());
    }, [value, listValidators]); // everytime re-enter password changes or password changes we need to validate again :D

    // we need a validate function for form validator
    return {
        props: {
            value,
            onChangeText: (text: string) => setValue(text),
            errorMessage,
        },
        validate: () => {
            const errorMessage = validate();
            setErrorMessage(errorMessage);

            return {
                isValid: errorMessage === '', // is used for form validator
            }
        },
        ref,
    }
}

interface IRequestValidatorForm {
    inputs: IResponseValidatorInput[];
    isFocusOnErrorInput?: boolean;
}

export function useValidatorForm(request: IRequestValidatorForm) {
    const [isValid, setIsValid] = React.useState(false);

    // validate all inputs, not stop when any input is invalid
    function validate() {
        let result = true;
        let errorInputRef: React.RefObject<any>;
        for (let i = 0; i < request.inputs.length; i++) {
            const input = request.inputs[i];
            const { isValid } = input.validate();
            if (result === true && isValid === false) {
                result = false;
                errorInputRef = input.ref;
            }
        }

        if (result === false) {
            if (errorInputRef) {
                errorInputRef.current?.focus();
            }
        }

        return result;
    }

    return {
        isValid,
        validate: () => {
            const isValid = validate();
            setIsValid(isValid);
            return {
                isValid,
            }
        }
    }
}