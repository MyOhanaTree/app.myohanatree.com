import React from "react";
import { IMGWrapper } from "./styled";

const IMG = ({customStyles, src, alt}: any) => { 

  return (
    <IMGWrapper src={src} alt={alt} $customStyles={customStyles} />
  );

};

export default IMG;
