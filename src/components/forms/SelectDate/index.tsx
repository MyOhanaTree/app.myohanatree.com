import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { MdCalendarMonth } from "react-icons/md";
import { fieldWrapper, inputBase, labelWrapper, errorText, helperText } from "../shared";
import "./datepicker.css"

type SelectDateProps = {
  label?: string | React.ReactNode;
  name?: string;
  value?: string | number;
  description?: string;
  autoComplete?: string;
  minDate?: number;
  maxDate?: number;
  specialDates?: number[];
  required?: boolean;
  disabled?: boolean;
  startOfDay?: boolean;
  showTime?: boolean;
  sx?: React.CSSProperties;
  $errors?: any;
  $responseErrors?: any;
  closeOnSelect?: boolean;
  onChange?: (e?: any) => void;
};

const SelectDate = ({
  label,
  name = "date",
  value,
  description,
  autoComplete,
  minDate,
  maxDate,
  specialDates,
  required,
  disabled = false,
  startOfDay = true,
  showTime = false,
  sx,
  $errors,
  $responseErrors,
  closeOnSelect = false,
  onChange,
}: SelectDateProps) => {
  const [borderError, setBorderError] = useState(false);
  const [dateValue, setDateValue] = useState<any>(value ?? null);

  const toUnix = (date: Date, endOfDay?: boolean) => {
    const copy = new Date(date);
    if (endOfDay) {
      copy.setHours(23, 59, 59, 999);
    } else {
      copy.setHours(0, 0, 0, 0);
    }
    return Math.floor(copy.getTime() / 1000);
  };

  const highlightSpecialDates = (date: Date) => {
    return specialDates?.some((d) => d === toUnix(date, false)) ? "special-date" : "";
  };

  const handleChange = (date: Date | null) => {
    if (disabled) return;
    if (!date) {
      setDateValue(null);
      onChange?.(null);
      return;
    }
    const momentDate = startOfDay ? toUnix(date, false) : toUnix(date, true);
    if ((!minDate || minDate <= momentDate) && (!maxDate || maxDate >= momentDate)) {
      setDateValue(momentDate);
      onChange?.(momentDate);
      if (closeOnSelect) {
        // noop; DatePicker closes automatically
      }
    }
  };

  useEffect(() => {
    setDateValue(value ?? null);
  }, [value]);

  useEffect(() => {
    setBorderError(!!($responseErrors || $errors));
  }, [$responseErrors, $errors]);

  const selectedDate = dateValue ? new Date((dateValue as number) * 1000) : null;

  return (
    <div className={fieldWrapper} style={sx}>
      {label && (
        <div className={labelWrapper}>
          <span>{label}</span>
          {required ? <span className="text-rose-600">*</span> : ""}
        </div>
      )}
      <div className="relative">
        <DatePicker
          selected={selectedDate || undefined}
          onChange={handleChange}
          minDate={minDate ? new Date((minDate as number) * 1000) : undefined}
          maxDate={maxDate ? new Date((maxDate as number) * 1000) : undefined}
          placeholderText="Select date"
          className={`${inputBase} h-11 pr-10 ${borderError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200" : ""}`}
          name={name}
          autoComplete={autoComplete}
          showTimeSelect={showTime}
          dateFormat={showTime ? "Pp" : "P"}
          dayClassName={highlightSpecialDates}
        />
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500">
          <MdCalendarMonth />
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
};

export default SelectDate;
