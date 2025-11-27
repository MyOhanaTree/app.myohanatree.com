import React, { useEffect, useState } from "react";
import { fieldWrapper, labelWrapper, errorText, helperText } from "../shared";

type ToggleInputProps = {
  label?: string | React.ReactNode;
  description?: string;
  labelTrue?: string;
  labelFalse?: string;
  required?: boolean;
  checked?: boolean;
  sx?: React.CSSProperties;
  $responseErrors?: any;
  $errors?: any;
  onChange?: (e?: any) => void;
};

export default function ToggleInput({
  label,
  description,
  labelTrue,
  labelFalse,
  required,
  checked,
  sx,
  $responseErrors,
  $errors,
  onChange,
}: ToggleInputProps) {
  const [borderError, setBorderError] = useState(false);
  const [newChecked, setNewChecked] = useState<boolean>(checked || false);

  const setSelectValue = function () {
    const next = !newChecked;
    setNewChecked(next);
    onChange?.(next);
  };

  useEffect(() => {
    setNewChecked(checked || false);
  }, [checked]);

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
      <div
        onClick={setSelectValue}
        className={`inline-flex overflow-hidden rounded-lg border text-sm font-semibold shadow-sm transition ${
          borderError ? "border-rose-400" : "border-slate-200"
        }`}
      >
        <span
          className={`px-4 py-2 ${newChecked ? "bg-emerald-500 text-white" : "bg-white text-slate-700"}`}
        >
          {labelTrue || "On"}
        </span>
        <span
          className={`px-4 py-2 ${!newChecked ? "bg-slate-900 text-emerald-100" : "bg-white text-slate-700"}`}
        >
          {labelFalse || "Off"}
        </span>
      </div>
      {description && (
        <p className={helperText}>
          <small>{description}</small>
        </p>
      )}
      {$errors && <div className={errorText}>{$errors}</div>}
    </div>
  );
}
