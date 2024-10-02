import styled from "styled-components";

interface CustomProps {
  $active?: boolean;
  $customStyles?: any;
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
    background:${props => props.$active ? props.theme.colors.base_200 : "transparent"};
    &:hover{
      background:${props => props.theme.colors.base_200};
      span{
        color:${props => props.theme.colors.body};
      }
      svg{
        fill:${props => props.theme.colors.body} !important;
        path{
          fill:${props => props.theme.colors.body} !important;
        }
      }
    }
  }
`

export const LinkText = styled.span<CustomProps>`
  font-size:1rem;
  font-weight:500;
  color:${props => props.$active ? props.theme.colors.body : props.theme.colors.base_600};
`