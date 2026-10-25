import React from "react";

function Input({
  value,
  onChange,
  placeholder = "Search..."
}) {
  return (
    <div className="input-wrapper">

      <span className="input-icon">
        ⌕
      </span>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />

    </div>
  );
}

export default Input;