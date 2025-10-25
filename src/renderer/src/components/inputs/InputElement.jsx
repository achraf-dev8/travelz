import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export const InputElement = ({
  display,
  name,
  type = "text",
  onChange,
  value,
  error = null,
  onBlur,
  touched,
  style,
  hidden = false,
  realStyle,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div
      className={`input-container ${hidden ? "hidden" : ""}`}
      style={{ position: "relative", ...realStyle }}
    >
      <p>{display}</p>
      <div style={{ position: "relative", ...realStyle }}>
      <input
        className={`${touched && error ? "input-error" : ""} ${
          style ? "no-radius" : ""
        }`}
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        style={{ paddingRight: isPassword ? "40px" : undefined }}
      />
      {isPassword && (
        <FontAwesomeIcon
          icon={showPassword ? faEyeSlash : faEye}
          onClick={() => setShowPassword((prev) => !prev)}
          style={{
  position: "absolute",
  right: "14px",
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: "20px",
  cursor: "pointer",
  color: "var(--grey-dark)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}}
        />
      )}
      </div>
      <p className="error">{error}</p>
    </div>
  );
};
