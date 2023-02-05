import Winner from "./Winner";

import "./Winners.css";

const Winners = ({ winners }) => {
  return (
    <div className="winners">
      <h2>Winners</h2>
      {winners.map((winner, idx) => (
        <Winner key={idx} {...winner} />
      ))}
    </div>
  );
};

export default Winners;
