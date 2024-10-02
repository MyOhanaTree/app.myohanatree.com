import React, { useCallback, useState, useEffect, useRef, useMemo } from "react";
import { Input } from "reactstrap";
import { InputWrap, InputDropdown, InputDropdownWrap, InputValue, LabelWrapper, Error } from "./styled";
import { useThemeUI } from "theme-ui";
import DatePicker from "react-datepicker";
import moment from "moment";
import "moment-timezone";

import { CalendarIcon, ChevronIcon } from "components/svg";
import BasicButton from "components/forms/BasicButton";
//import "react-datepicker/dist/react-datepicker.css";

const SelectDateRange = ({
  label, 
  nameStartDate = "startDate", 
  nameEndDate = "endDate", 
  timeZone = "UTC", 
  value,   
  minDate, 
  maxDate, 
  description, 
  required, 
  customStyles, 
  errors, 
  responseErrors, 
  onChange 
}: any) => {

  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const [borderError, setBorderError] = useState<boolean>(false);
  const [active, setActive] = useState<boolean>(false);
  const wrapperRef = useRef<any>(null);
  const inputRef = useRef<any>(null);
  const TimeZone = useRef<any>(timeZone);

  const [dateRangeValue,setDateRangeValue] = useState("");

  const [startDateValue, setStartDateValue] = useState(value?.[0] || null)
  const [endDateValue, setEndDateValue] = useState(value?.[1] || null)

  const predefinedRanges = useMemo(() => [
    {
      label: "Today",
      startDate: moment().tz(TimeZone.current).startOf("day").toDate(),
      endDate: moment().tz(TimeZone.current).endOf("day").toDate(),
    },
    {
      label: "Yesterday",
      startDate: moment().tz(TimeZone.current).subtract(1, "days").startOf("day").toDate(),
      endDate: moment().tz(TimeZone.current).subtract(1, "days").endOf("day").toDate(),
    },
    {
      label: "Last Week",
      startDate: moment().tz(TimeZone.current).startOf("week").subtract(1, "days").startOf("week").startOf("day").toDate(),
      endDate: moment().tz(TimeZone.current).startOf("week").subtract(1, "days").endOf("week").endOf("day").toDate(),
    },
    {
      label: "Last Month",
      startDate: moment().tz(TimeZone.current).startOf("month").subtract(1, "days").startOf("month").startOf("day").toDate(),
      endDate: moment().tz(TimeZone.current).startOf("month").subtract(1, "days").endOf("month").endOf("day").toDate(),
    },
    {
      label: "Last 30 Days",
      startDate: moment().tz(TimeZone.current).subtract(30, "days").startOf("day").toDate(),
      endDate: moment().tz(TimeZone.current).endOf("day").toDate(),
    },
    {
      label: "Last Year",
      startDate: moment().tz(TimeZone.current).startOf("year").subtract(1, "days").startOf("year").startOf("day").toDate(),
      endDate: moment().tz(TimeZone.current).startOf("year").subtract(1, "days").endOf("year").endOf("day").toDate(),
    },
  ], []);

  const setTempValue = (dates: any) => {   
    const [start, end] = dates.map((date: any,index: number) => {      
      const momentDate = moment(date);
      if(index === 0) {
        return momentDate.startOf("day").unix();
      }
      return momentDate.endOf("day").unix();        
    });
    setStartDateValue(start || "");
    setEndDateValue(end || "");    
  }

  const setSelectValue = useCallback(async () => {     
    const [start, end] = [startDateValue, endDateValue]   
    inputRef.current.focus();
    setTimeout(() => { inputRef.current.blur(); },100);        

    if(typeof onChange === "function"){
      onChange([start, end])      
    } 
  },[startDateValue, endDateValue, nameEndDate, nameStartDate, onChange])

  const toggleActive = () => {
    setActive(!active);         
  }

  useEffect(() => {    
    const handleClickOutside = (event: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setActive((old) => {
          if(old){
            setSelectValue();
          }
          return false
        });                        
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [wrapperRef, onChange, setSelectValue]);

  useEffect(() => {     
    const labeled = predefinedRanges.find(x => moment(x.startDate).unix() === startDateValue && moment(x.endDate).unix() === (endDateValue ? endDateValue : moment(startDateValue * 1000).endOf("day").unix()));    
    setDateRangeValue(labeled ? labeled.label : (startDateValue ? moment(startDateValue * 1000).format("L") : "") + (startDateValue && endDateValue ? " - " : "") + (endDateValue ? moment(endDateValue * 1000).format("L") : ""));    
  }, [predefinedRanges, startDateValue, endDateValue]);

  useEffect(() => {
    if(responseErrors || errors){
      setBorderError(true);
    }else{
      setBorderError(false);
    }
  },[responseErrors, errors]);

  useEffect(() => {
    setStartDateValue(value?.[0] || null);
    setEndDateValue(value?.[1] || null);
  }, [value]);

  return (
    <InputWrap $errors={borderError} theme={theme} $customStyles={customStyles} ref={wrapperRef}>
      {label && 
        <LabelWrapper theme={theme}>
          <label>{label}</label>
          {required ? <span>*</span>  : ''}         
        </LabelWrapper>
      }
      <InputValue 
        theme={theme}
        onClick={toggleActive}
      >
        <CalendarIcon fill={theme?.colors?.base_800} />          
        <span>{dateRangeValue}</span>          
        <ChevronIcon fill={active ? theme?.colors?.base_800 : theme?.colors?.base_300} transform={"rotate(-90deg)"} />                 
      </InputValue>
      <div style={{display: "block", height: 0, overflow: "hidden", opacity : 0}}>
        <Input 
          type={"text"}  
          name={nameStartDate}                       
          value={startDateValue || ""}  
          innerRef={inputRef}    
          readOnly      
        />      
        <Input 
          type={"text"}                
          name={nameEndDate}                       
          value={endDateValue || ""}  
          readOnly
        />  
      </div>
      <InputDropdownWrap $active={active}>
        <InputDropdown theme={theme}>
          <div className="react-datepicker-datesets">          
            {predefinedRanges.map((range, index) => (
              <span key={index} className={`react-datepicker-datesets-set ${range.label === dateRangeValue ? "active" : ""}`} onClick={() => { setTempValue([range.startDate, range.endDate])}}>{range.label}</span>
            ))}
            <span className="react-datepicker-datesets-set react-datepicker-datesets-reset" onClick={() => { setTempValue([moment().tz(TimeZone.current).subtract(30, "days").startOf("day").toDate(),moment().tz(TimeZone.current).endOf("day").toDate()])}}>Reset</span>
            <BasicButton               
              type="button" 
              onClick={() => { setActive(false); setSelectValue(); }} 
            >Apply</BasicButton>
          </div>
          <DatePicker
            selected={startDateValue ? moment.unix(startDateValue || null).tz(TimeZone.current).toDate() : undefined}            
            startDate={startDateValue ? moment.unix(startDateValue || null).tz(TimeZone.current).toDate() : undefined}
            endDate={endDateValue ? moment.unix(endDateValue || null).tz(TimeZone.current).toDate() : undefined} 
            minDate={minDate ? (minDate.toString().length > 10 ? minDate : minDate * 1000) : undefined}    
            maxDate={maxDate ? (maxDate.toString().length > 10 ? maxDate : maxDate * 1000) : undefined}    
            openToDate={startDateValue ? moment.unix(startDateValue).toDate() : moment().toDate()}
            onChange={setTempValue}                
            customInput={<></>}
            selectsRange
            inline   
            renderCustomHeader={({
              date,
              decreaseYear,
              increaseYear,
              decreaseMonth,
              increaseMonth
            }) => (
              <div className="react-datepicker__custom-year-selector">
                <span className="react-datepicker__current-month">{date.toLocaleDateString('en-US',{ year: 'numeric', month: 'long' })}</span>
                <div className="react-datepicker__navigation">
                  <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon-double react-datepicker__navigation-icon--previous" onClick={decreaseYear}>{'<<'}</span>
                  <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--previous" onClick={decreaseMonth}>{'<'}</span>                    
                  <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon--next" onClick={increaseMonth}>{'>'}</span>
                  <span className="react-datepicker__navigation-icon react-datepicker__navigation-icon-double react-datepicker__navigation-icon--next" onClick={increaseYear}>{'>>'}</span>
                </div>
              </div>
            )}   
          />                
        </InputDropdown>  
      </InputDropdownWrap>
      {description && <p><small>{description}</small></p>} 
      {errors && <Error theme={theme}>{errors}</Error>}
    </InputWrap>    
  );
};

export default SelectDateRange;