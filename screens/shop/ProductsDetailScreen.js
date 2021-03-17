import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Image,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import Colors from "../../constants/Colors";
import * as cartActions from "../../store/actions/cartActions";

const ProductsDetailScreen = (props) => {
  const productId = props.navigation.getParam("productId");
  const selectedItem = useSelector((state) =>
    state.products.availableProducts.find((prod) => prod.id === productId)
  );
  const dispatch = useDispatch();
  return (
    <ScrollView>
      <Image style={styles.image} source={{ uri: selectedItem.imageUrl }} />
      <View style={styles.actions}>
        <Button
          color={Colors.primary}
          title="Add To Cart"
          onPress={() => {
            dispatch(cartActions.addToCart(selectedItem));
          }}
        />
      </View>
      <Text style={styles.price}>${selectedItem.price.toFixed(2)}</Text>
      <Text style={styles.descrip}>{selectedItem.description}</Text>
    </ScrollView>
  );
};

ProductsDetailScreen.navigationOptions = (navData) => {
  return {
    headerTitle: navData.navigation.getParam("productTitle"),
  };
};

export default ProductsDetailScreen;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 300,
  },
  actions: {
    marginVertical: 10,
    alignItems: "center",
  },
  price: {
    fontFamily: "open-sans-bold",
    fontSize: 20,
    textAlign: "center",
    color: "#888",
    marginVertical: 15,
  },
  descrip: {
    fontFamily: "open-sans",
    fontSize: 14,
    textAlign: "center",
    marginHorizontal: 20,
  },
});
