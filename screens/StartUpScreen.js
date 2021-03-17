import React,{ useEffect } from 'react'
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch } from 'react-redux';

import Colors from '../constants/Colors';
import * as authActions from '../store/actions/authAction';

 
const StartUpScreen = (props) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData')
            if (!userData) {
                props.navigation.navigate('Auth');
                return;
            }
            const transformedData = JSON.parse(userData);// JSON.parse() convrt data into js obj or arry
            const { token, userId, expiryDate } = transformedData;
            const expirationDate = new Date(expiryDate);

            if (expirationDate <= 0 || !token || !userId ) {
                props.navigation.navigate('Auth');
                return;
            }

            const expirationTime = expirationDate.getTime() - new Date().getTime();

            props.navigation.navigate('Shop');
            dispatch(authActions.authenticate(userId, token, expirationTime))
        }
        tryLogin();
    }, [dispatch])
    return (
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    )
}

export default StartUpScreen

const styles = StyleSheet.create({
    screen : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center'
    }
})
