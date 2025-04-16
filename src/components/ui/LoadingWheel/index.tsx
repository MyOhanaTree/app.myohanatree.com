import React from "react";
import { LoadingWheelWrap } from "./styled";
import { useThemeUI } from "theme-ui";

const LoadingWheel = (props?: any) => {
  const context = useThemeUI();
  const { theme } = context;

  const overrideStyles = {
    ...props.style,
    paddingTop: props.pt,
    marginRight: props.mr,
    marginLeft: props.ml,
  };

  const customStyles = {    
    fill: props.fill,
    width: props.width,
    height: props.height,
    stroke: props.stroke,
  };

  return (
    <LoadingWheelWrap
      style={overrideStyles}
      $customStyles={customStyles}
     
    >
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </LoadingWheelWrap>
  );
};

export default LoadingWheel;