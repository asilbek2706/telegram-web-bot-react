export const totalPrice = (arr) => {
  return arr.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
