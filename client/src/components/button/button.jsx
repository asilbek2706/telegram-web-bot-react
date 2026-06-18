import "./button.css";

const Button = (props) => {
  const { type, title, onClick, disabled } = props;

  return (
    <button className={`btn ${type}`} onClick={onClick} disabled={disabled}>
      {title}
    </button>
  );
};

export default Button;
