import React, { useState, useEffect, useRef } from "react";
import { InputWrap, InputDropdown, InputDropdownWrap, DropDownWrap, InputValue, LabelWrapper, Error } from "./styled";
import { useThemeUI } from "theme-ui";
import DatePicker from "react-datepicker";
import moment from "moment";

import { CalendarIcon, ChevronIcon } from "components/svg";


const SelectDate = ({
  label, 
  name = "date", 
  value, 
  description, 
  autoComplete,
  minDate, 
  maxDate, 
  required,
  disabled = false, 
  startOfDay = true,
  showTime = false,
  $customStyles, 
  $errors, 
  $responseErrors, 
  onChange,   
} : {
  label?: string | React.ReactNode;
  name?: string;
  value?: string | number;
  description?: string;
  autoComplete?: string;
  minDate?: number;
  maxDate?: number;
  required?: boolean;
  disabled?: boolean;
  startOfDay?: boolean;
  showTime?: boolean;
  $customStyles?: any;
  $errors?: any;
  $responseErrors?: any;
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
  const [dateValue, setDateValue] = useState<any>(value ?? null)


  const setSelectValue = async function (date: any){    
    if(disabled) return true;
    
    const momentDate = startOfDay ? moment(date).startOf("day").unix() : moment(date).endOf("day").unix();     
    if((!minDate || minDate <= momentDate) && (!maxDate || maxDate >= momentDate)){
      setDateValue(momentDate);   
      if(typeof onChange === "function"){
        onChange(momentDate)      
      }   
    }        
  }

  const inputChange = (e?: any) => {  
    setInputLabel(e.target.value);   
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      try {
        const newDate = moment(e.target.value).toDate(); 
        if(newDate){
          setSelectValue(newDate);
          datePickerRef?.current?.setOpen(false);  
          setTimeout(() => datePickerRef?.current?.setOpen(true), 500);
        }
      } catch(e){}  
    }, 1000);
  }

  useEffect(() => {    
    const handleClickOutside = (event: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setActive(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, [wrapperRef]);

  useEffect(() => {             
    setDateValue(value);
  }, [value]);

  useEffect(() => {
    setInputLabel(dateValue ? moment.unix(dateValue).format("L") : "");    
  },[dateValue])

  useEffect(() => {
    if($responseErrors || $errors){
      setBorderError(true);
    }else{
      setBorderError(false);
    }
  },[$responseErrors, $errors]);

  return (
    <InputWrap $errors={borderError} theme={theme} $customStyles={$customStyles} disabled={disabled} ref={wrapperRef}>
      {label && 
        <LabelWrapper theme={theme}>
          <label>{label}</label>
          {required ? <span>*</span>  : ''}         
        </LabelWrapper>
      }
      <DropDownWrap>
        <InputValue 
          theme={theme}
          onClick={() => setActive(true)}
        >
          <CalendarIcon fill={theme?.colors?.base_800} />
          <input onChange={(e) => inputChange(e)} value={inputLabel} />
          <ChevronIcon fill={active ? theme?.colors?.base_800 : theme?.colors?.base_300} transform={"rotate(-90deg)"}  />       
        </InputValue>
        <InputDropdownWrap $active={active}>
          <InputDropdown theme={theme}>
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
      </DropDownWrap>
      {description && <p><small>{description}</small></p>} 
      {$errors && <Error theme={theme}>{$errors}</Error>}
    </InputWrap>
  );
};

export default SelectDate;