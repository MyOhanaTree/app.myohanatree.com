import styled from "styled-components";
import { themevals as theme } from "theme/themevals";

interface CustomProps {
  $active?: boolean;
  $submitting?: boolean;
  $customStyles?: {[key: string]: string};
}

export const TableTop = styled.div<CustomProps>`  
  margin-bottom: 5px;
  width: 100%;
  form {
    flex-grow: 1;
    margin-bottom: 15px;
  }
`

export const TableBottom = styled.div<CustomProps>`
  display: flex;
  flex-wrap: wrap-reverse;
  justify-content: space-between;
  margin-top: 5px;
  width: 100%;
`

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
    color:${theme?.colors?.base_700};
    cursor:pointer;
    & div span {
      width: 100%;
    }
  }
`;

export const TableFooter = styled.tfoot`
  width: 100%;
  th{
    padding:14px 30px;
    font-weight:600;
    font-size:14px;
    color:${theme?.colors?.base_700};
    cursor:pointer;
    & div span {
      width: 100%;
    }
  }
  tr {
    border-top: 1px solid ${theme?.colors?.base_300};  
  }

`;

export const TableBody = styled.tbody`
  width: 100%;
  td{
    
    padding:14px 30px;
    color:${theme?.colors?.base_700};
    & > div {margin: -14px -30px; padding:14px 30px;}
    & > a {display: block; margin: -14px -30px; padding:14px 30px; text-decoration: none; color: ${theme?.colors?.base_700};}
    & > a:hover {color: ${theme?.colors?.base_700}; }
  }
  tr{
    border-bottom: 1px solid ${theme?.colors?.base_300};
    cursor:pointer;
    &:hover{
        background: ${theme?.colors?.base_100};
    }
  }
  tr:first-child{
    border-top: 1px solid ${theme?.colors?.base_300};
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
  flex-wrap: wrap;    
  flex: 0 1 auto; 
  gap: 15px 30px; 
  & form { display: block; flex-grow: 1 }
`;

export const TableFilters = styled.div<CustomProps>`
  display: ${props => props.$active ? "block" : "none"};
  position: relative;
  ${props => props.$customStyles};
`;

export const FiltersWrap = styled.div<CustomProps>`
  position: absolute;
  z-index: 1042;
  width: 100%;
  max-width: 300px;
  right: 0;
  top: 0;
  padding: 5px;
  background: #fff;
  flex-grow: 1;
  display: flex; 
  flex-direction: column;   
  align-items: flex-end;
  gap: 15px;  
  border-radius: 5px;
  border: 1px solid ${theme?.colors?.base_300};  
  box-shadow: 0px 0px 5px ${theme?.colors?.base_300};
`;

export const TableBtns = styled.div`
  display: flex;
  gap: 15px;
  & .btn,& button { 
    min-height: 44px;
  }
`;

export const TablePagination = styled.div`  
  display:flex;
  flex-wrap: wrap;
  align-items: center;     
  color: ${theme?.colors?.base_700}!important;
  gap: 10px 20px;
  & .btn {    
    width: 44px;
    text-align: center;
    margin: .25rem;
    border-radius: 4px;
    border-color: ${theme?.colors?.base_300}!important;
    background-color: ${theme?.colors?.white};
    & svg {max-height: 15px; width: auto; fill:  ${theme?.colors?.base_500}!important;}
    &.btn-next svg ,&.btn-last svg {transform: scaleX(-1);}
  }
  & .react-select__control {  
    margin: .25rem;  
    & .react-select__indicator-separator {
      display: none;
    }    
  }
  & > div {display:flex; flex-wrap: no-wrap; align-items: center;}  
`;