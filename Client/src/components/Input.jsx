import React from 'react'
function Input({
    label,
    className,
    error,
    ...props
}) {
  return (
  <div className="input-group">
{label && (<label htmlFor={name}>{label}</label>)}
   <input
   id={props.name}
   className={className}
   {...props}
   />
  {error && (
        <p className="input-error">
          {error}
        </p>
      )}
   </div>
  )
}

export default Input