import React, { useState,useReducer, useEffect, useCallback } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  KeyboardAvoidingView,
  Button,
  Alert,
  ActivityIndicator
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useDispatch } from "react-redux";

import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";
import * as authActions from "../../store/actions/authAction";

const FORM_INPUT_UPDATE = "FORM_INPUT_UPDATE";

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updateValues = {
      ...state.inputValues,
      [action.input]: action.value,
    };
    const updateValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid,
    };
    let updatedFormIsValid = true;
    for (const key in updateValidities) {
      updatedFormIsValid = updatedFormIsValid && updateValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValues: updateValues,
      inputValidities: updateValidities,
    };
  }
  return state;
};

const AuthScreen = (props) => {
    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setIsError ] = useState();
    const [isSignup, setIsSignup ] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
      if (error) {
        Alert.alert('An error occured', error, [{text : 'Okey'}])
      }
  }, [error])

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      email: '',
      password: '',
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });
  

  const authHandler =  async () => {
    let action;
    if (isSignup) {
      action = authActions.signup(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = authActions.login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    setIsError(null)
    setIsLoading(true);
    try {
         await dispatch(action);
         props.navigation.navigate('Shop')
    } catch (err) {
        setIsError(err.message);
        setIsLoading(false);
    }
    
  };
  



  const inputChangeHandler = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier,
      });
    },
    [dispatchFormState]
  );

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={10}
      style={styles.screen}
    >
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.container}>
          <ScrollView>
            <Input
              id="email"
              label="E-mail"
              keyboardType="email-address"
              required
              email
              autoCapitalize="none"
              errorText="Please enter a valid email"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid password"
              onInputChange={inputChangeHandler}
              initialValue=""
            />
            <View style={styles.btnConatiner}>
              {isLoading ? <ActivityIndicator size ='small' color={Colors.primary} /> : <Button
                title={isSignup ? "Sign up" :"Login"}
                color={Colors.primary}
                onPress={authHandler}
              />}
            </View>
            <View style={styles.btnConatiner}>
              <Button
                title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                color={Colors.accent}
                onPress={() => {
                    setIsSignup(prevState => !prevState)
                }}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

AuthScreen.navigationOptions = {
  headerTitle: "Authenticate",
};

export default AuthScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  btnConatiner: {
    marginTop: 10,
    borderColor: "#ccc",
  },
});


// const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

// const formReducer = (state, action) => {
//   if (action.type === FORM_INPUT_UPDATE) {
//     const updatedValues = {
//       ...state.inputValues,
//       [action.input]: action.value
//     };
//     const updatedValidities = {
//       ...state.inputValidities,
//       [action.input]: action.isValid
//     };
//     let updatedFormIsValid = true;
//     for (const key in updatedValidities) {
//       updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
//     }
//     return {
//       formIsValid: updatedFormIsValid,
//       inputValidities: updatedValidities,
//       inputValues: updatedValues
//     };
//   }
//   return state;
// };

// const AuthScreen = props => {
//   const dispatch = useDispatch();

//   const [formState, dispatchFormState] = useReducer(formReducer, {
//     inputValues: {
//       email: '',
//       password: ''
//     },
//     inputValidities: {
//       email: false,
//       password: false
//     },
//     formIsValid: false
//   });

//   const signupHandler = () => {
//     dispatch(
//       authActions.signup(
//         formState.inputValues.email,
//         formState.inputValues.password
//       )
//     );
//   };

//   const inputChangeHandler = useCallback(
//     (inputIdentifier, inputValue, inputValidity) => {
//       dispatchFormState({
//         type: FORM_INPUT_UPDATE,
//         value: inputValue,
//         isValid: inputValidity,
//         input: inputIdentifier
//       });
//     },
//     [dispatchFormState]
//   );

//   return (
//     <KeyboardAvoidingView
//       behavior="padding"
//       keyboardVerticalOffset={50}
//       style={styles.screen}
//     >
//       <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
//         <Card style={styles.authContainer}>
//           <ScrollView>
//             <Input
//               id="email"
//               label="E-Mail"
//               keyboardType="email-address"
//               required
//               email
//               autoCapitalize="none"
//               errorText="Please enter a valid email address."
//               onInputChange={inputChangeHandler}
//               initialValue=""
//             />
//             <Input
//               id="password"
//               label="Password"
//               keyboardType="default"
//               secureTextEntry
//               required
//               minLength={5}
//               autoCapitalize="none"
//               errorText="Please enter a valid password."
//               onInputChange={inputChangeHandler}
//               initialValue=""
//             />
//             <View style={styles.buttonContainer}>
//               <Button
//                 title="Login"
//                 color={Colors.primary}
//                 onPress={signupHandler}
//               />
//             </View>
//             <View style={styles.buttonContainer}>
//               <Button
//                 title="Switch to Sign Up"
//                 color={Colors.accent}
//                 onPress={() => {}}
//               />
//             </View>
//           </ScrollView>
//         </Card>
//       </LinearGradient>
//     </KeyboardAvoidingView>
//   );
// };

// AuthScreen.navigationOptions = {
//   headerTitle: 'Authenticate'
// };

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1
//   },
//   gradient: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   authContainer: {
//     width: '80%',
//     maxWidth: 400,
//     maxHeight: 400,
//     padding: 20
//   },
//   buttonContainer: {
//     marginTop: 10
//   }
// });

// export default AuthScreen;
