import React, { useState, useEffect } from "react";
import { fieldWrapper, inputBase, labelWrapper, errorText, helperText } from "../shared";

type TextInputProps = {
  name?: string;
  label?: string | React.ReactNode;
  value?: string | number;
  description?: string;
  type?: any;
  autoComplete?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  rows?: number;
  className?: string;
  wrapperClassName?: string;
  sx?: React.CSSProperties;
  $errors?: any;
  onChange?: (e?: any) => void;
};

const TextInput = ({
  name,
  label,
  value,
  description,
  type,
  autoComplete,
  required,
  disabled,
  readonly,
  placeholder,
  min,
  max,
  step,
  rows,
  className,
  wrapperClassName,
  sx,
  $errors,
  onChange,
}: TextInputProps) => {
  const [borderError, setBorderError] = useState(false);

  const setSelectValue = function (e: any) {
    if (disabled) return true;

    let nextValue = e.target.value;

    if (type === "number") {
      nextValue = parseFloat(e.target.value);
      if (min && nextValue < (min as number)) {
        nextValue = min;
      }
      if (max && nextValue > (max as number)) {
        nextValue = max;
      }
    }

    if (typeof onChange === "function") {
      onChange(nextValue);
    }
  };

  useEffect(() => {
    setBorderError(!!$errors);
  }, [$errors]);

  const baseClasses = `${inputBase} ${className} ${borderError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200" : ""}`;

  return (
    <div className={`${fieldWrapper} ${wrapperClassName ?? ""}`.trim()} style={sx}>
      {label && (
        <div className={labelWrapper}>
          <span>{label}</span>
          {required ? <span className="text-rose-600">*</span> : ""}
        </div>
      )}
      {type === "textarea" ? (
        <textarea
          name={name}
          disabled={disabled}
          readOnly={readonly}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={min as number | undefined}
          maxLength={max as number | undefined}
          value={value ?? ""}
          rows={rows ?? 4}
          onChange={(e: any) => setSelectValue(e)}
          className={`${baseClasses} min-h-[120px]`}
        />
      ) : (
        <input
          type={type || "text"}
          name={name}
          disabled={disabled}
          readOnly={readonly}
          placeholder={placeholder}
          autoComplete={autoComplete}
          min={min as any}
          max={max as any}
          step={step as any}
          value={value ?? ""}
          onChange={(e: any) => setSelectValue(e)}
          className={`${baseClasses} h-11`}
        />
      )}
      {description && (
        <p className={helperText}>
          <small>{description}</small>
        </p>
      )}
      {$errors && <div className={errorText}>{$errors}</div>}
    </div>
  );
};

export default TextInput;
