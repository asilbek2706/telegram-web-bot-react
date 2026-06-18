import Button from "../button/button";
import "./cart.css";

const Cart = () => {
  return (
    <div className="cart__container">
        <p>
            Umumiy narx: <span>$12.00</span>
        </p>
            <Button type="checkout" title={"Buyurtma"} />
    </div>
  )
}

export default Cart