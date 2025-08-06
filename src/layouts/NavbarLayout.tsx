import { useContext, useEffect, useState } from "react";
import { NavWrapper, NavInner, NavInnerMenu, LinkWrapper, MobileNavWrapper, MobileNavInner } from "./styled";
import { Box, Divider } from "theme-ui";
import UserContext from "@/context/User";

import NavLink from "@/components/ui/NavLink";
import { useNavigate } from "react-router-dom";

import { LogoutIcon, ProfileIcon, TimesIcon, UsersIcon, TreeIcon } from "@/components/svg";

const NavbarLayout = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext<any>(UserContext);
  const [loading, setLoading] = useState<boolean>(false);

  const _logout = () =>{
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");    
  }

  useEffect(() => {
    if(user?.id && loading){
      setLoading(false);
    }
  },[user]);

 

  if(loading) return null  

  return (
    <>
      <NavWrapper>      
        <NavInner>                                    
          <NavInnerMenu>            
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
      <MobileNavWrapper>
        <MobileNavInner>                                    
          <NavLink link={"/"} icon={TreeIcon} label={""} />
          {(user?.permissions || []).find((x: any) => ["userAccess"].includes(x)) &&
            <NavLink link={"/users"} icon={UsersIcon} label={""} />
          }                        
          <NavLink link={"/profile"} icon={ProfileIcon} label={""} />
          <NavLink onClick={_logout} icon={LogoutIcon} label={""} />
        </MobileNavInner>
      </MobileNavWrapper>
    </>
  );
};
export default NavbarLayout;
