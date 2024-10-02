import React, { useState, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import { InputWrap, SelectStyles, LabelWrapper, Error } from "./styled";
import { useThemeUI } from "theme-ui";

import { TimesIcon } from "components/svg";

const getNestedValue = (obj: any, key: any) => {
  return key.split('.').reduce((acc: any, part: any) => acc && acc[part], obj);
};

function findNestedValue(arr: any[], key: string, value: string) {
  return arr.find(obj => {
    const keys = key.split('.');
    let current = obj;

    for (const k of keys) {
      if (current && k in current) {
        current = current[k];
      } else {
        return false;
      }
    }

    return current === value;
  });
}

const setNestedValue = (obj: any, path: any, value: any) => {
  const keys = path.split('.');
  let current = obj;
  keys.forEach((key: any, index: any) => {
      if (index === keys.length - 1) {
          current[key] = value;
      } else {
          current[key] = current[key] || {};
          current = current[key];
      }
  });
  return obj;
};

const SelectSearch = ({
  api,
  apiVariables, 
  name, 
  value,
  label, 
  description, 
  required,
  readonly,
  disabled,
  defaultOption = {value: "", label : ""}, 
  params = {}, 
  sortBy, 
  sortDir, 
  keyValue = "id", 
  keyLabel = ["title"], 
  labelDivider = ", ", 
  preload = false,
  $customStyles, 
  $responseErrors, 
  $errors, 
  onChange
}: {
  api?: any;
  apiVariables?: any;
  name?: string;
  label?: string | React.ReactNode;  
  value?: string | number;
  description?: string;  
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  defaultOption?: any;
  params?: any;
  sortBy?: string;
  sortDir?: string;
  keyValue?: string;
  keyLabel?: string[]; 
  labelDivider?: string;
  preload?: boolean;
  $customStyles?: any;
  $responseErrors?: any;
  $errors?: any;
  onChange?: (e?: any) => void;
}) => {

  const callApi = useRef<any>(api);
  const selectRef = useRef<any>(null);
  const controller = useRef<any>(null);
  const loadTimer = useRef<any>(null);

  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const [borderError, setBorderError] = useState<boolean>(false);  

  const [inputValue, setInputValue] = useState<any>();
  const [options,setOptions] = useState<any[]>([]);
  const [items,setItems] = useState<any[]>([]);

  const prevParamsRef = useRef<any>(params);

  const handleInputChange = (newValue: any, { action }: any) => {   
    if (action === "input-change") {
      if(newValue.length > 3) {   
        fetchOptions(newValue);
      }
      if(newValue.length == 0 && preload) { 
        fetchOptions("");
      }
    }
    setInputValue(newValue);
  }

  const fetchOptions = async (inputValue?: any) => {     
    if(controller.current){
      controller?.current?.abort(); 
      controller.current = null;
    }    
    clearTimeout(loadTimer?.current);  

    loadTimer.current = setTimeout(async () => {        
      setOptions([]);
      controller.current = new AbortController();
      const query = {              
        ...params,
        ...(!!!inputValue ? setNestedValue({}, keyValue, value) : {}),
        searchString : inputValue ?? null,        
        sortBy : sortBy,
        sortDir : sortDir,
        pageNum : 1,
        recordsPer : 10,
      } 

      try {
        if(callApi.current){
          const apiCall = callApi.current;
          const res = await apiCall({...apiVariables, query, controller : controller.current, excludeInterceptor : true}); 
          if(res.items){      
            setItems(res.items);       
            const newOptions = res.items.map((item: any) => {
              const label = Array.isArray(keyLabel) ? keyLabel.map(key => getNestedValue(item, key) ?? "").join(labelDivider) : getNestedValue(item, keyLabel);
              return { "value": getNestedValue(item, keyValue), "label": label };
            });       
            setOptions(newOptions);                        
          } else {
            if(Array.isArray(res)){
              setItems(res);
              const newOptions = res.map((item: any) => {
                const label = Array.isArray(keyLabel) ? keyLabel.map(key => getNestedValue(item, key) ?? "").join(labelDivider) : getNestedValue(item, keyLabel);
                return {"value" : getNestedValue(item, keyValue), "label" : label}
              })        
              setOptions(newOptions);                        
            }
          }
        }
      } catch (e) { }            
    }, 500); 
    return true;
  };

  const setSelectValue = function (e: any){ 
    if(disabled) return true;
     
    

    if(typeof onChange === "function"){
      const res = findNestedValue(items, keyValue, e?.value);
      console.log(res);
      onChange(res ?? "")
    }
    setTimeout(() => { selectRef?.current?.blur(); },100);
  }

  useEffect(() => { 
    if(defaultOption.value){
      setOptions([defaultOption])  
    }
  },[defaultOption]);

  useEffect(() => {
    if($responseErrors || $errors){
      setBorderError(true);
    }else{
      setBorderError(false);
    }
  },[$responseErrors, $errors]);

  useEffect(() => {
    if(preload){
      fetchOptions(inputValue);
    }
  },[preload]);

  useEffect(() => {
    if (preload && !inputValue && !(JSON.stringify(params) === JSON.stringify(prevParamsRef.current))) {
      fetchOptions(inputValue);
      prevParamsRef.current = params;
    }
  }, [params, preload, inputValue]);

  const ClearIndicator = (props: any) => {
    return (      
      <components.ClearIndicator {...props}>        
        <TimesIcon height={"14px"} width={"14px"} fill={theme?.colors?.base_500} />        
      </components.ClearIndicator>
    );
  };

  const customComponents = {
    ClearIndicator,
    DropdownIndicator: null,
  };

  return (
    <InputWrap $customStyles={$customStyles} $errors={borderError} theme={theme}>
      {label && 
        <LabelWrapper theme={theme}>
          <label>{label}</label>
          {required ? <span>*</span>  : ''}         
        </LabelWrapper>
      }
      <Select 
        ref={selectRef}
        styles={SelectStyles} 
        menuPlacement="auto"
        classNamePrefix="react-select"
        value={options?.filter((option: any) => (Array.isArray(value)) ? value.includes(option.value) : option.value === value)} 
        options={options} 
        name={name} 
        placeholder="Search for more..."
        noOptionsMessage={() => (inputValue ?? "")?.toString().length < 3 ? "Type to start searching" : "No options available"}
        isClearable
        onChange={(e) => setSelectValue(e)}  
        onInputChange={handleInputChange}
        inputValue={inputValue ?? ""}
        components={customComponents} 
        isDisabled={readonly}                 
      />    
      {description && <p><small>{description}</small></p>}       
      {$errors && <Error theme={theme}>{$errors}</Error>}
    </InputWrap>
  );
};

export default SelectSearch;
