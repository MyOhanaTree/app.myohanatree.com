import styled from "styled-components";
import { themevals } from "theme/themevals";

export const HeaderWrapper = styled.div`    
  border-bottom:1px solid ${themevals?.colors?.base_300};    
  background-color: #fff;
  box-shadow: 0px 4px 12px 0px rgba(113, 125, 150, 0.05);
  position: sticky;
  top: 0;
  z-index: 1000;        
`;

export const TitleWrapper = styled.div`
  height:65px;
  display:flex;
  justify-content: space-between;
  align-items:center;        
  padding: 0 40px;
  width: 100%;
  margin: 0 auto;
  @media (max-width: 991px)  {    
    padding: 0 25px;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const TitleInner = styled.div``;

export const DropDownWrapper = styled.div`
  position: relative;  
`;

export const DropDownToggle = styled.span`
  cursor: pointer;
`;

export const DropDown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: #fff;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, .1);
  box-shadow: 0px 4px 12px rgba(0, 0, 0, .1);
  min-width: 200px;
  max-width: 100%;
`;

export const LinkWrapper = styled.div`
  span.navTitle {
    cursor: default;
    display: block;
    padding:10px;
    border-radius:5px;
  }

  span.logOut {
    cursor: pointer;
    display: block;
    padding:10px;
    border-radius:5px;
  }
`;

export const SubHeaderWrapper = styled.div`
  height:65px;
  display:flex;
  align-items:center;    
  padding: 0 40px;
  border-top:1px solid ${themevals?.colors?.base_300};
  @media (max-width: 991px)  {    
    padding: 0 25px;
  }
`;

export const SubHeaderInner = styled.div`  
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;