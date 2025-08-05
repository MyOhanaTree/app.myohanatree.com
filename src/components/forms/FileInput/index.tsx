import React, { useState, useEffect, useRef } from "react";
import { InputWrap, LabelWrapper, DropArea, DropAreaLabel, Error } from "./styled";
import { Label, useThemeUI } from "theme-ui";
import { useToast } from "@/components/toast";

const FileInput = ({ 
  api,
  apiVariables,
  label, 
  value,
  directory,
  description, 
  required,
  disabled, 
  placeholder,  
  refreshValue,
  showTitles = true,
  sx, 
  $errors, 
  $responseErrors, 
  onChange 
}:{
  api: (props?: any) => Promise<void>;
  apiVariables?: {[key: string]: any},
  label?: string | React.ReactNode;  
  value?: string;
  directory?: string;
  description?: string; 
  required?: boolean;
  disabled?: boolean;
  placeholder?: string; 
  refreshValue?: boolean;
  showTitles?: boolean;
  sx?: any;
  $responseErrors?: any;
  $errors?: any;
  onChange?: (a?: any) => void;
}) => {

  const toast = useToast();  
  const fileInputRef = useRef<any>(null);

  const [files, setFiles] = useState<any[]>([]);
  const [values, setValues] = useState<any[]>([]);
  const [borderError, setBorderError] = useState<any>(false);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    setFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: any) => {
    setFiles(e.target.files);
  };

  const handleUpload = async () => {    
    if(disabled || files.length === 0) return true;         

    const tempFiles: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res: any = await api({ ...apiVariables, data : { ...apiVariables?.data, directory : directory || "", name : file.name, type : file.type, size : file.size }});    
      if(res.success){      
        tempFiles.push({
          file : file,
          url : res.url, 
          title: res.name, 
          location : res.location
        })
      } else {
        toast.add(res?.message ? res.message : `Error grabbing file ${file.name}`,"var(--theme-ui-colors-red)");
      }
    } 
    setValues(tempFiles); 

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  useEffect(() => {
    if(typeof onChange === "function"){
      onChange(values);
    }
  },[values]);

  useEffect(() => {
    handleUpload();
  },[files]);

  useEffect(() => {
    if(refreshValue){
      setFiles([]);
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
    <InputWrap sx={sx} $errors={borderError}>
      {label && 
        <LabelWrapper>
          <Label>{label}</Label>
          {required ? <span>*</span>  : ''}         
        </LabelWrapper>
      }
      <DropArea
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <DropAreaLabel>Drag and drop / or select files here</DropAreaLabel>
        {(showTitles && values.length > 0) && values.map((file: any, index: number) => <div key={index}>{file.title}</div>)}
      </DropArea>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple hidden />
      {description && <p><small>{description}</small></p>}       
      {$errors && <Error>{$errors}</Error>}
    </InputWrap>    
  );
};

export default FileInput;
