import React from "react";
import { IMGWrapper } from "./styled";

const AdminLogo = ({customStyles, alt}: any) => {

  if(!process.env.REACT_APP_LOGO) return null;

  return ( 
    <IMGWrapper src={process.env.REACT_APP_LOGO} alt={alt} $customStyles={{maxHeight: "100%", maxWidth: "100%",...customStyles}} />
  );
};
  
export default AdminLogo;