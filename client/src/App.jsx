import { useState, useEffect } from "react";
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
  });

  const onAddItems = (item) => {
    const existItem = cartItems.find((x) => x.id === item.id);

    if (existItem) {
      const newData = cartItems.map((x) =>
        x.id === item.id
          ? { ...existItem, quantity: existItem.quantity + 1 }
          : x,
      );
      setCartItems(newData);
    } else {
      const newData = [...cartItems, { ...item, quantity: 1 }];
      setCartItems(newData);
    }
  };

  const onRemoveItems = (item) => {
    const existItem = cartItems.find((x) => x.id === item.id);

    if (existItem.quantity === 1) {
      const newData = cartItems.filter((x) => x.id !== item.id);
      setCartItems(newData);
    } else {
      const newData = cartItems.map((x) =>
        x.id === item.id
          ? { ...existItem, quantity: existItem.quantity - 1 }
          : x,
      );
      setCartItems(newData);
    }
  };

  const onCheckout = () => {
    telegram.mainButton.text = "Sotib olish";
    telegram.MainButton.show();
  };

  return (
    <div className="container">
      <div className="app__header">
        <h1 className="app__title">Asil Kurslar</h1>
      </div>
      <Cart cartItems={cartItems} onCheckout={onCheckout} />
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
