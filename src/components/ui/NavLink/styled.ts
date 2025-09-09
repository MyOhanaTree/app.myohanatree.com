import styled from "styled-components";
import { themevals } from "@/theme/themevals";

interface CustomProps {
  $active?: boolean;
}
  

export const NavLinkWrapper = styled.div<CustomProps>`    
  .link {
    text-decoration:none !important;
    padding:10px;
    border-radius:5px;        
    cursor:pointer;
    display:flex;
    width: 100%;
    gap: 8px;
    text-decoration: none;
    background:${props => props.$active ? themevals?.colors?.base_200 : "transparent"};
    svg{
      height: 20px;
      width: 20px;
    }
    &:hover{
      background:${themevals?.colors?.base_200};
      span{
        color:${themevals?.colors?.body};
      }
      svg{
        fill:${themevals?.colors?.body} !important;
        path{
          fill:${themevals?.colors?.body} !important;
        }
      }
    }
  }
`

export const LinkText = styled.span<CustomProps>`
  font-size:1rem;
  font-weight:500;
  color:${props => props.$active ? themevals?.colors?.body : themevals?.colors?.base_600};
`