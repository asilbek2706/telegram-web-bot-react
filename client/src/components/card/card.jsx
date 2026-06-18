import "./card.css";
import Button from "../button/button";
import { useState } from "react";

const Card = (props) => {
  const { course, onAddItems, onRemoveItems } = props;
  const [count, setCount] = useState(0);

  const handleIncrement = () => {
    setCount((prevCount) => prevCount + 1);
    onAddItems(course);
  };

  const handleDecrement = () => {
    setCount((prevCount) => Math.max(prevCount - 1, 0));
    onRemoveItems(course);
  };

  return (
    <div className="card">
      <span className={`${count !== 0 ? "card__badge" : "card__badge-hidden"}`}>
        {count}
      </span>

      <div className="image__container">
        <img src={course.Image} alt={course.title} />
      </div>

      <div className="card__body">
        <h2 className="card__title">{course.title}</h2>
        <div className="card__price">
          {course.price.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
          })}
        </div>
      </div>

      <div className="hr"></div>

      <div className="btn-container">
        <Button type="add" title={"+"} onClick={handleIncrement} />
        {count !== 0 && (
          <Button type="remove" title={"-"} onClick={handleDecrement} />
        )}
      </div>
    </div>
  );
};

export default Card;
