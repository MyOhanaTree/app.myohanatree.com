import { useContext, useEffect, useState } from "react";
import { NavWrapper, NavInner, NavInnerMenu, LinkWrapper, MobileNavWrapper, MobileNavInner } from "./styled";
import { Box, Divider } from "theme-ui";
import UserContext from "@/context/User";

import NavLink from "@/components/ui/NavLink";
import { useNavigate } from "react-router-dom";

import { BiLogOut } from "react-icons/bi";
import { PiUsersFill, PiTreeFill, PiUserCircle } from "react-icons/pi";

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
              <NavLink link={"/"} icon={PiTreeFill} label={"Tree"} />
            </LinkWrapper>
            {(user?.permissions || []).find((x: any) => ["userAccess"].includes(x)) &&
              <LinkWrapper>
                <NavLink link={"/users"} icon={PiUsersFill} label={"Users"} />
              </LinkWrapper>
            }                        
            <Box sx={{marginTop : "auto"}}>
              <Divider sx={{marginTop: "auto"}} />                             
              <LinkWrapper>
                <NavLink link={"/profile"} icon={PiUserCircle} label={"Profile"} />
              </LinkWrapper>
              <LinkWrapper>
                <NavLink onClick={_logout} icon={BiLogOut} label={"Log Out"} />
              </LinkWrapper> 
            </Box>
          </NavInnerMenu>
        </NavInner>
      </NavWrapper>
      <MobileNavWrapper>
        <MobileNavInner>                                    
          <NavLink link={"/"} icon={PiTreeFill} label={""} />
          {(user?.permissions || []).find((x: any) => ["userAccess"].includes(x)) &&
            <NavLink link={"/users"} icon={PiUsersFill} label={""} />
          }                        
          <NavLink link={"/profile"} icon={PiUserCircle} label={""} />
          <NavLink onClick={_logout} icon={BiLogOut} label={""} />
        </MobileNavInner>
      </MobileNavWrapper>
    </>
  );
};
export default NavbarLayout;
