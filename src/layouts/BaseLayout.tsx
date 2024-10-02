import React from "react";
import { PageWrapper, PageContent } from "./styled";
import { Outlet } from "react-router-dom";
import NavbarLayout from "./NavbarLayout";
import { useThemeUI } from "theme-ui";

const BaseLayout = () =>{

  const themeContext = useThemeUI();
  const { theme } = themeContext;
 
  return (        
    <PageWrapper theme={theme}>
      <NavbarLayout/>
      <PageContent>
        <Outlet/>
      </PageContent>
    </PageWrapper>
  )
}
export default BaseLayout;