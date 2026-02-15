import "./Card.css";

const Card = ({ className = "", children, ...props }) => {
  return (
    <div className={`fwrs-card fwrs-card-shell ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export default Card;
