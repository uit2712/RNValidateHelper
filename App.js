/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import { Button, Input } from 'react-native-elements';
import {
    ToastAndroid,
    View,
} from 'react-native';
import { useValidatorForm, useValidatorInput } from './helpers/validator-helper';

import React from 'react';

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
        }],
        defaultValue: 'abc',
    });

    const email = useValidatorInput({
        listValidators: [{
            type: 'function',
            errorMessage: 'Email is invalid',
            validate: (value) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/.test(value) === true,
        }]
    });

    const password = useValidatorInput({
        listValidators: [{
            type: 'required',
            errorMessage: 'Please enter password',
        }]
    });

    const reenterPassword = useValidatorInput({
        listValidators: [{
            type: 'match',
            errorMessage: 'Password not match',
            matchValue: password.props.value, // this changes every time password updates
        }]
    });

    const form = useValidatorForm({
        inputs: [name, email, password, reenterPassword]
    });

    return (
        <View>
            <Input
                ref={name.ref}
                placeholder='Name'
                {...name.props}
            />
            <Input
                ref={email.ref}
                placeholder='Email'
                {...email.props}
            />
            <Input
                ref={password.ref}
                placeholder='Password'
                {...password.props}
            />
            <Input
                ref={reenterPassword.ref}
                placeholder='Re-enter password'
                {...reenterPassword.props}
            />
            <Button
                title='Register'
                type='outline'
                onPress={() => {
                    const { isValid } = form.validate();
                    if (isValid === true) {
                        ToastAndroid.show('Form is valid', ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show('Form is invalid', ToastAndroid.SHORT);
                    }
                }}
            />
        </View>
    )
}

export default App;
