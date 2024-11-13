export default function Button(props) {
  const {
    className = "btn btn-primary me-2",
    onClick,
    type = "button",
    disabled,
    children,
  } = props;

  return (
    <button
      className={className}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
