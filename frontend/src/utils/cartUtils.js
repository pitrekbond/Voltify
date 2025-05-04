function addDecimals(num) {
  return (Math.round(num * 100) / 100).toFixed(2);
}

export function updateCartPrices(state) {
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  state.taxPrice = addDecimals(0.15 * state.itemsPrice);

  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10);

  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2);

  localStorage.setItem("cart", JSON.stringify(state));
}
