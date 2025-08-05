import React, { useContext, useEffect, useState } from "react";
import { NavWrapper, NavInner, NavInnerMenu, LogoWrapper, LinkWrapper } from "./styled";
import { Box, MenuButton, Divider, IconButton } from "theme-ui";
import UserContext from "@/context/User";

import NavLink from "@/components/ui/NavLink";
import { useNavigate } from "react-router-dom";

import { LogoutIcon, ProfileIcon, TimesIcon, UsersIcon, TreeIcon } from "@/components/svg";

const NavbarLayout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext<any>(UserContext);
  const [navToggle, setNavbarToggle] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const _logout = () =>{
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");    
  }

  useEffect(() => {
    document.body.className= navToggle ? "navbar-open" : "";
  },[navToggle]);

  useEffect(() => {
    if(user?.id && loading){
      setLoading(false);
    }
  },[user]);

  useEffect(() => {
    const handleCustomEvent = (e: any) => {
      setNavbarToggle((old) => !old);
    };
    document.body.addEventListener("navBarToggle", handleCustomEvent);
    return () => { document.body.removeEventListener("navBarToggle", handleCustomEvent); };
  }, []);
  
  useEffect(() => {
    setNavbarToggle(false);
  },[location.pathname])

  const toggleNav = () => {        
    const customEvent = new Event("navBarToggle");
    document.body.dispatchEvent(customEvent);
  };    

  if(loading) return null  

  return (
    <>
      <NavWrapper>      
        <NavInner>                                    
          <NavInnerMenu>            
            <Box sx={{marginLeft : "auto", display : ["block","none"]}}>
              <IconButton type="button" onClick={() => setNavbarToggle(!navToggle)}><TimesIcon width="15px" height="15px" /></IconButton>             
            </Box>
            <LinkWrapper>
              <NavLink link={"/"} icon={TreeIcon} label={"Tree"} />
            </LinkWrapper>
            {(user?.permissions || []).find((x: any) => ["userAccess"].includes(x)) &&
              <LinkWrapper>
                <NavLink link={"/users"} icon={UsersIcon} label={"Users"} />
              </LinkWrapper>
            }                        
            <Box sx={{marginTop : "auto"}}>
              <Divider sx={{marginTop: "auto"}} />                             
              <LinkWrapper>
                <NavLink link={"/profile"} icon={ProfileIcon} label={"Profile"} />
              </LinkWrapper>
              <LinkWrapper>
                <NavLink onClick={_logout} icon={LogoutIcon} label={"Log Out"} />
              </LinkWrapper> 
            </Box>
          </NavInnerMenu>
        </NavInner>
      </NavWrapper>
      <Box sx={{ position: "absolute", top: 0, left: 0, zIndex: 1998, display : ["block","none"] }}>
        <MenuButton type="button" onClick={toggleNav} />                             
      </Box>
    </>
  );
};
export default NavbarLayout;
