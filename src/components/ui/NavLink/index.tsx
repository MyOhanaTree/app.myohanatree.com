import React from "react";
import { NavLinkWrapper, LinkText } from "./styled";
import { useThemeUI } from "theme-ui";
import { Link, useLocation } from "react-router-dom";

interface NavLinkProps {
  link?: string;
  icon?: React.ComponentType<any>;
  label?: string;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ link, icon: Icon, label, onClick }) => {
  const themeContext = useThemeUI();
  const { theme } = themeContext;
  const pathname = useLocation().pathname
  const isActive = link ? link === '/' ? pathname === '/' : pathname.startsWith(link ?? "") : false;

  return (    
    <NavLinkWrapper $active={isActive}>
      {link &&
        <Link className="link" to={link}>
          {Icon && <Icon fill={isActive ? theme?.colors?.body : theme?.colors?.base_500} width={"20px"} height={"23.33px"} mr={"8px"} />}
          <LinkText $active={isActive}>{label}</LinkText>
        </Link>
      }
      {!link &&
        <span className="link" onClick={onClick}>
          {Icon && <Icon fill={theme?.colors?.base_500} width={"20px"} height={"23.33px"} mr={"8px"} />}
          <LinkText>{label}</LinkText>
        </span>
      }
    </NavLinkWrapper>    
  );
};

export default NavLink;
