import styled from "styled-components";
import { themevals as theme } from "@/theme/themevals";

interface CustomProps {
  $customStyles?: any;
}

export const TableWrapper = styled.div<CustomProps>`
  width: 100%; 
  overflow: auto;   
  ${(props) => props.$customStyles}
`;

export const Table = styled.table<CustomProps>`  
  width: 100%; 
`;

export const TableHeader = styled.thead`
  width: 100%;
  th{
    padding:14px 30px;
    font-weight: 600;
    color: ${theme?.colors?.base_700};
  }
`;

export const TableBody = styled.tbody`
  width: 100%;
  td{
    padding:14px 30px;
    color:${theme?.colors?.base_700};
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

  tr td:first-child {
    min-width: 275px;
  }
`;

export const TableFooter = styled.tfoot`
  width: 100%;
  th,td {
    padding: 14px 30px;
    font-weight: 600;
    color: ${theme?.colors?.base_700};
  }
`;