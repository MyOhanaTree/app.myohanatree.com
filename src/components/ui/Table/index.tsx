import React, { useEffect, useMemo, useState } from "react";
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel, getFilteredRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import {Formik, Form } from "formik";
import { TableWrapper, Table, TableHeader, TableBody, CellInner, TableActions, TablePagination, TableFilters, TableSearch, TableBtns } from "./styled";

import { ArrowIcon, ChevronIcon } from "components/svg";

import SearchField from "components/forms/SearchField";
import SelectInput from "components/forms/SelectInput";
import StyledDiv from "components/ui/StyledDiv";
import H5 from "components/typography/H5";

const TableBasic = ({ 
  data, 
  title,
  columns, 
  actions, 
  filters, 
  defaultPageSize = 20, 
  enableSearch = true, 
  enablePaging = true,
  customStyles,
}: {
  data?: any;
  title?: any;
  columns?: any;
  actions?: any[];
  filters?: any[];
  defaultPageSize?: number; 
  enableSearch?: boolean; 
  enablePaging?: boolean;
  customStyles?: any;
}) => {

  const [sorting, setSorting] = useState<any>([]);
  const [columnFilters, setColumnFilters] = useState<any>([]);  
  const [globalFilter, setGlobalFilter] = useState<any>("");    

  const [showRecordsOptions] = useState([
    { value : 10, label : 10},
    { value : 20, label : 20}, 
    { value : 50, label : 50}, 
    { value : 100, label : 100}
  ]);



  const [tableData, setTableData] = useState<any[]>([]);

  const fuzzyFilter = (row: any, columnId: any, value: any, addMeta: any) => {    
    const itemRank = rankItem(row.getValue(columnId), value);    
    addMeta({itemRank});
    return itemRank.passed;
  };

  const table = useReactTable({
    data : tableData,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      globalFilter,   
      columnFilters,   
    },    
    initialState: {
      pagination: {
        pageSize: defaultPageSize,
      },
    },    
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    globalFilterFn: fuzzyFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });  

  useEffect(() => {
    if(defaultPageSize){
      table.setPageSize(Number(defaultPageSize))
    }
  },[defaultPageSize])
 
  const onFormChange = (e: any) => {
    const data: any = Object.fromEntries((new FormData(e.currentTarget) as any).entries());    
    setGlobalFilter(data?.search || "");

    const newFilters: any = {};
    for (const [key, value] of Object.entries(data)) {
      if(key === "search"){ continue; }
      newFilters[key] = value;
    }
    setColumnFilters(newFilters);            
  };

  useEffect(() => {
    setTableData(data);
  },[data])

  return (
    <>
      <TableActions>      
      {title &&
          <StyledDiv>
            <H5 {...{marginBottom : "0"}}>{title}</H5>                          
          </StyledDiv>
        }  
        <StyledDiv styles={{display: "flex", flexWrap : "wrap-reverse", gap: "10px", justifyContent: "flex-end", alignItems : "center"}}>            
          {enableSearch &&
            <StyledDiv styles={{borderRadius: "5px", boxShadow: "0px 4px 12px 0px rgba(113, 125, 150, 0.05)"}}>
              <TableSearch>
                <SearchField 
                  name="search" 
                  value={globalFilter}
                  onChange={(val: any) => { setGlobalFilter(val || undefined) }} 
                  width={"250px"} 
                />
              </TableSearch>
            </StyledDiv>
          }
          {filters &&
            <TableFilters>
              <Formik onSubmit={async () => null} initialValues={{}}>          
                {({ values, setFieldValue }: any) => {                 
                  return (                                            
                    <Form noValidate autoComplete="off" onChange={onFormChange} onBlur={onFormChange}>                                
                      {filters?.map((filter: any, index: number) => {
                        const Component = filter.component;
                        return (
                          <Component
                            key={filter?.key || index}
                            {...filter?.props}
                            value={values[filter.props.name]}
                            onChange={(val?: any) => setFieldValue(filter.props.name,val)}
                          />
                        )}
                      )}                 
                    </Form>                             
                  )}                                              
                }            
              </Formik>                  
            </TableFilters>
          }
          {actions &&              
            <TableBtns>
              {actions}
            </TableBtns>
          }
        </StyledDiv>
      </TableActions>
      <TableWrapper $customStyles={customStyles}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => {                    
                  return <th key={header.id} style={{...header?.column?.columnDef?.styles}}>
                    {header.isPlaceholder ? null : (
                      <CellInner onClick={header.column.getToggleSortingHandler()}>
                        {flexRender(header.column.columnDef.header, header.getContext())}                          
                        {
                          {
                            asc: <ArrowIcon direction="up" fill="var(--theme-ui-colors-base_500)" width="12px" height="auto" ml="10px" />,
                            desc: <ArrowIcon direction="down" fill="var(--theme-ui-colors-base_500)" width="12px" height="auto" ml="10px" />,
                          }[header?.column?.getIsSorted() as "asc" | "desc"] ?? (
                            <ArrowIcon fill="white" width="12px" height="auto" ml="10px" />
                          )
                        }                        
                      </CellInner>
                    )}
                  </th>
                })}
              </tr>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row: any, index: number) => (                
              <tr key={index}>
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id} style={{...cell?.column?.columnDef?.styles}}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
      {enablePaging &&
        <TablePagination>
          <div>
            <button
              className="btn btn-first"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronIcon /><ChevronIcon />
            </button>
            <button
              className="btn btn-prev"
              onClick={() => table.setPageIndex((table.getState().pagination.pageIndex) - 1)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronIcon />
            </button>
            <button
              className="btn btn-next"
              onClick={() => table.setPageIndex((table.getState().pagination.pageIndex) + 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronIcon />
            </button>
            <button
              className="btn btn-last"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronIcon /><ChevronIcon />
            </button>
          </div>
          <div>
            <span>
                Page {" "}
                {table.getState().pagination.pageIndex + 1} of {" "}
                {table.getPageCount() || 1}
            </span>        
          </div>
          <div>          
              <span>Go To Page &nbsp;</span>
              <SelectInput
                name="pageIndex"                                     
                options={Array.from(Array(table.getPageCount() || 1).keys()).map((v) => ({ value : v, label : v + 1}))}               
                value={(Array.from(Array(table.getPageCount() || 1).keys()).map((v) => ({ value : v, label : v + 1}))).find(o => o.value === (table.getState().pagination.pageIndex))?.value} 
                onChange={(e: any) => table.setPageIndex(Number(e))}       
                $customStyles={{paddingBottom : "0", marginBottom: "0", minWidth: "auto"}}  
              />                   
          </div>
          <div>
            <span>Per Page &nbsp;</span>
              <SelectInput 
                name="pageSize"
                options={showRecordsOptions}               
                value={showRecordsOptions?.find(o => o.value === table.getState().pagination.pageSize)?.value} 
                onChange={(e: any) => table.setPageSize(Number(e))}    
                $customStyles={{paddingBottom : "0", marginBottom: "0", minWidth: "auto"}}  
              />
          </div>
        </TablePagination>
      }
    </>
  );
};

export default TableBasic;
