const Textarea = ({
  label,
  name,
  error,
  rows = 5,
  className = "",
  ...props
}) => {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={name}>
          {label}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        rows={rows}
        className={className}
        {...props}
      />

      {error && (
        <p className="input-error">
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;