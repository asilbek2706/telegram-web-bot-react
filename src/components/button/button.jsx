import "./button.css";

const Button = (props) => {
  const { type, title, onClick } = props;

  return (
    <button className={`btn ${type}`} onClick={onClick}>
      {title}
    </button>
  );
};

export default Button;
