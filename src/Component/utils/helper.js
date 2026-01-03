export const filterCartProduct = (cartItems = [], product) => {
  if (!Array.isArray(cartItems)) return [];

  return cartItems?.filter(
    (item) =>
      // item.product_id === product.id?.toString() &&
      item?.product_name === product?.name
  );
};