import Button from "../button/button";
import { totalPrice } from "../units/total-price";
import "./cart.css";

const Cart = ({ cartItems }) => {
  return (
    <div className="cart__container">
      <>
        {cartItems.length !== 0 && (
          <p>
            Umumiy narx: <span>${totalPrice(cartItems).toFixed(2)}</span>
          </p>
        )}
        <Button
          type="checkout"
          title={`${cartItems.length === 0 ? "Buyurtma berish" : "To'lov qilish"}`}
          disabled={cartItems.length === 0 ? true : false}
        />
      </>
    </div>
  );
};

export default Cart;
