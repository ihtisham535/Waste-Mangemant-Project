import "./Alert.css";

const Alert = ({ variant = "info", title, children }) => {
  return (
    <div className={`fwrs-alert ${variant}`.trim()} role="status">
      {title && <p className="fwrs-alert-title">{title}</p>}
      {children && <p className="fwrs-alert-text">{children}</p>}
    </div>
  );
};

export default Alert;
