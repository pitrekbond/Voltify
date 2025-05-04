import { createSlice } from "@reduxjs/toolkit";
import { updateCartPrices } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: function (state, action) {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      updateCartPrices(state);
    },
    removeFromCart: function (state, action) {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
      updateCartPrices(state);
    },
    saveShippingAddress: function (state, action) {
      state.shippingAddress = action.payload;
      updateCartPrices(state);
    },
    savePaymentMethod: function (state, action) {
      state.paymentMethod = action.payload;
      updateCartPrices(state);
    },
    clearCart: function (state, action) {
      state.cartItems = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
