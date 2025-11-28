import React, { useState, useEffect } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { fieldWrapper, inputBase, labelWrapper, errorText, helperText } from "../shared";

type PasswordInputProps = {
  name?: string;
  label?: string | React.ReactNode;
  value?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  autoComplete?: string;
  sx?: React.CSSProperties;
  $errors?: any;
  $responseErrors?: any;
  onChange?: (e: any) => void;
};

const PasswordInput = ({
  name,
  label,
  value,
  placeholder,
  required,
  description,
  autoComplete,
  sx,
  $errors,
  $responseErrors,
  onChange,
}: PasswordInputProps) => {
  const [borderError, setBorderError] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setBorderError(!!($responseErrors || $errors));
  }, [$responseErrors, $errors]);

  return (
    <div className={fieldWrapper} style={sx}>
      {label && (
        <div className={labelWrapper}>
          <span>{label}</span>
          {required ? <span className="text-rose-600">*</span> : ""}
        </div>
      )}
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          name={name}
          value={value ?? ""}
          autoComplete={autoComplete}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`${inputBase} h-11 pr-10 ${borderError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200" : ""}`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-2 flex items-center text-slate-500 hover:text-slate-700"
        >
          {visible ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
        </button>
      </div>
      {description && (
        <p className={helperText}>
          <small>{description}</small>
        </p>
      )}
      {$errors && <div className={errorText}>{$errors}</div>}
    </div>
  );
};

export default PasswordInput;
