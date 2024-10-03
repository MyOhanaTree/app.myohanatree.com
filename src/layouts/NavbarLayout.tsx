import React, { useContext, useEffect, useState } from "react";
import { NavWrapper, NavInner, NavInnerMenu, LogoWrapper, LinkWrapper } from "./styled";
import { useThemeUI } from "theme-ui";
import UserContext from "context/User";

import AdminLogo from "components/img/AdminLogo";
import NavLink from "components/ui/NavLink";

import { UsersIcon } from "components/svg";

const NavbarLayout = () => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;  
  const { user } = useContext<any>(UserContext);
  const [navToggle, setNavbarToggle] = useState<boolean>(false);

  const toggleNavBar = () => setNavbarToggle(!navToggle);

  useEffect(() => {
    document.body.className= navToggle ? "navbar-open" : "";
  },[navToggle]);

  if(!user?.id) return null

  return (
    <NavWrapper theme={theme}>      
      <NavInner>        
        <span className="navbar-toggle" onClick={toggleNavBar}></span>
        <LogoWrapper theme={theme}>      
          <AdminLogo alt="" customStyles={{width: "auto!important"}} />                      
        </LogoWrapper>
                
        <NavInnerMenu>            
          {(user?.permissions || []).find((x: any) => ["userAccess"].includes(x)) &&
            <LinkWrapper>
              <NavLink link={"/users"} icon={UsersIcon} label={"Users"}></NavLink>
            </LinkWrapper>
          }                        
        </NavInnerMenu>
      </NavInner>
    </NavWrapper>
  );
};
export default NavbarLayout;
