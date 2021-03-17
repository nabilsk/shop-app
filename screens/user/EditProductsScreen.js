import React, { useReducer, useEffect, useCallback, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  Text,
  View,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useSelector, useDispatch } from "react-redux";

import HeaderButton from "../../components/UI/HeaderButton";
import * as productAction from "../../store/actions/productAction";
import Input from "../../components/UI/Input";
import Colors from "../../constants/Colors";

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

const EditProductsScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  const prodId = props.navigation.getParam("productId");
  const editedProduct = useSelector((state) =>
    state.products.userProducts.find((prod) => prod.id === prodId)
  );

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedProduct ? editedProduct.title : "",
      imageUrl: editedProduct ? editedProduct.imageUrl : "",
      description: editedProduct ? editedProduct.description : "",
      price: "",
    },
    inputValidities: {
      title: editedProduct ? true : false,
      imageUrl: editedProduct ? true : false,
      description: editedProduct ? true : false,
      price: editedProduct ? true : false,
    },
    formIsValid: editedProduct ? true : false,
  });

  const dispatch = useDispatch();

  const sumbitHandler = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert("wrong input", "Please check the form", [{ text: "Okey" }]);
      return;
    }
    setError(null);
    setIsLoading(true)
    try {
      if (editedProduct) {
        await dispatch(
          productAction.updateProduct(
            prodId,
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            formState.inputValues.description
          )
        );
      } else {
       await dispatch(
          productAction.createProduct(
            formState.inputValues.title,
            formState.inputValues.imageUrl,
            +formState.inputValues.price,
            formState.inputValues.description
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message)
    }
    setIsLoading(false)
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: sumbitHandler });
  }, [sumbitHandler]);

  useEffect(() => {
    if (error) {
      Alert.alert('An error occured', error, [{ text : 'Okey'}])
    }
  }, [error]);

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

  if (isLoading) {
    return (
      <View style={styles.centered}> 
        <ActivityIndicator size="large" color={Colors.primary} /> 
      </View>
    ) 
  }

  return (
    // <KeyboardAvoidingView style={{flex : 1}} behavior="padding" keyboardVerticalOffset={100}>
    <ScrollView>
      <View style={styles.form}>
        <Input
          id="title"
          label="Title"
          errorText="Please add valid title"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.title : ""}
          initiallyValid={!!editedProduct}
          required
        />
        <Input
          id="imageUrl"
          label="Image Url"
          errorText="Please add valid imageUrl"
          keyboardType="default"
          returnKeyType="next"
          onInputChange={inputChangeHandler}
          initialValue={editedProduct ? editedProduct.imageUrl : ""}
          initiallyValid={!!editedProduct}
          required
        />
        {editedProduct ? null : (
          <Input
            id="price"
            label="Price"
            errorText="Please add valid Price"
            keyboardType="decimal-pad"
            returnKeyType="next"
            onInputChange={inputChangeHandler}
            required
            min={0.1}
          />
        )}
        <Input
          id="description"
          label="Description"
          errorText="Please add valid description"
          keyboardType="default"
          autoCapitalize="sentences"
          autoCorrect
          multiline
          nuumerOfLines={3}
          initialValue={editedProduct ? editedProduct.description : ""}
          initiallyValid={!!editedProduct}
          onInputChange={inputChangeHandler}
          required
          minLength={5}
        />
      </View>
    </ScrollView>
    // </KeyboardAvoidingView>
  );
};

EditProductsScreen.navigationOptions = (navData) => {
  const submitFn = navData.navigation.getParam("submit");
  return {
    headerTitle: navData.navigation.getParam("productId")
      ? "Edit Product"
      : "Add Product",
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered : {
    flex : 1,
    justifyContent :'center',
    alignItems : 'center'
  }
});

export default EditProductsScreen;
