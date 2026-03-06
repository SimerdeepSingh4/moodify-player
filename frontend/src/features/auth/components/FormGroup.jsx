import React from 'react'

const FormGroup = ({ label, placeholder, value, onChange }) => {
  const id = label.toLowerCase()

  const type =
    id.includes('password') || label.toLowerCase() === 'password'
      ? 'password'
      : id.includes('email') || label.toLowerCase() === 'email'
        ? 'email'
        : 'text'

  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required
      />
    </div>
  )
}

export default FormGroup