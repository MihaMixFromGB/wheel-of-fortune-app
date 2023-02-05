import "./InfoItem.css";

const InfoItem = ({ label, value }) => {
  return (
    <div className="info__container">
      <p>
        {label} {value}
      </p>
    </div>
  );
};

export default InfoItem;
