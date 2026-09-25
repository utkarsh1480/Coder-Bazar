const Button = ({
  children,
  type = "button",
  onClick,
  disabled = false,
  loading = false,
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? "Loading..." : children}
    </button>
  );
};

export default Button;