import React, { useState, useEffect, useRef } from "react";
import { fieldWrapper, labelWrapper, errorText, helperText } from "../shared";

type FileInputProps = {
  api: (props?: any) => Promise<any>;
  apiVariables?: { [key: string]: any };
  label?: string | React.ReactNode;
  value?: string;
  directory?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  refreshValue?: boolean;
  showTitles?: boolean;
  sx?: React.CSSProperties;
  $responseErrors?: any;
  $errors?: any;
  onChange?: (a?: any) => void;
};

const FileInput = ({
  api,
  apiVariables,
  label,
  directory,
  description,
  required,
  disabled,
  refreshValue,
  showTitles = true,
  sx,
  $errors,
  $responseErrors,
  onChange,
}: FileInputProps) => {
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
    if (disabled || files.length === 0) return true;

    const tempFiles: any[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const res: any = await api({
        ...apiVariables,
        data: { ...apiVariables?.data, directory: directory || "", name: file.name, type: file.type, size: file.size },
      });
      if (res?.success) {
        tempFiles.push({
          file: file,
          url: res.url,
          title: res.name,
          location: res.location,
        });
      }
    }
    setValues(tempFiles);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (typeof onChange === "function") {
      onChange(values);
    }
  }, [values, onChange]);

  useEffect(() => {
    handleUpload();
  }, [files]);

  useEffect(() => {
    if (refreshValue) {
      setFiles([]);
      setValues([]);
    }
  }, [refreshValue]);

  useEffect(() => {
    if ($responseErrors || $errors) {
      setBorderError(true);
    } else {
      setBorderError(false);
    }
  }, [$responseErrors, $errors]);

  return (
    <div className={fieldWrapper} style={sx}>
      {label && (
        <div className={labelWrapper}>
          <span>{label}</span>
          {required ? <span className="text-rose-600">*</span> : ""}
        </div>
      )}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white text-center text-sm font-semibold shadow-sm transition ${
          borderError ? "border-rose-400" : "border-slate-300 hover:border-emerald-400"
        }`}
      >
        <p className="text-slate-600">Drag and drop / or select files here</p>
        {showTitles && values.length > 0 && (
          <div className="mt-2 space-y-1 text-xs text-slate-500">
            {values.map((file: any, index: number) => (
              <div key={index}>{file.title}</div>
            ))}
          </div>
        )}
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple hidden />
      {description && (
        <p className={helperText}>
          <small>{description}</small>
        </p>
      )}
      {$errors && <div className={errorText}>{$errors}</div>}
    </div>
  );
};

export default FileInput;
