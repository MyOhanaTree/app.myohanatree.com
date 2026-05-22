import React, { useState, useEffect, useRef } from "react";
import { fieldWrapper, labelWrapper, errorText, helperText } from "../shared";
import TrashIcon from "@/components/icons/Trash";
import Button from "../Button";

type FileInputProps = {
  label?: string | React.ReactNode;
  value?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;  
  placeholder?: string;
  sx?: React.CSSProperties;
  accept?: string;
  types?: string[];
  $errors?: any;
  onChange?: (a?: any) => void;
};

const FileInput = ({
  label,
  description,
  required,
  disabled,
  multiple,
  sx,
  types,
  accept,
  $errors,
  onChange,
}: FileInputProps) => {
  const fileInputRef = useRef<any>(null);

  const [files, setFiles] = useState<any>([]);
  const [borderError, setBorderError] = useState<any>(false);

  const handleDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    
    if(disabled) return;

    const droppedFiles = Array.from(e.dataTransfer.files || []);
    const validFiles = (types?.length || 0) > 0 ? droppedFiles.filter((file: any) => types?.includes(file.type)) : droppedFiles;
    setFiles(validFiles);
  };

  const handleFileChange = (e: any) => {
    if(disabled) return;

    const changedFiles = Array.from(e.target.files || []);
    const validFiles = (types?.length || 0) > 0 ? changedFiles.filter((file: any) => types?.includes(file.type)) : changedFiles;
    if(!multiple) {
      setFiles([validFiles[0]]);
    } else {
      setFiles(validFiles);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((prevFiles: any) => {
      const prevArray = Array.isArray(prevFiles) ? prevFiles : Array.from(prevFiles || []);
      return prevArray.filter((_: any, index: number) => index !== indexToRemove);
    });
  };

  useEffect(() => {
    if(disabled) return;
    if (typeof onChange === "function") {
      onChange(files);
    }
  }, [files, onChange]);

  useEffect(() => {
    if ($errors) {
      setBorderError(true);
    } else {
      setBorderError(false);
    }
  }, [$errors]);

  const filesArray = Array.isArray(files) ? files : Array.from(files || []);

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
        className={`flex min-h-[132px] cursor-pointer select-none flex-col items-center justify-center rounded-md border-2 border-dashed bg-white text-center text-sm font-medium transition ${
          borderError ? "border-rose-400" : "border-slate-300 hover:border-primary-300"
        }`}
      >
        <p className="text-slate-700">Drag and drop files here, or click to browse</p>
        <p className="mt-1 text-xs text-slate-500">Accepted: {types?.length ? "selected file types only" : "all file types"}</p>
      </div>
      <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple hidden accept={accept} />
      {description && (
        <p className={helperText}>
          <small>{description}</small>
        </p>
      )}
      {$errors && <div className={errorText}>{$errors}</div>}
      {filesArray.length > 0 && (
        <div className="overflow-x-scroll rounded-md border border-slate-200 mt-3">
          <table className="min-w-full max-w-full table-auto overflow-hidden rounded-md border border-slate-200 text-left text-sm">
            <thead className="bg-slate-50">
              <tr className="text-slate-600">
                <th className="px-3 py-2 text-right"></th>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2 text-right">Size</th>
              </tr>
            </thead>
            <tbody>
              {filesArray.map((file: any, index: number) => (
                <tr key={`${file.name}-${index}`} className="border-t border-slate-200">                  
                  <td className="px-3 py-2 text-right">
                    <Button
                      type="button"
                      disabled={disabled}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      aria-label={`Remove ${file.name}`}
                      title="Remove file"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-md text-rose-600 shadow-none hover:bg-rose-50 hover:text-rose-700 disabled:text-slate-400"
                    >
                      <TrashIcon />
                    </Button>
                  </td>
                  <td className="max-w-[220px] truncate px-3 py-2">{file.name}</td>
                  <td className="px-3 py-2">{file.type || "-"}</td>
                  <td className="px-3 py-2 text-right">{Math.ceil(file.size / 1024)} KB</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FileInput;
