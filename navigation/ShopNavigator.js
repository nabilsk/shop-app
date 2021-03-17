import React from 'react';
import { useDispatch } from 'react-redux';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerNavigatorItems } from 'react-navigation-drawer';
import { Platform, View, SafeAreaView, Button } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { Ionicons } from '@expo/vector-icons';

import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductsDetailScreen from '../screens/shop/ProductsDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductsScreen from '../screens/user/UserProductsscreen';
import EditProductsScreen from '../screens/user/EditProductsScreen';
import Colors from '../constants/Colors';
import AuthScreen from '../screens/user/AuthScreen';
import StartUpScreen from '../screens/StartUpScreen';
import * as authActions from '../store/actions/authAction';

const defaultNavOptions = {
    headerStyle : {
        backgroundColor : Platform.OS === 'android' ? Colors.primary : ''
    },
    headerTitleStyle : {
        fontFamily : 'open-sans-bold'
    },
    headerBackTitleStyle : {
        fontFamily : 'open-sans'
    },
    headerTintColor : Platform.OS === 'android' ? 'white' : Colors.primary
}

const ProductsNavigator = createStackNavigator({
    ProductsOverview : ProductsOverviewScreen,
    ProductDetail : ProductsDetailScreen,
    Cart : CartScreen
}, {
    navigationOptions  : {
        drawerIcon : drawerConfig => (
                <Ionicons name={Platform.OS === 'android' ? 'md-cart' : 'ios-cart'}
                    size={23}
                    color={drawerConfig.tintColor} />
            ),
    },
    defaultNavigationOptions : defaultNavOptions
});

const OrdersNavigator = createStackNavigator({
    Order : OrdersScreen
}, {
    navigationOptions  : {
        drawerIcon : drawerConfig => (
                <Ionicons name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
                    size={23}
                    color={drawerConfig.tintColor} />
            ),
    },
    defaultNavigationOptions : defaultNavOptions
});

const AdminNavigator = createStackNavigator({
    UserProduct : UserProductsScreen,
    EditProducts : EditProductsScreen
}, {
    navigationOptions  : {
        drawerIcon : drawerConfig => (
                <Ionicons name={Platform.OS === 'android' ? 'md-create' : 'ios-create'}
                    size={23}
                    color={drawerConfig.tintColor} />
            ),
    },
    defaultNavigationOptions : defaultNavOptions
});

const ShopNavigator = createDrawerNavigator({
    Products : ProductsNavigator,
    Orders : OrdersNavigator,
    Admin : AdminNavigator

}, {
    contentOptions : {
        activeTintColor : Colors.primary
    },
    contentComponent : props => {
        const dispatch = useDispatch();
        return <View style={{flex : 1, padding : 20}}>
            <SafeAreaView forceInset={{ top : 'always', horizontal : 'never'}}>
                <DrawerNavigatorItems {...props} />
                <Button title='Logout' color={Colors.primary} onPress={() => {
                    dispatch(authActions.logout());
                    // props.navigation.navigate('Auth');
                }} />
            </SafeAreaView>
        </View>
    }
});

const AuthNavigator = createStackNavigator({
    AuthNav : AuthScreen
}, {
    defaultNavigationOptions : defaultNavOptions
})

const MainNavigator = createSwitchNavigator({
    StartUp : StartUpScreen,
    Auth : AuthNavigator,
    Shop : ShopNavigator
});

export default createAppContainer(MainNavigator);