import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { MdCalendarMonth } from "react-icons/md";
import { fieldWrapper, inputBase, labelWrapper, errorText, helperText } from "../shared";
import "../SelectDate/datepicker.css"

type SelectDateRangeProps = {
  label?: string | React.ReactNode;
  nameStartDate?: string;
  nameEndDate?: string;
  value?: number[];
  minDate?: number;
  maxDate?: number;
  description?: string;
  required?: boolean;
  sx?: React.CSSProperties;
  errors?: any;
  responseErrors?: any;
  onChange?: (e?: any) => void;
};

const SelectDateRange = ({
  label,
  nameStartDate = "startDate",
  nameEndDate = "endDate",
  value,
  minDate,
  maxDate,
  description,
  required,
  sx,
  errors,
  responseErrors,
  onChange,
}: SelectDateRangeProps) => {
  const [borderError, setBorderError] = useState<boolean>(false);
  const toUnixStart = (date: Date) => {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return Math.floor(copy.getTime() / 1000);
  };

  const toUnixEnd = (date: Date) => {
    const copy = new Date(date);
    copy.setHours(23, 59, 59, 999);
    return Math.floor(copy.getTime() / 1000);
  };

  const [range, setRange] = useState<[Date | null, Date | null]>([
    value?.[0] ? new Date(value[0] * 1000) : null,
    value?.[1] ? new Date(value[1] * 1000) : null,
  ]);

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setRange([start, end]);
    if (start && end) {
      onChange?.([toUnixStart(start), toUnixEnd(end)]);
    }
  };

  useEffect(() => {
    setBorderError(!!(responseErrors || errors));
  }, [responseErrors, errors]);

  useEffect(() => {
    setRange([
      value?.[0] ? new Date(value[0] * 1000) : null,
      value?.[1] ? new Date(value[1] * 1000) : null,
    ]);
  }, [value]);

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
          selectsRange
          startDate={range[0] || undefined}
          endDate={range[1] || undefined}
          onChange={(dates) => handleChange(dates as [Date | null, Date | null])}
          minDate={minDate ? new Date(minDate * 1000) : undefined}
          maxDate={maxDate ? new Date(maxDate * 1000) : undefined}
          className={`${inputBase} h-11 pr-10 ${borderError ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200" : ""}`}
          placeholderText="Select date range"
          name={`${nameStartDate}-${nameEndDate}`}
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
      {errors && <div className={errorText}>{errors}</div>}
    </div>
  );
};

export default SelectDateRange;
