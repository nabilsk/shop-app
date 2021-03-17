import CartItem from "../../models/cartItem";
import { ADD_TO_CART, REMOVE_FROM_CART } from "../actions/cartActions";
import { ADD_ORDER } from "../actions/orderActions";
import { DELETE_PRODUCT } from "../actions/productAction";

const initialState = {
  items: {},
  totalAmount: 0,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const addedProduct = action.product;
      const prodPrice = addedProduct.price;
      const prodTitle = addedProduct.title;

      let updatedorNewCartItem;

      if (state.items[addedProduct.id]) {
        // alery have the item in the cart
        updatedorNewCartItem = new CartItem(
          state.items[addedProduct.id].quantity + 1,
          prodPrice,
          prodTitle,
          state.items[addedProduct.id].sum + prodPrice
        );
      } else {
        updatedorNewCartItem = new CartItem(1, prodPrice, prodTitle, prodPrice);
      }
      return {
        ...state,
        items: { ...state.items, [addedProduct.id]: updatedorNewCartItem },
        totalAmount: state.totalAmount + prodPrice,
      };
    case REMOVE_FROM_CART:
      const selectecItems = state.items[action.pid];
      let updatedCartItems;
      const currentQTY = selectecItems.quantity;
      if (currentQTY > 1) {
        // reduce item not delete it
        const updatedCartItem = new CartItem(
          selectecItems.quantity - 1,
          selectecItems.productPrice,
          selectecItems.productTitle,
          selectecItems.sum - selectecItems.productPrice
        );
        updatedCartItems = { ...state.items, [action.pid]: updatedCartItem };
      } else {
        updatedCartItems = { ...state.items };
        delete updatedCartItems[action.pid];
      }
      return {
        ...state,
        items: updatedCartItems,
        totalAmount: state.totalAmount - selectecItems.productPrice,
      };
    case ADD_ORDER:
      return initialState;

    case DELETE_PRODUCT:
      if (!state.items[action.pid]) {
        return state;
      }
      const updatedItem = { ...state.items };
      const itemTotal = state.items[action.pid].sum;
      delete updatedItem[action.pid];
      return {
        ...state,
        items: updatedItem,
        totalAmount: state.totalAmount - itemTotal,
      };
  }
  return state;
};
