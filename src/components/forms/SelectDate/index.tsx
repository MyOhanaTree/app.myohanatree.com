import React, { useState, useEffect, useRef } from "react";
import { InputWrap, InputDate, InputValue, LabelWrapper, Error } from "./styled";
import { Label, useThemeUI } from "theme-ui";
import DatePicker from "react-datepicker";
import moment from "moment";
import ReactDOM from "react-dom";

import { CalendarIcon, ChevronIcon } from "components/svg";

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
  $customStyles,
  $errors,
  $responseErrors,
  closeOnSelect = false,
  onChange,
}: {
  label?: string | React.ReactNode;
  name?: string;
  value?: string | number;
  description?: string;
  autoComplete?: string;
  minDate?: number;
  maxDate?: number;
  specialDates?: number[]
  required?: boolean;
  disabled?: boolean;
  startOfDay?: boolean;
  showTime?: boolean;
  $customStyles?: any;
  $errors?: any;
  $responseErrors?: any;
  closeOnSelect?: boolean;
  onChange?: (e?: any) => void;
}) => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const [borderError, setBorderError] = useState(false);
  const [active, setActive] = useState(false);

  const datePickerRef = useRef<any>(null);
  const wrapperRef = useRef<any>(null);
  const typingTimeoutRef = useRef<any>(null);

  const [inputLabel, setInputLabel] = useState("");
  const [dateValue, setDateValue] = useState<any>(value ?? null);

  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const inputDateRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);


  const highlightSpecialDates = (date: Date) => {
    return specialDates?.some((d) => d === moment(date.getTime()).startOf('day').unix()) ? "special-date" : "";
  };
  

  const calculatePosition = () => {
    if (!triggerRef.current || !inputDateRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = inputDateRef.current.getBoundingClientRect();
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    let top = triggerRect.bottom + scrollY - 8;
    if (spaceBelow < tooltipRect.height && spaceAbove >= tooltipRect.height) {
      top = triggerRect.top + scrollY - (tooltipRect.height + 12);
    }
    const style: React.CSSProperties = { top, left: triggerRect.right - tooltipRect.width };

    setTooltipStyle(style);
  };

  useEffect(() => {
    if (active) {
      calculatePosition();
    }
  }, [active]);

  const setSelectValue = async function (date: any) {
    if (disabled) return true;

    const momentDate = startOfDay ? moment(date).startOf("day").unix() : moment(date).endOf("day").unix();
    if ((!minDate || minDate <= momentDate) && (!maxDate || maxDate >= momentDate)) {
      setDateValue(momentDate);
      if (typeof onChange === "function") {
        onChange(momentDate);
        if (closeOnSelect) setActive(false);
      }
    }
  };

  const inputChange = (e?: any) => {
    setInputLabel(e.target.value);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      try {
        const newDate = moment(e.target.value).toDate();
        if (newDate) {
          setSelectValue(newDate);
          datePickerRef?.current?.setOpen(false);
          setTimeout(() => datePickerRef?.current?.setOpen(true), 500);
        }
      } catch (e) {}
    }, 1000);
  };

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (inputDateRef.current && !inputDateRef.current.contains(event.target)) {
        setActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputDateRef]);

  useEffect(() => {
    setDateValue(value);
  }, [value]);

  useEffect(() => {
    setInputLabel(dateValue ? moment.unix(dateValue).format("L") : "");
  }, [dateValue]);

  useEffect(() => {
    if ($responseErrors || $errors) {
      setBorderError(true);
    } else {
      setBorderError(false);
    }
  }, [$responseErrors, $errors]);

  return (
    <InputWrap $errors={borderError} $customStyles={$customStyles} disabled={disabled} ref={wrapperRef}>
      {label && (
        <LabelWrapper>
          <Label>{label}</Label>
          {required ? <span>*</span> : ""}
        </LabelWrapper>
      )}
      <InputValue ref={triggerRef} onClick={() => setActive(!active)} $active={active}>
        <CalendarIcon fill={theme?.colors?.base_800} />
        <input onChange={(e) => inputChange(e)} value={inputLabel} />
        <ChevronIcon fill={active ? theme?.colors?.base_800 : theme?.colors?.base_300} transform={"rotate(-90deg)"} />
      </InputValue>
      {active &&
        ReactDOM.createPortal(
          <InputDate ref={inputDateRef} style={tooltipStyle}>
            <DatePicker
              ref={datePickerRef}
              selected={dateValue ? moment.unix(dateValue).toDate() : undefined}
              minDate={minDate ? moment.unix(minDate).toDate() : undefined}
              maxDate={maxDate ? moment.unix(maxDate).toDate() : undefined}
              openToDate={dateValue ? moment.unix(dateValue).toDate() : moment().toDate()}
              onChange={setSelectValue}
              customInput={<></>}
              disabled={disabled}
              showTimeSelect={showTime}
              inline
              dayClassName={highlightSpecialDates}
              renderCustomHeader={({ date, decreaseYear, increaseYear, decreaseMonth, increaseMonth }) => (
                <div className="react-datepicker__custom-year-selector">
                  <span className="react-datepicker__current-month">
                    {date.toLocaleDateString("en-US", { year: "numeric", month: "long" })}
                  </span>
                  <div className="react-datepicker__navigation">
                    <span
                      className="react-datepicker__navigation-icon react-datepicker__navigation-icon-double react-datepicker__navigation-icon--previous"
                      onClick={decreaseYear}
                    >
                      {"<<"}
                    </span>
                    <span
                      className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous"
                      onClick={decreaseMonth}
                    >
                      {"<"}
                    </span>
                    <span
                      className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next"
                      onClick={increaseMonth}
                    >
                      {">"}
                    </span>
                    <span
                      className="react-datepicker__navigation-icon react-datepicker__navigation-icon-double react-datepicker__navigation-icon--next"
                      onClick={increaseYear}
                    >
                      {">>"}
                    </span>
                  </div>
                </div>
              )}
            />
          </InputDate>,
          document.body
        )}
      {description && (
        <p>
          <small>{description}</small>
        </p>
      )}
      {$errors && <Error>{$errors}</Error>}
    </InputWrap>
  );
};

export default SelectDate;
