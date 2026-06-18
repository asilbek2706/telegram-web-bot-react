import "./button.css";

const Button = (props) => {
  const { type, title } = props;

  return <button className={`btn ${type}`}>{title}</button>;
};

export default Button;
