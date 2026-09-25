const Select = ({
label,
  name,
  options = [],
  error,
  className = "",
  ...props
}) =>{
  return (
    <div className="input-group">
    {label && (<label htmlFor={name}>Select {label}</label>)}
    
    <select
    id={name}
    name={name}
    className={className}
    {...props}
    >
        <option value="">Select {label}</option>
         {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
    </select>
          {error && (
        <p className="input-error">
          {error}
        </p>
      )}

    </div>
  )
}
export default Select;