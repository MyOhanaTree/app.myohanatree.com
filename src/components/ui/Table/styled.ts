import styled from "styled-components";
import { themevals as theme } from "theme/themevals";

interface CustomProps {
  $customStyles?: {[key: string]: string};
}

export const TableWrapper = styled.div<CustomProps>`
  width: 100%; 
  overflow: auto;   
  background-color: ${theme?.colors?.white};
  border-radius: 5px;
  border: 1px solid ${theme?.colors?.base_300};
  box-shadow: 0px 4px 12px 0px rgba(113, 125, 150, 0.05);

  ${(props) => props.$customStyles}
`;

export const Table = styled.table`
  width: 100%;   
`;

export const TableHeader = styled.thead`
  width: 100%;
  th{
    padding:14px 30px;
    font-weight:600;
    font-size:14px;
    color:${theme.colors.base_700};
    cursor:pointer;
  }
`;

export const TableBody = styled.tbody`
  width: 100%;
  td{
    padding:14px 30px;
    color:${theme.colors.base_700};
    & > div {margin: -14px -30px; padding:14px 30px;}
    & > a {display: block; margin: -14px -30px; padding:14px 30px; text-decoration: none; color: ${theme?.colors?.base_700};}
    & > a:hover {color: ${theme?.colors?.base_700}; }
  }
  tr{
    border-bottom: 1px solid ${theme.colors.base_300};
    cursor:pointer;
    &:hover{
        background: ${theme.colors.base_100};
    }
  }
  tr:first-child{
    border-top: 1px solid ${theme.colors.base_300};
  }  
  tr:last-child {
    border-bottom: none;
  }

  tr td:first-child {
    min-width: 275px;
  }
`;

export const CellInner = styled.div`
  display: flex;
  gap: 5px;
  align-items:center;
`;

export const TableActions = styled.div`
  display:flex;
  align-items: start;
  justify-content: space-between!important;
  flex-wrap: wrap-reverse;    
  flex: 0 1 auto; 
  gap: 15px 30px; 
  margin-bottom: 15px;
`;

export const TableSearch = styled.div`
`;

export const TableFilters = styled.div`
  flex-grow: 1;
  display: flex; 
  flex-direction: column;
  justify-content: end;    
  & > form {display: flex; flex-grow: 1; flex-wrap: wrap; gap: 15px 30px;}
  & > form > div {max-width: 100%; padding-bottom: 0;}  
`;

export const TableBtns = styled.div`
  & .btn,& button { 
    min-height: 44px;
  }
`;

export const TablePagination = styled.div`
  border-top: 1px solid ${theme.colors.base_300};
  padding-top: 1rem;
  display:flex;
  flex-wrap: wrap;
  align-items: center;     
  color: ${theme.colors.base_700}!important;
  & .btn {    
    width: 44px;
    text-align: center;
    margin: .25rem;
    border-radius: 4px;
    border-color: ${theme.colors.base_300}!important;
    background-color: ${theme.colors.white};
    & svg {max-height: 15px; width: auto; fill:  ${theme.colors.base_500}!important;}
    &.btn-next svg ,&.btn-last svg {transform: scaleX(-1);}
  }
  & .react-select__control {   
    margin: .25rem; 
    & .react-select__indicator-separator {
      display: none;
    }    
  }
  & > div {margin: 0 .75rem; display:flex; flex-wrap: no-wrap; align-items: center;}
  & > div:first-child {margin-left: 0;}  
  & > div:last-child {margin-right: 0;}  
`;