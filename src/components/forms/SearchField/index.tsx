import React, { useEffect, useState } from "react";
import { InputWrap, InputInner, SearchIconWrap } from "./styled";
import { Input, useThemeUI } from "theme-ui";
import { SearchIcon } from "@/components/svg";

const SearchField = ({
  name = "",
  value = "",
  width = "200px",
  className,
  sx,
  onChange,
  onKeyUp,
  onBlur,
}: {
  name?: string;
  value?: string | number;
  width?: string;
  className?: string;
  sx?: any;
  onChange?: (e?: any) => void;
  onKeyUp?: (e?: any) => void;
  onBlur?: (e?: any) => void;
}) => {

  const themeContext = useThemeUI();
  const { theme } = themeContext;    
  const [newValue, setNewValue] = useState<string | number | undefined>(value);
  
  const setKeyUp = function(e: any){
    if(typeof onKeyUp === "function"){
      onKeyUp(e);
    }
  }

  const setSelectValue = function (e: any){  
    if(typeof onChange === "function"){
      onChange(e);   
    }    
    
    setNewValue(e.target.value ?? undefined)    
  }

  useEffect(() => {
    setNewValue(value);
  },[value]);

  return (
    <InputWrap className={className} sx={{...sx, width: width}}>
      <InputInner>
        <Input
          type="text"  
          name={name} 
          placeholder={"Search"} 
          value={newValue ?? ""}
          onChange={(e: any) => setSelectValue(e)} 
          onKeyUp={(e: any) => setKeyUp(e)} 
          onBlur={(e: any) => setSelectValue(e)}
        />            
        <SearchIconWrap>
          <SearchIcon fill={theme?.colors?.body} width={"20px"} height={"auto"} />
        </SearchIconWrap>
      </InputInner>
    </InputWrap>
  );
};

export default SearchField;
