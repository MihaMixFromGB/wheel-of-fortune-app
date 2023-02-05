import defaultAvatar from "../img/avatar.png";
import coins from "../img/coins-small.png";
import "./Winner.css";

const Winner = ({ name, avatar, prize }) => {
  return (
    <div className="winner">
      <div className="winner__user-info">
        <img src={avatar ? avatar : defaultAvatar} alt={name} />
        <p className="winner_text">{name}</p>
      </div>

      <div className="winner__prize">
        {prize && prize.toLowerCase() === "jackpot" ? (
          <WinnerJackpot />
        ) : (
          <WinnerItem prize={prize} />
        )}
        <p className="winner__prize_timestamp winner_text">24 c.</p>
      </div>
    </div>
  );
};

const WinnerItem = ({ prize }) => {
  return (
    <p className="winner__prize_item winner_text">
      {prize}
      <span>
        <img src={coins} />
      </span>
    </p>
  );
};

const WinnerJackpot = (props) => {
  return <p className="winner__prize_jackpot">JACKPOT</p>;
};

export default Winner;
