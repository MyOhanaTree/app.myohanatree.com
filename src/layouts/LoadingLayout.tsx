import React, { useContext, useEffect, useState } from "react";
import { LoadingWrapper } from "./styled";
import { useNavigate } from "react-router-dom";
import UserContext from "context/User";
import { getProfile } from "api/Auth";
import { useThemeUI } from "theme-ui";
import LoadingWheel from "components/ui/LoadingWheel";
import StyledDiv from "components/ui/StyledDiv";

const LoadingLayout = () =>{

  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");   
  }, [navigate]);

  return (        
    <LoadingWrapper theme={theme}>
      <StyledDiv styles={{flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center",}}>
        <LoadingWheel />
      </StyledDiv>
    </LoadingWrapper>
  )
}
export default LoadingLayout;