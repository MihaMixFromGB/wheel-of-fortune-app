import "./Button.css";

const Button = ({ label, onClick }) => {
  return (
    <div className="button__container">
      <button onClick={onClick ? onClick : () => {}}>{label}</button>
    </div>
  );
};

export default Button;
