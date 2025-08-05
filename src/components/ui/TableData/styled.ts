import styled from "styled-components";
import { themevals as theme } from "@/theme/themevals";

interface CustomProps {
  $active?: boolean;  
  $submitting?: boolean;
  $customStyles?: {[key: string]: string};
  $isFixed?: boolean;
}

export const TableTop = styled.div<CustomProps>`
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  width: 100%;  
  @media (min-width: 992px)  {    
    flex-direction: row;
    align-items: flex-end;
    flex-wrap: no-wrap;
    form {
      flex-grow: 1;
    }
  }
`

export const TableBottom = styled.div<CustomProps>`
  display: flex;  
  margin-top: 5px;
  width: 100%;
  align-items: center;
  justify-content: center;
  @media (min-width: 992px)  {    
    justify-content: space-between;
    flex-wrap: no-wrap;
    form {
      flex-grow: 1;
    }
  }
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

export const Table = styled.table<CustomProps>`
  width: 100%;
  ${(props) => props.$isFixed ? `table-layout: fixed;` : ``};
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
    & > div {
      margin: -14px -30px; padding:14px 30px;
      cursor:pointer;
    }
    & > a {
      display: block; margin: -14px -30px; padding:14px 30px; text-decoration: none; color: ${theme?.colors?.base_700};
      cursor:pointer;
    }
    & > a:hover {color: ${theme?.colors?.base_700}; }
  }
  tr{
    border-bottom: 1px solid ${theme?.colors?.base_300};
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
  z-index: 9999;
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
  font-size: .875rem;
  & .page-count{
    display: flex;
    align-items: center;
  }
  & .btn {
    width: 40px;
    text-align: center;
    border-radius: 4px;
    padding: 3px!important;
    border-color: ${theme?.colors?.base_300}!important;
    background-color: ${theme?.colors?.white};
    & svg {height: 10px; width: auto; fill:  ${theme?.colors?.base_500}!important;}
    &.btn-next svg ,&.btn-last svg {transform: scaleX(-1);}
  }
  & .react-select__control {
    min-height: auto;
    margin: 0 .25rem;
    & .react-select__indicator {padding: 1px 8px!important;}
    & .react-select__indicator svg {height: 10px!important; width: auto!important;}
    & .react-select__indicator-separator {display: none;}
  }  
`;

export const TPdiv = styled.div`
  display:flex; flex-wrap: no-wrap; align-items: center;
`;

export const TPdivMobileHidden = styled.div`
  display: none;
  @media (min-width: 992px)  {    
    display:flex; flex-wrap: no-wrap; align-items: center;
  }
`;