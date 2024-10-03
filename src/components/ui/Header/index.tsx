import React, { useState, useContext, useEffect, useRef } from "react";
import { HeaderWrapper, HeaderActions, TitleWrapper, SubHeaderWrapper, TitleInner, DropDownWrapper, DropDown, DropDownToggle, LinkWrapper, SubHeaderInner } from "./styled";
import { useThemeUI } from "theme-ui";
import { useNavigate } from "react-router-dom";

import UserContext from "context/User";

import H1 from "components/typography/H1";
import NavLink from "components/ui/NavLink";
import { ProfileIcon, LogoutIcon, BellIcon } from "components/svg";

const Header = ({children, title}: any) =>{
  const navigate = useNavigate();
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const { user, setUser }: any = useContext(UserContext);
  const [showUser, setShowUser] = useState<boolean>(false);

  const dropdownRef = useRef<any>(null);
  const dropdownRef2 = useRef<any>(null);

  const _logout = () =>{
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");    
  }

  const handleClickOutside = (event: any) => { 
    if(dropdownRef.current && !dropdownRef.current.contains(event.target) && showUser) {      
      setShowUser(false);
    }
    return true;
  }

  useEffect(() => {      
    document.addEventListener('touchstart', handleClickOutside);          
    document.addEventListener("mousedown", handleClickOutside);
    return () => { 
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutside); 
    };
  }, [dropdownRef.current,dropdownRef2.current]);

  return (
    <HeaderWrapper theme={theme}>
      <TitleWrapper theme={theme}>
         <TitleInner>
          <H1 fontSize={"22px"} color={theme?.colors?.base_800}>{title}</H1>            
        </TitleInner> 
        <HeaderActions>
          {user &&     
            <DropDownWrapper ref={dropdownRef}>                                     
              <DropDownToggle onClick={() => setShowUser(!showUser)}><ProfileIcon width="30px" height="30px" /></DropDownToggle>               
              {showUser && 
                <DropDown>
                  <LinkWrapper>
                    <span className="navTitle">{user.firstName} {user.lastName}</span>
                    <NavLink link={"/profile"} label={"Profile"} />
                    <NavLink onClick={_logout} icon={LogoutIcon} label={"Log Out"} />
                  </LinkWrapper>
                </DropDown>
              }           
            </DropDownWrapper>
          }                
        </HeaderActions>       
      </TitleWrapper>
      {children && 
        <SubHeaderWrapper theme={theme}>
          <SubHeaderInner>
            {children}
          </SubHeaderInner>
        </SubHeaderWrapper>
      }
    </HeaderWrapper>
  )
}

export default Header;