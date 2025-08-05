import React, { useState, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import { InputWrap, SelectStyles, colorCodedStyles, LabelWrapper, Error } from "./styled";
import { Label, useThemeUI } from "theme-ui";

import { TimesIcon } from "@/components/svg";

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
  placeholder,
  description, 
  required,
  readonly,
  disabled,
  multiple,
  defaultOption = {value: "", label : ""}, 
  params = {}, 
  sortBy, 
  sortDir, 
  limit = 10,
  keyValue = "id", 
  keyLabel = ["title"], 
  labelDivider = ", ", 
  preload = false,
  sx, 
  $responseErrors, 
  $errors, 
  colorCoded = false,
  onChange
}: {
  api?: (props: any) => Promise<any>;
  apiVariables?: any;
  name?: string;
  label?: string | React.ReactNode;  
  value?: string | string[] | number;
  placeholder?: string;
  description?: string;  
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  defaultOption?: any;
  params?: any;
  sortBy?: string;
  sortDir?: string;
  limit?: number;
  keyValue?: string;
  keyLabel?: string[]; 
  labelDivider?: string;
  preload?: boolean;
  sx?: any;
  $responseErrors?: any;
  $errors?: any;
  colorCoded?: boolean;
  onChange?: (e?: any) => void;
}) => {

  const selectRef = useRef<any>(null);
  const controller = useRef<any>(null);
  const loadTimer = useRef<any>(null);

  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const [borderError, setBorderError] = useState<boolean>(false);  

  const [inputValue, setInputValue] = useState<any>();
  const [options,setOptions] = useState<any[]>([]);
  const [items,setItems] = useState<any[]>([]);
  const [lastKey, setLastKey] = useState<number>(1);
  const [hasMore,setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState(preload);

  const handleInputChange = (newValue: any, { action }: any) => {   
    if (action === "input-change") {
      if(newValue.length > 2) {   
        fetchOptions(newValue);
      }
      if(newValue.length == 0 && preload) { 
        fetchOptions();
      }
      setInputValue(newValue);
    }
  }

  const fetchOptions = async (queryValue?: any, lastKey?: any) => {     
    if(controller.current){
      controller?.current?.abort(); 
      controller.current = null;
    }    
    clearTimeout(loadTimer?.current);  

    loadTimer.current = setTimeout(async () => {        
      controller.current = new AbortController();
      const { filters: paramFilters, ...restParams } = params;
      const query = { 
        filters : {              
          ...paramFilters,
          ...(!!value ? setNestedValue({}, keyValue, value) : {}),
        },
        search : queryValue ?? null,        
        key: lastKey,
        limit : limit || 10,
        ...restParams
      }

      try {
        if(api){
          setLoading(true);

          const res = await api({...apiVariables, query, controller : controller.current, excludeInterceptor : true}); 
          if(res.items){      
            setItems(res.items);       
            const newOptions = res.items.map((item: any) => {
              const label = Array.isArray(keyLabel) ? keyLabel.map(key => getNestedValue(item, key) ?? "").join(labelDivider) : getNestedValue(item, keyLabel);
              return { "value": getNestedValue(item, keyValue), "label": label, color: (colorCoded && item.color) ? item.color : item.color || theme?.colors?.base_500 };
            });       
            setOptions((old) => {
              const merged = [...old, ...newOptions];
              const unique = Array.from(new Map(merged.map(item => [item.value, item])).values());
              return unique;
          });

            setHasMore(res?.lastKey);  
            setLastKey(res?.lastKey );                   
          } else {
            if(Array.isArray(res)){
              setItems(res);
              const newOptions = res.map((item: any) => {
                const label = Array.isArray(keyLabel) ? keyLabel.map(key => getNestedValue(item, key) ?? "").join(labelDivider) : getNestedValue(item, keyLabel);
                return {"value" : getNestedValue(item, keyValue), "label" : label, color: (colorCoded && item.color) ? item.color : item.color || theme?.colors?.base_500}
              })        
              
              setOptions((old) => {
                const merged = [...old, ...newOptions];
                const unique = Array.from(new Map(merged.map(item => [item.value, item])).values());
                return unique;
              });                      
            }            
            setHasMore(false);
          }          
          setLoading(false);
        }
      } catch (e) { }            
    }, 500); 
    return true;
  };

  const setSelectValue = async (e: any) => { 
    if (disabled) return; 

    let changedValue;
  
    if(e !== null){
      if (multiple) {
        const selectedValues = await Promise.all(e.map((el: any) => el.value).filter((v: any) => v !== ""));  
        changedValue = [...new Set([...selectedValues])];
      } else {
        changedValue = findNestedValue(items, keyValue, e?.value);
      }
      setInputValue(null);
      if (typeof onChange === "function") {
        onChange(changedValue ?? "");
      }
    
      setTimeout(() => {
        selectRef?.current?.blur();
      }, 100);
    } else {
      if (typeof onChange === "function") {
        onChange(null);
      }
    }
  };
  

  const scrollBottom = () => {
    if(hasMore){
      fetchOptions(inputValue,lastKey);
    }
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
    if (preload || value) {
      fetchOptions(inputValue);      
    }
  }, [preload, value]);  

  const ClearIndicator = (props: any) => {
    return (      
      <components.ClearIndicator {...props}>        
        <TimesIcon height={"12px"} width={"12px"} fill={theme?.colors?.base_500} />        
      </components.ClearIndicator>
    );
  };

  const customComponents = {
    ClearIndicator,
    DropdownIndicator: null,
  };

  return (
    <InputWrap sx={sx} $errors={borderError}>
      {label && 
        <LabelWrapper>
          <Label>{label}</Label>
          {required ? <span>*</span>  : ''}         
        </LabelWrapper>
      }
      <Select 
        ref={selectRef}
        styles={
          colorCoded
            ? colorCodedStyles // Apply color coding if enabled
            : SelectStyles
        }
        menuPlacement="auto"
        classNamePrefix="react-select"
        value={options?.filter((option: any) => (Array.isArray(value)) ? value.includes(option.value) : option.value === value)} 
        options={options} 
        name={name} 
        placeholder={placeholder ?? "Search for more..."}
        noOptionsMessage={() => (inputValue ?? "")?.toString().length < 3 ? "Type to start searching" : "No options available"}        
        onChange={(e) => setSelectValue(e)}  
        onInputChange={handleInputChange}        
        onMenuScrollToBottom={scrollBottom}   
        inputValue={inputValue ?? ""}
        components={customComponents}              
        isClearable
        isDisabled={readonly}   
        isLoading={loading}     
        isMulti={multiple} 
        menuPortalTarget={document.body}                     
      />    
      {description && <p><small>{description}</small></p>}       
      {$errors && <Error>{$errors}</Error>}
    </InputWrap>
  );
};

export default SelectSearch;
