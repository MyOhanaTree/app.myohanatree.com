import React from "react";
import { LoginMat } from "./styled";
import { useThemeUI } from "theme-ui";

const LoginCard = ({children}: any) =>{

  const themeContext = useThemeUI();
  const { theme } = themeContext;

  return (
    <LoginMat theme={theme}>{children}</LoginMat>
  )
}

export default LoginCard;