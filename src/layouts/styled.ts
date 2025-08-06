import styled from "styled-components";
import { themevals } from "@/theme/themevals";

export const PageWrapper = styled.div`
  background: linear-gradient(180deg, ${themevals.colors.base_100} 0%, ${themevals.colors.base_100} 100%);
  width: 100%;
  min-height: 100%;
  flex-grow: 1;
  display: grid;
  grid-template-columns: 250px calc(100% - 250px);  
  @media (max-width: 991px)  {
    display: flex;      
    flex-direction: column;
    grid-template-columns: none;
  }
`;

export const PageContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;  
  flex-grow: 1;
`;

export const NavWrapper = styled.div`
  position: relative; 
  z-index: 1999;  
  width: 250px; 
  min-width: 250px;
  max-width: calc(100% - 25px);
  background-color: #ffffff;
  border-right: 1px solid ${themevals.colors.base_300};
  box-shadow: 4px 0px 8px 0px rgba(113, 125, 150, 0.05);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  @media (max-width: 991px)  {
    display: none;    
  }
`;

export const NavInner = styled.div`
  height: 100%;
  width: 100%;
  position: sticky;
  top: 0; 
  padding-top: 10px; 
  display: flex;
  flex-direction: column;  
`;

export const NavInnerMenu = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const MobileNavWrapper = styled.div`
  position: sticky;  
  order: 3;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1999;
  display: none;
  @media (max-width: 991px)  {
    display: block;        
  }
`
export const MobileNavInner = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 5px;
  margin-inline: 10px;
  padding: 5px;
  background-color: #ffffff; 
  border: 1px solid ${themevals.colors.base_300};  
  border-bottom: none;
  border-radius: 5px 5px 0 0;  
  box-shadow: 0px 0px 6px 0px rgba(113, 125, 150, 0.15);
`

export const LoginWrapper = styled.div`
  position: relative;
  width: 100%;
  background: linear-gradient(180deg, ${themevals.colors.base_200} 0%, ${themevals.colors.base_200} 100%);
  transition: background 0.3s linear;
  min-height: 100%;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`;

export const LinkWrapper = styled.div`
  padding: 0 1rem;
  width: 100%;
  margin-bottom: 10px;
`;