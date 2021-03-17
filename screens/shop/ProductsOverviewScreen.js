import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  Button,
  View,
  FlatList,
  Text,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import HeaderButton from "../../components/UI/HeaderButton";
import ProductItem from "../../components/shop/ProductItem";
import * as cartActions from "../../store/actions/cartActions";
import * as productAction from "../../store/actions/productAction";
import Colors from "../../constants/Colors";

const ProductsOverviewScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing ] = useState(false);
  const [error, setError] = useState();
  const products = useSelector((state) => state.products.availableProducts);
  const dispatch = useDispatch();

  const loadProduct = useCallback(async () => {
    setError(null);
    setRefreshing(true);
    try {
      await dispatch(productAction.fetchProducts());
    } catch (err) {
      setError(err.message);
    }

    setRefreshing(false);
  }, [dispatch, setError, setIsLoading]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener("willFocus", loadProduct);
    return () => {
      willFocusSub.remove();
    };
  }, [loadProduct]);

  useEffect(() => {
    setIsLoading(true)
    loadProduct().then(() => {
      setIsLoading(false)
    });
  }, [dispatch]);

  const selectItemhandler = (id, title) => {
    props.navigation.navigate("ProductDetail", {
      productId: id,
      productTitle: title,
    });
  };

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>An error occured</Text>
        <Button title="Retry" color={Colors.primary} onPress={loadProduct} />
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>no products found, add some</Text>
      </View>
    );
  }

  return (
    <FlatList
    onRefresh={loadProduct}
    refreshing={refreshing}
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={(itemData) => (
        <ProductItem
          image={itemData.item.imageUrl}
          title={itemData.item.title}
          price={itemData.item.price}
          onSelect={() => {
            selectItemhandler(itemData.item.id, itemData.item.title);
          }}
        >
          <Button
            color={Colors.primary}
            title="View Detail"
            onPress={() => {
              selectItemhandler(itemData.item.id, itemData.item.title);
            }}
          />
          <Button
            color={Colors.primary}
            title="To Cart"
            onPress={() => {
              dispatch(cartActions.addToCart(itemData.item));
            }}
          />
        </ProductItem>
      )}
    />
  );
};

ProductsOverviewScreen.navigationOptions = (navData) => {
  return {
    headerTitle: "All Products",
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Cart"
          iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
          onPress={() => {
            navData.navigation.navigate("Cart");
          }}
        />
      </HeaderButtons>
    ),
  };
};

export default ProductsOverviewScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
