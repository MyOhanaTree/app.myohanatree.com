import React from "react";
import { StyledH5 } from "./styled";

const H5 = (props?: any) =>{
  return (
    <StyledH5 $customStyles={{...props}}>{props.children}</StyledH5>
  )
}

export default H5;