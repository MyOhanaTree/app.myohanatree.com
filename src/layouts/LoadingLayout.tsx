import React, { useEffect } from "react";
import { LoadingWrapper } from "./styled";
import { useNavigate } from "react-router-dom";
import { Box, Spinner, useThemeUI } from "theme-ui";

const LoadingLayout = () =>{

  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/dashboard");   
  }, [navigate]);

  return (        
    <LoadingWrapper theme={theme}>
      <Box sx={{flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center",}}>
        <Spinner size={54} />
      </Box>      
    </LoadingWrapper>
  )
}
export default LoadingLayout;