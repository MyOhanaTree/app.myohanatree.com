import React from "react";
import { Outlet } from "react-router-dom";
import { LoginWrapper } from "./styled";
import { useThemeUI } from "theme-ui";

const LoginLayout = () =>{

  const themeContext = useThemeUI();
  const { theme } = themeContext;

  return (
    <LoginWrapper>
      <Outlet/>
    </LoginWrapper>
  )
}

export default LoginLayout;