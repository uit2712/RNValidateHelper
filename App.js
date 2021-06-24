/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { Input } from 'react-native-elements';
import React from 'react';
import {
    View,
} from 'react-native';
import { useValidatorInput } from './helpers/validator-helper';

function App() {
    const name = useValidatorInput({
        listValidators: [{
            type: 'minlength',
            minlength: 5,
            errorMessagePlaceHolder: '__placeholder__',
            errorMessage: 'You have to enter name at least __placeholder__ characters.'
        }, {
            type: 'maxlength',
            maxlength: 10,
            errorMessagePlaceHolder: '__placeholder__',
            errorMessage: 'You have to enter name at least __placeholder__ characters.'
        }]
    });

    const email = useValidatorInput({
        listValidators: [{
            type: 'function',
            errorMessage: 'Email is invalid',
            validate: (value) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(value) === true,
        }]
    });

    const password = useValidatorInput({
        listValidators: []
    });

    const reenterPassword = useValidatorInput({
        listValidators: [{
            type: 'match',
            errorMessage: 'Password not match',
            matchValue: password.value, // this changes every time password updates
        }]
    });

    return (
        <View>
            <Input
                placeholder='Name'
                {...name}
            />
            <Input
                placeholder='Email'
                {...email}
            />
            <Input
                placeholder='Password'
                {...password}
            />
            <Input
                placeholder='Re-enter password'
                {...reenterPassword}
            />
        </View>
    )
}

export default App;
