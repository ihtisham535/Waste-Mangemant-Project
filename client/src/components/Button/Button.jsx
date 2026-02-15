import "./Button.css";

const Button = ({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) => {
  const classes = `fwrs-btn ${variant} ${size} ${className}`.trim();

  return <button className={classes} type={type} {...props} />;
};

export default Button;
