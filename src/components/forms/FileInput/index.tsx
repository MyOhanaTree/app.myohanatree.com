import React, { useState, useEffect } from "react";
import { Input } from "reactstrap";
import { InputWrap, LabelWrapper, Image, Error } from "./styled";
import { useThemeUI } from "theme-ui";
import { v4 as uuidv4 } from 'uuid';

const isImage = (url: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const extension = url.split('.')?.pop()?.toLowerCase() || "";
  return imageExtensions.includes(extension);
};

const FileInput = ({ 
  connect,
  label, 
  value,
  directory,
  description, 
  required,
  disabled, 
  placeholder,  
  refreshValue,
  $customStyles, 
  $errors, 
  $responseErrors, 
  onChange 
}:{
  connect?: (e: any) => Promise<void>;
  label?: string | React.ReactNode;  
  value?: string;
  directory?: string;
  description?: string; 
  required?: boolean;
  disabled?: boolean;
  placeholder?: string; 
  refreshValue?: boolean;
  $customStyles?: any;
  $responseErrors?: any;
  $errors?: any;
  onChange?: (a?: any, b?: any) => void;
}) => {

  const themeContext = useThemeUI();
  const { theme } = themeContext;
  
  const [tempValue, setTempValue] = useState<any>();
  const [tempValueUrl, setTempValueUrl] = useState<any>();
  const [borderError, setBorderError] = useState(false);

  const setSelectValue = async (e: any) => {    
    if(disabled) return true;      
    const value = e.target.value;
    setTempValue(value);

    const file = e.target.files[0];    
    let signedurl: any;
    if(file){
      const reader = new FileReader();
      if(isImage(value)){
        reader.onloadend = () => setTempValueUrl(reader.result);
        reader.readAsDataURL(file);
      } else {
        setTempValueUrl("");
      }

      const extension = file.name.split('.').pop();
      signedurl = connect ? await connect({ data : { directory : directory || "", name : `${uuidv4()}.${extension}`, type : file.type, size : file.size }}) : false;      
    }
    if(typeof onChange === "function"){      
      onChange(file, signedurl)
    }
  }

  useEffect(() => {
    if(refreshValue){
      setTempValue("");
      setTempValueUrl("");
    }
  },[refreshValue])

  useEffect(() => {
    if($responseErrors || $errors){
      setBorderError(true);
    }else{
      setBorderError(false);
    }
  },[$responseErrors, $errors]);

  return (
    <InputWrap theme={theme} $customStyles={$customStyles} $errors={borderError}>
      {label && 
        <LabelWrapper theme={theme}>
          <label>{label}</label>
          {required ? <span>*</span>  : ''}         
        </LabelWrapper>
      }
      <Input 
        type={"file"} 
        disabled={disabled}         
        placeholder={placeholder}         
        value={tempValue ?? ""} 
        onChange={(e: any) => setSelectValue(e)}  
      />
      {(value || tempValueUrl) && 
        <div>
          <a href={tempValueUrl || `${process.env.REACT_APP_CDN}/${value}`} target="_blank" rel="noopener noreferrer">
            {isImage(tempValue || value) && <Image src={tempValueUrl || `${process.env.REACT_APP_CDN}/${value}`} theme={theme} alt="preview" />}
            {!isImage(tempValue || value) && <span>{tempValueUrl || `${process.env.REACT_APP_CDN}/${value}`}</span>}
          </a>
        </div>
      }
      {description && <p><small>{description}</small></p>}       
      {$errors && <Error theme={theme}>{$errors}</Error>}
    </InputWrap>    
  );
};

export default FileInput;
