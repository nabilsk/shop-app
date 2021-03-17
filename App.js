import React,{ useState } from 'react';
import { combineReducers, createStore, applyMiddleware} from 'redux'
import { Provider } from 'react-redux';
import AppLoading  from 'expo-app-loading';
import * as Font from 'expo-font';
import ReduxThunk from 'redux-thunk'
// import { composeWithDevTools } from 'redux-devtools-extension';

import productReducer from './store/reducers/productReducers';
import ShopNavigator from './navigation/ShopNavigator';
import cartReducer from './store/reducers/cartReducer';
import orderReducer from './store/reducers/orderReducers';
import authReducer from './store/reducers/authReducer';
import NavigationContainer from './navigation/NavigationContainer';

const rootReducer = combineReducers({
  products : productReducer,
  cart : cartReducer,
  orders : orderReducer,
  auth : authReducer
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans' : require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold' : require('./assets/fonts/OpenSans-Bold.ttf')
  })
}

export default function App() {
  const [fontLoaded, setFontLoaded]  = useState(false);

  if (!fontLoaded) {
    return (
      <AppLoading startAsync={fetchFonts} onFinish={() => {
        setFontLoaded(true);
      }} 
       onError={err => console.log(err)} />
    )
  }
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}

