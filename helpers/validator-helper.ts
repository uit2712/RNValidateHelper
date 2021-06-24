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
};

interface IRequestValidatorInput {
    listValidators: ValidatorType[];
    defaultValue?: string;
}

// an input can have many validators, so we need to pass an array listValidators
export function useValidatorInput({
    listValidators,
    defaultValue,
}: IRequestValidatorInput) {
    // an input has a value
    const [value, setValue] = React.useState(defaultValue ?? '');
    const [errorMessage, setErrorMessage] = React.useState('');

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
            }
        }

        return '';
    }

    React.useEffect(() => {
        setErrorMessage(validate());
    }, [value, listValidators]); // everytime re-enter password changes or password changes we need to validate again :D

    return {
        value,
        onChangeText: (text: string) => setValue(text),
        errorMessage,
    }
}