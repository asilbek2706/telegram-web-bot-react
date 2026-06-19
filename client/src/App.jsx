import { useState, useEffect, useCallback } from "react";
import "./App.css";
import Card from "./components/card/card";
import Cart from "./components/cart/cart";
import { getData } from "./constants/db";

const courses = getData();
const telegram = window.Telegram.WebApp;

const App = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    telegram.ready();
  }, []);

  useEffect(() => {
    telegram.MainButton.text = "Sotib olish  :)";
    if (cartItems.length > 0) {
      telegram.MainButton.show();
    } else {
      telegram.MainButton.hide();
    }
  }, [cartItems]);

  const onAddItems = (item) => {
    const existItem = cartItems.find((x) => x.id === item.id);

    if (existItem) {
      setCartItems(
        cartItems.map((x) =>
          x.id === item.id
            ? { ...existItem, quantity: existItem.quantity + 1 }
            : x,
        ),
      );
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const onRemoveItems = (item) => {
    const existItem = cartItems.find((x) => x.id === item.id);

    if (!existItem) return; // Crashdan himoya

    if (existItem.quantity === 1) {
      setCartItems(cartItems.filter((x) => x.id !== item.id));
    } else {
      setCartItems(
        cartItems.map((x) =>
          x.id === item.id
            ? { ...existItem, quantity: existItem.quantity - 1 }
            : x,
        ),
      );
    }
  };

  const onSendData = useCallback(() => {
    const queryId = telegram.initDataUnsafe?.query_id;

    if (queryId) {
      fetch("https://telegramwebapibot-b671371abfbb.herokuapp.com/web-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: cartItems, queryId: queryId }),
      });
    } else {
      telegram.sendData(JSON.stringify(cartItems));
    }
  }, [cartItems]);

  useEffect(() => {
    telegram.onEvent("mainButtonClicked", onSendData);
    return () => {
      telegram.offEvent("mainButtonClicked", onSendData);
    };
  }, [onSendData]);

  return (
    <div className="container">
      <div className="app__header">
        <h1 className="app__title">Asil Kurslar</h1>
      </div>
      <Cart cartItems={cartItems} />
      <div className="cards__container">
        {courses.map((course) => (
          <Card
            key={course.id}
            course={course}
            onAddItems={onAddItems}
            onRemoveItems={onRemoveItems}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
