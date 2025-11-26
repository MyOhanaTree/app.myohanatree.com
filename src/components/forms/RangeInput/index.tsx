import React, { useState, useEffect } from "react";
import { fieldWrapper, inputBase, labelWrapper, errorText, helperText } from "../shared";

type RangeInputProps = {
  name?: string;
  label?: string | React.ReactNode;
  labelFrom?: string | React.ReactNode;
  labelTo?: string | React.ReactNode;
  value?: number[];
  description?: string;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  sx?: React.CSSProperties;
  $responseErrors?: any;
  $errors?: any;
  onChange?: (e?: any) => void;
};

const RangeInput = ({
  name,
  label,
  labelFrom,
  labelTo,
  value,
  description,
  required,
  disabled,
  readonly,
  min,
  max,
  step,
  sx,
  $errors,
  $responseErrors,
  onChange,
}: RangeInputProps) => {
  const [borderError, setBorderError] = useState(false);

  const handleChange = (e: any, type: "from" | "to") => {
    if (disabled) return;

    let val = parseFloat(e.target.value);
    if (min !== undefined && val < (min as number)) val = min as number;
    if (max !== undefined && val > (max as number)) val = max as number;

    const current: number[] = value ? [...value] : [];
    if (type === "from") {
      current[0] = val;
    } else {
      current[1] = val;
    }
    onChange?.(current[0] || current[1] ? current : null);
  };

  useEffect(() => {
    setBorderError(!!($responseErrors || $errors));
  }, [$responseErrors, $errors]);

  const inputClass = `${inputBase} h-11 ${borderError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200" : ""}`;

  return (
    <div className={fieldWrapper} style={sx}>
      {label && (
        <div className={labelWrapper}>
          <span>{label}</span>
          {required ? <span className="text-rose-600">*</span> : ""}
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
          <span>{labelFrom || "From"}</span>
          <input
            type="number"
            name={`${name}[from]`}
            disabled={disabled}
            readOnly={readonly}
            min={min as any}
            max={max as any}
            step={step as any}
            value={value?.[0] ?? ""}
            onChange={(e) => handleChange(e, "from")}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-700">
          <span>{labelTo || "To"}</span>
          <input
            type="number"
            name={`${name}[to]`}
            disabled={disabled}
            readOnly={readonly}
            min={min as any}
            max={max as any}
            step={step as any}
            value={value?.[1] ?? ""}
            onChange={(e) => handleChange(e, "to")}
            className={inputClass}
          />
        </label>
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

export default RangeInput;
