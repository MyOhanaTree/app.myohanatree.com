import React, { useState, useEffect } from "react";
import { fieldWrapper, inputBase, labelWrapper, errorText, helperText } from "../shared";
import Button from "../Button";
import EyeIcon from "@/components/icons/Eye";
import EyeOffIcon from "@/components/icons/EyeOff";

type PasswordInputProps = {
  name?: string;
  label?: string | React.ReactNode;
  value?: string;
  pattern?: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  autoComplete?: string;
  sx?: React.CSSProperties;
  $errors?: any;
  onChange?: (e: any) => void;
};

const PasswordInput = ({
  name,
  label,
  value,
  pattern,
  placeholder,
  required,
  description,
  autoComplete,
  sx,
  $errors,
  onChange,
}: PasswordInputProps) => {
  const [borderError, setBorderError] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setBorderError(!!$errors);
  }, [$errors]);

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
          pattern={pattern}
          autoComplete={autoComplete}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          required={required}
          className={`${inputBase} h-11 pr-10 ${borderError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200" : ""}`}
        />
        <Button
          type="button"
          onClick={() => setVisible((v) => !v)}
          variant="ghost"
          size="icon"
          className="absolute inset-y-0 right-1 h-9 w-9 self-center text-slate-500 hover:bg-slate-100 hover:text-slate-700 shadow-none"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOffIcon /> : <EyeIcon />}
        </Button>
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
