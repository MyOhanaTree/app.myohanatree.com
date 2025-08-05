import React, { useState, useEffect } from "react";
import { InputWrap, LabelWrapper, Error } from "./styled";
import { Box, Flex, Input, Label, useThemeUI } from "theme-ui";

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
  onChange 
}:{
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
  sx?: any;
  $responseErrors?: any;
  $errors?: any;
  onChange?: (e?: any) => void;
}) => {

  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const [borderError, setBorderError] = useState(false);

  const setSelectValue = function (e: any, type = "from"){    
    if(disabled) return true;
      
    let tempVal = e.target.value;
    let curVal: number[] = value || [];

    if(type === "from"){
      if(min && tempVal < min){ tempVal = min }
      if(max && tempVal > max){ tempVal = max }   
      curVal = [parseFloat(tempVal), curVal[1]]
    } else {
      if(min && tempVal < min){ tempVal = min }
      if(max && tempVal > max){ tempVal = max }   
      curVal = [curVal[0], parseFloat(tempVal)]
    }

    if(typeof onChange === "function"){
      onChange(curVal[0] || curVal[1] ? curVal : null);
    }
  }

  useEffect(() => {
    if($responseErrors || $errors){
      setBorderError(true);
    }else{
      setBorderError(false);
    }
  },[$responseErrors, $errors]);

  return (
    <InputWrap sx={sx} $errors={borderError}> 
      {label && 
        <LabelWrapper>
          <Label>{label}</Label>
          {required ? <span>*</span>  : ''}         
        </LabelWrapper>
      }     
      <Flex sx={{gap: "1rem"}}>
        <Box sx={{flexGrow: 1}}>          
          <Label sx={{fontSize: ".75rem"}}>{labelFrom || "From"}</Label>                     
          <Input 
            type="number" 
            name={`${name}[from]`} 
            disabled={disabled} 
            readOnly={readonly}                     
            min={min}
            max={max}
            step={step}
            value={value?.[0] ?? ""} 
            onChange={(e: any) => setSelectValue(e, "from")}  
          />
        </Box>
        <Box sx={{flexGrow: 1}}>        
          <Label sx={{fontSize: ".75rem"}}>{labelTo || "To"}</Label>                            
          <Input 
            type="number" 
            name={`${name}[to]`} 
            disabled={disabled} 
            readOnly={readonly}                     
            min={min}
            max={max}
            step={step}
            value={value?.[1] ?? ""} 
            onChange={(e: any) => setSelectValue(e, "to")}  
          />
        </Box>
      </Flex>
      {description && <p><small>{description}</small></p>}       
      {$errors && <Error>{$errors}</Error>}
    </InputWrap>    
  );
};

export default RangeInput;
