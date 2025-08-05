import React, { useEffect, useState } from "react";
import { CheckboxWrapper } from "./styled";
import { Label, useThemeUI } from "theme-ui";

const Checkbox = ({
  name,
  label,
  value,
  checked,
  onChange,
  sx,
  $disabled,
}: {
  name?: string;
  label?: string | React.ReactNode;
  value?: string | number;
  checked?: boolean;
  className?: string;
  onChange?: (e?: any) => void;
  sx?: any;
  $disabled?: boolean;
}) => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const [newChecked, setNewChecked] = useState<boolean>(checked || false);

  const setSelectValue = function (e: any) {
    if (typeof onChange === "function") {
      onChange(!newChecked);
    }
  };

  useEffect(() => {
    setNewChecked(checked || false);
  }, [checked]);

  return (
    <CheckboxWrapper $disabled={$disabled} onClick={(e) => e.stopPropagation()} sx={sx}>
      <input disabled={$disabled} type="checkbox" name={name} value={value ?? 1} checked={newChecked} onChange={setSelectValue} />
      {label && <Label onClick={() => typeof onChange === "function" && onChange(!newChecked)}>{label}</Label>}
    </CheckboxWrapper>
  );
};
export default Checkbox;
