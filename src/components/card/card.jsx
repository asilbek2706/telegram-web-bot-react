import "./card.css";
import Button from "../button/button";

const Card = (props) => {
  const { course } = props;

  return (
    <div className="card">
      <span className="card__badge">1</span>

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
        <Button type="add" title={"+"} />
        <Button type="remove" title={"-"} />
      </div>
    </div>
  );
};

export default Card;
