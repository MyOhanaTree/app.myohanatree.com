import styled from "styled-components";
import { themevals } from "theme/themevals";

export const PageWrapper = styled.div`
  background: linear-gradient(180deg, ${themevals?.colors?.base_100} 0%, ${themevals?.colors?.base_100} 100%);
  width: 100%;
  min-height: 100%;
  flex-grow: 1;
  display: grid;
  grid-template-columns: 250px calc(100% - 250px);  
  @media (max-width: 991px)  {      
    grid-template-columns: 0 100%;
  }
`;

export const PageContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;  
`;

export const NavWrapper = styled.div`
  position: relative; 
  z-index: 1; 
  min-height: 100%;
  background-color: white;
  border-right: 1px solid ${themevals?.colors?.base_300};
  box-shadow: 4px 0px 8px 0px rgba(113, 125, 150, 0.05);
  display: flex;
  flex-direction: column;
  
  & .navbar-toggle {cursor: pointer; display: none; content: ""; position: absolute; top: 23px; right: -20px; width: 20px; height: 20px; background-color: ${themevals?.colors?.base_800}; border: 2px solid ${themevals?.colors?.base_800}; transition: all 150ms ease-in;}
  & .navbar-toggle:before {content: ""; display: block; height: 2px; width: calc(100% - 4px); background: ${themevals?.colors?.white}; position: absolute; top: calc(50% - 2px); left: 2px;  transform: rotate(-90deg); transition: all 150ms ease-in;}
  & .navbar-toggle:after {content: ""; display: block; height: 2px; width: calc(100% - 4px); background: ${themevals?.colors?.white}; position: absolute; top: calc(50% - 2px); left: 2px;transition: all 150ms ease-in;}
  .navbar-open & .navbar-toggle:before {transform: rotate(-45deg);}
  .navbar-open & .navbar-toggle:after {transform: rotate(45deg);}

  @media (max-width: 991px)  {
    z-index: 3;
    width: 250px; 
    min-width: 250px;
    max-width: calc(100% - 25px);
    transition: all 0.33s cubic-bezier(0.685,  0.0473,  0.346,  1);
    -webkit-transform:  translate3d(-250px,  0,  0); -moz-transform:  translate3d(-250px,  0,  0); -o-transform:  translate3d(-250px,  0,  0); -ms-transform:  translate3d(-250px,  0,  0); transform:  translate3d(-250px,  0,  0);
    & .navbar-toggle {display: block; }
    .navbar-open & { -webkit-transform:  translate3d(0,  0,  0); -moz-transform:  translate3d(0,  0,  0); -o-transform:  translate3d(0,  0,  0); -ms-transform:  translate3d(0,  0,  0); transform:  translate3d(0,  0,  0);}    
  }
`;

export const NavInner = styled.div`
  height: 100vh;
  width: 100%;
  position: sticky;
  top: 0;  
  display: flex;
  flex-direction: column;  
`;

export const NavInnerMenu = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const LoadingWrapper = styled.div`
  background: linear-gradient(180deg, ${themevals?.colors?.base_100} 0%, ${themevals?.colors?.base_100} 100%);  
  display: flex;
  flex-direction: column;
  flex-grow: 1;  
`;

export const LoginWrapper = styled.div`
  width: 100%;
  background: linear-gradient(180deg, ${themevals?.colors?.base_200} 0%, ${themevals?.colors?.base_200} 100%);
  transition: background 0.3s linear;
  min-height: 100%;
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`;

export const LogoWrapper = styled.div`
  padding: 5px;
  height: 66px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: .5rem;
  border-bottom:1px solid ${themevals?.colors?.base_300};    
  & img { 
    height: auto;
    max-height: 35px;
    width: 100px; 
    max-width: 100%;
  }
`;

export const LinkWrapper = styled.div`
  padding: 0 1rem;
  width: 100%;
  margin-bottom: 10px;
`;