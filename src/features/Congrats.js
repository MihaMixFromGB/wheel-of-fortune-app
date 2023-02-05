import Button from "../components/Button";

import coins from "../img/coins-big.png";
import "./Congrats.css";

const Congrats = ({ prize, onClick }) => {
  return (
    <div className="congrats">
      <h3 className="congrats_text">YOU WIN!</h3>
      <p className="congrats_text">
        {prize}
        <span>
          <img src={coins} alt="coins" />
        </span>
      </p>
      <Button label={"GREAT"} onClick={onClick} />
    </div>
  );
};

export default Congrats;
