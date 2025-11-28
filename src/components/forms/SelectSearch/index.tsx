import React, { useState, useEffect, useRef } from "react";
import Select, { components } from "react-select";
import { MdClose } from "react-icons/md";
import { fieldWrapper, labelWrapper, errorText, helperText, buildSelectStyles } from "../shared";

const getNestedValue = (obj: any, key: any) => key.split(".").reduce((acc: any, part: any) => acc && acc[part], obj);

function findNestedValue(arr: any[], key: string, value: string) {
  return arr.find((obj) => getNestedValue(obj, key) === value);
}

const setNestedValue = (obj: any, path: any, value: any) => {
  const keys = path.split(".");
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

type SelectSearchProps = {
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
  sx?: React.CSSProperties;
  $responseErrors?: any;
  $errors?: any;
  colorCoded?: boolean;
  onChange?: (e?: any) => void;
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
  defaultOption = { value: "", label: "" },
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
  onChange,
}: SelectSearchProps) => {
  const selectRef = useRef<any>(null);
  const controller = useRef<any>(null);
  const loadTimer = useRef<any>(null);

  const [borderError, setBorderError] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<any>();
  const [options, setOptions] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [lastKey, setLastKey] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [loading, setLoading] = useState(preload);

  const handleInputChange = (newValue: any, { action }: any) => {
    if (action === "input-change") {
      if (newValue.length > 2) {
        fetchOptions(newValue);
      }
      if (newValue.length === 0 && preload) {
        fetchOptions();
      }
      setInputValue(newValue);
    }
  };

  const fetchOptions = async (queryValue?: any, nextKey?: any) => {
    if (controller.current) {
      controller?.current?.abort();
      controller.current = null;
    }
    clearTimeout(loadTimer?.current);

    loadTimer.current = setTimeout(async () => {
      controller.current = new AbortController();
      const { filters: paramFilters, ...restParams } = params;
      const query = {
        filters: {
          ...paramFilters,
          ...(!!value ? setNestedValue({}, keyValue, value) : {}),
        },
        search: queryValue ?? null,
        key: nextKey || lastKey,
        limit: limit || 10,
        sortBy,
        sortDir,
        ...restParams,
      };

      try {
        if (api) {
          setLoading(true);

          const res = await api({ ...apiVariables, query, controller: controller.current, excludeInterceptor: true });
          const resultItems = res.items || res;
          if (Array.isArray(resultItems)) {
            setItems(resultItems);
            const newOptions = resultItems.map((item: any) => {
              const labelVal = Array.isArray(keyLabel)
                ? keyLabel.map((key) => getNestedValue(item, key) ?? "").join(labelDivider)
                : getNestedValue(item, keyLabel);
              return {
                value: getNestedValue(item, keyValue),
                label: labelVal,
                color: colorCoded && item.color ? item.color : item.color || "#475569",
              };
            });
            setOptions((old) => {
              const merged = [...old, ...newOptions];
              const unique = Array.from(new Map(merged.map((item) => [item.value, item])).values());
              return unique;
            });
            setHasMore(res?.lastKey);
            setLastKey(res?.lastKey);
          } else {
            setHasMore(false);
          }
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
      }
    }, 500);
    return true;
  };

  const setSelectValue = async (e: any) => {
    if (disabled) return;

    let changedValue;

    if (e !== null) {
      if (multiple) {
        const selectedValues = await Promise.all(e.map((el: any) => el.value).filter((v: any) => v !== ""));
        changedValue = [...new Set([...selectedValues])];
      } else {
        changedValue = findNestedValue(items, keyValue, e?.value);
      }
      setInputValue(null);
      onChange?.(changedValue ?? "");

      setTimeout(() => {
        selectRef?.current?.blur();
      }, 100);
    } else {
      onChange?.(null);
    }
  };

  const scrollBottom = () => {
    if (hasMore) {
      fetchOptions(inputValue, lastKey);
    }
  };

  useEffect(() => {
    const fetchDefault = async () => {
      if (defaultOption.value) {
        setOptions([defaultOption]);
      }
      if (preload) {
        await fetchOptions();
      }
    };
    fetchDefault();
  }, []);

  useEffect(() => {
    setBorderError(!!($responseErrors || $errors));
  }, [$responseErrors, $errors]);

  const ColorOption = (props: any) => (
    <components.Option {...props}>
      <div className="flex items-center gap-2">
        {colorCoded && props.data.color && (
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: props.data.color }} />
        )}
        <span>{props.label}</span>
      </div>
    </components.Option>
  );

  const selectedValue = options?.filter((option) =>
    Array.isArray(value) ? (value as (string | number)[]).includes(option.value) : option.value === value
  );

  return (
    <div className={fieldWrapper} style={sx}>
      {label && (
        <div className={labelWrapper}>
          <span>{label}</span>
          {required ? <span className="text-rose-600">*</span> : ""}
        </div>
      )}
      <Select
        ref={selectRef}
        styles={buildSelectStyles(borderError)}
        classNamePrefix="react-select"
        placeholder={placeholder || "Select..."}
        onInputChange={handleInputChange}
        onChange={(e) => setSelectValue(e)}
        options={options}
        isMulti={multiple}
        value={selectedValue}
        isDisabled={readonly || disabled}
        isLoading={loading}
        onMenuScrollToBottom={scrollBottom}
        components={{
          MultiValueRemove: (props) => (
            <components.MultiValueRemove {...props}>
              <MdClose fontSize={"12px"} className="text-slate-500" />
            </components.MultiValueRemove>
          ),
          ClearIndicator: (props) => (
            <components.ClearIndicator {...props}>
              <MdClose fontSize={"12px"} className="text-slate-500" />
            </components.ClearIndicator>
          ),
          Option: ColorOption,
        }}
        isClearable
        menuPortalTarget={document.body}
      />
      {description && (
        <p className={helperText}>
          <small>{description}</small>
        </p>
      )}
      {$errors && <div className={errorText}>{$errors}</div>}
    </div>
  );
};

export default SelectSearch;
