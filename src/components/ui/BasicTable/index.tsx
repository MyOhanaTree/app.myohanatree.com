import React, { ReactNode } from "react";
import {TableWrapper, Table, TableHeader, TableBody, TableFooter } from "./styled";


const BasicTable = ({
  data,
  columns,
  footer,
  sx
} : {
  data: any[];
  columns: {[key: string]: string | ReactNode};
  footer?: string[][];
  sx?: any;
}) => {


  return (
    <TableWrapper sx={sx}>
      <Table>
        <TableHeader> 
          <tr>
            {Object.entries(columns).map(([key, value]: any) => <th key={key}>{value}</th>)}       
          </tr>
        </TableHeader>
        <TableBody>
          {data.map((d: any, k: number) => (
            <tr key={k}>
              {Object.entries(columns).map(([key, value]: any) => <td key={key}>{d[key]}</td>)}
            </tr>
          ))}
        </TableBody> 
        {footer &&
          <TableFooter>
            {footer.map((ft: string[], index: number) => 
              <tr key={index}>
                {ft.filter(Boolean).map((f: string,i: number) => <th key={i}>{f}</th>)}
              </tr>
            )}
          </TableFooter>
        }
      </Table>
    </TableWrapper>
  );
};

export default BasicTable;
