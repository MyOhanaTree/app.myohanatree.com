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
    setBorderError(!!($errors));
  }, [$errors]);

  return (
    <div className={fieldWrapper} style={sx}>
      {label && (
        <div className={labelWrapper}>
          <span>{label}</span>
          {required ? <span className="text-rose-600">*</span> : ""}
        </div>
      )}
      <div
        role="switch"
        aria-checked={newChecked}
        tabIndex={0}
        onClick={setSelectValue}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setSelectValue();
          }
        }}
        className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-2 text-sm font-medium transition ${
          borderError ? "border-rose-400" : "border-slate-300 bg-white"
        }`}
      >
        <span
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition ${
            newChecked ? "bg-primary-600" : "bg-slate-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition ${
              newChecked ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </span>
        <span
          className="select-none text-slate-700"
        >
          {newChecked ? labelTrue || "On" : labelFalse || "Off"}
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
