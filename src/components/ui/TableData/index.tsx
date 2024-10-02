import React, { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import { Formik, Form } from "formik";
import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import { TableWrapper, TableTop, TableBottom, TableHeader, TableBody, TableFooter, CellInner, TableActions, TablePagination, TableFilters, FiltersWrap, TableBtns, Table } from "./styled";

import { ArrowIcon, ChevronIcon, FilterIcon } from "components/svg";

import SearchField from "components/forms/SearchField";
import SelectInput from "components/forms/SelectInput";
import LoadingWheel from "components/ui/LoadingWheel";
import StyledDiv from "components/ui/StyledDiv";
import H5 from "components/typography/H5";
import BasicButton from "components/forms/BasicButton";

const TableData = ({
  api,
  apiVariables,
  title,
  refresh,
  columns,
  actions,
  filters,
  preFilters = {},
  customStyles,
  filtersStyles,
  searchStyles,
  defaultSortBy = "id",
  defaultSortDir = "asc",
  defaultPageSize = 15,
  pageSizes,
  enableSearch = true,
  enablePaging = true,
  enableFooter = false,
  forceQueryVariables = {},
  returnData,
  returnQuery,
}: {
  api?: any;
  apiVariables?: { [key: string]: any },
  title?: any;
  refresh?: boolean;
  columns?: any;
  actions?: any[];
  filters?: any[];
  preFilters?: any,
  filtersStyles?: any;
  searchStyles?: any;
  defaultSortBy?: string;
  defaultSortDir?: string;
  defaultPageSize?: number;
  enableSearch?: boolean;
  enablePaging?: boolean;
  enableFooter?: boolean;
  pageSizes?: number[];
  forceQueryVariables?: object,
  customStyles?: any;
  returnData?: (e?: any) => void;
  returnQuery?: (e?: any) => void;
  endpoint?: string; // Add endpoint as a prop
}) => {

  const LOCAL_STORAGE_KEY = `tableDataState`; // Use endpoint in key

  const callApi = useRef(api);
  const callReturnData = useRef(returnData);
  const callReturnQuery = useRef(returnQuery);

  const loadTimer = useRef<any>(false);
  const filterFormRef = useRef<any>(false);
  const controller = useRef<any>(false);
  
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [tableData, setTableData] = useState<any[]>([]);
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({});
  const [pageCount, setPageCount] = useState<number>(1);
  const [columnFilters, setColumnFilters] = useState<any>(preFilters || {});  
  const [globalFilter, setGlobalFilter] = useState<any>(null);  
  const [showFilters, setShowFilters] = useState<boolean>(false);  

  const [showRecordsOptions, setShowRecordsOptions] = useState(
    pageSizes ? [...(pageSizes.map((p) => ({value : p, label : p}))), { value : 1000, label : "All"}] : [
    { value : 15, label : 15}, 
    { value : 50, label : 50}, 
    { value : 100, label : 100},
    { value : 1000, label : "All"}
  ]);

  const fuzzyFilter = (row: any, columnId: any, value: any, addMeta: any) => {
    const itemRank = rankItem(row.getValue(columnId), value);  
    addMeta({ itemRank });
    return itemRank.passed;
  };

  const saveStateToLocalStorage = () => {
    if(!(pagination.pageIndex >= 0)) return;

    const state = {
      api : api.name || "",
      timestamp : moment().valueOf(),
      sorting,
      pagination,
      columnFilters,
      globalFilter,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  };

  useEffect(() => saveStateToLocalStorage(), [sorting,pagination,columnFilters,globalFilter])

  const loadStateFromLocalStorage = () => {

    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState);
      if(state.timestamp && moment(state.timestamp).isBefore(moment().subtract(12,'hours'))) return;
      if(state.api !== api.name) return;

      setSorting(state.sorting || [{"id" : defaultSortBy, "desc" : (defaultSortDir === "desc")}]);
      setPagination(state.pagination || { pageIndex : 0, pageSize : defaultPageSize || 15});
      setColumnFilters(state.columnFilters || preFilters || {});
      setGlobalFilter(state.globalFilter || null);
      localStorage.removeItem(LOCAL_STORAGE_KEY)
    }
  };

  const table = useReactTable({
    data : tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting, 
      pagination : {
        pageIndex: (pagination?.pageIndex || 0),
        pageSize: pagination?.pageSize || defaultPageSize || 15,
      },
      globalFilter,   
    }, 
    pageCount: pageCount,         
    manualSorting: true,  
    manualPagination: true,
    onSortingChange: (s) => {
      setSorting(s);
    },
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: (f) => {
      setGlobalFilter(f);
    },
    onPaginationChange: (p) => {
      setPagination(p);
    },
    globalFilterFn: fuzzyFilter,
  });

  let columnTimer: any;
  const onFormChange = (e: any) => {  
    setShowFilters(false);
    if(e){      
      setLoadingData(true);  
      const newFilters: any = {};
      for (const [key, val] of Object.entries(e)) {      
        newFilters[key] = Array.isArray(val) ? val.join(",") : (val ?? "");
      }          

      if(JSON.stringify(columnFilters) !== JSON.stringify(newFilters)){
        clearTimeout(columnTimer);
        columnTimer = setTimeout(() => {        
          table.setPageIndex(0);     
          setColumnFilters(newFilters);   
        }, 500);      
      } else {
        setLoadingData(false);  
      }      
    }    
  };

  let typingTimer: any;
  const onSearchChange = (e: any) => { 
    const code = (e.keyCode || e.which);    
    if(code === 37 || code === 38 || code === 39 || code === 40) {
      return;
    }

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      table.setPageIndex(0); 
      const value = e.target.value;
      if (value.length >= 3 || (code === 13)) {
        setGlobalFilter(value);
      } else {
        setGlobalFilter(null);
      }
    }, 500);
  };
  
  const getData = useCallback(async () => {   
    if(controller.current){
      controller.current.abort(); 
      controller.current = null;
    }    
    clearTimeout(loadTimer.current);  

    loadTimer.current = setTimeout(async () => {      
      setTableData([]);
      setLoadingData(true);  
      controller.current = new AbortController();
      const query = {        
        ...columnFilters,
        ...(forceQueryVariables || {}),        
        searchString : globalFilter || null,
        sortBy : (sorting[0]) ? ((sorting[0]["id"]) ? sorting[0]["id"] : defaultSortBy) : defaultSortBy || "id",
        sortDir : (sorting[0]) ? ((sorting[0]["desc"]) ? "desc" : defaultSortDir) : defaultSortDir || "asc",
        pageNum : (pagination.pageIndex || 0) + 1,
        recordsPer : pagination.pageSize || defaultPageSize || 15,
      } 

      try {
        const apiCall = callApi.current;
        const res = await apiCall({...apiVariables, query, controller : controller.current, excludeInterceptor : true});         
        if(res.items){                     
          setTableData(res.items ? res.items : []);    
          setPageCount(res.pages || 1)
          setShowRecordsOptions((old) => {
            const all = old.find((i) => i.label === 'All');
            if(all){
              all.value = res.total || all.value
            }
            return old;
          })
        } else {
          if(Array.isArray(res)){
            setTableData(res);    
            setPageCount(1)
            table.setPageIndex(0)
          }
        }
        
        const returnDataCall = callReturnData.current;
        if(typeof returnDataCall === "function"){
          returnDataCall(res);  
        } 
        
        const returnQueryCall = callReturnQuery.current;
        if(typeof returnQueryCall === "function"){
          returnQueryCall(query);  
        } 
      } catch (e) { }      
      
      setLoadingData(false);  
    }, 500); 
    return true;
  }, [sorting, pagination.pageIndex, pagination.pageSize, globalFilter, columnFilters]);
  
  useEffect(() => { 
    if(refresh){    
      getData();
    }
  }, [getData, refresh]); 

  useEffect(() => {      
    getData();
  }, [getData, columnFilters]);  

  useEffect(() => {
    loadStateFromLocalStorage();
  }, []);

  return (
    <>
      <TableTop>       
        <Formik initialValues={columnFilters} enableReinitialize={true} onSubmit={onFormChange}>          
          {({ values, setFieldValue, submitForm }) => {           
            return (                   
              <Form noValidate autoComplete="off" ref={filterFormRef}>       
                <TableActions> 
                  {title &&
                    <StyledDiv>
                      <H5 {...{marginBottom : "0"}}>{title}</H5>                          
                    </StyledDiv>
                  }
                  <StyledDiv styles={{display: "flex", flexWrap : "wrap", gap: "10px", justifyContent: "flex-end", alignItems : "center",  marginLeft: "auto" }}>       
                    {(filters?.length || 0) > 0 &&
                      <BasicButton scheme="clear" onClick={() => setShowFilters(!showFilters)}><FilterIcon height={25} /></BasicButton>         
                    }
                    {enableSearch &&
                      <SearchField 
                        name="searchString" 
                        value={globalFilter} 
                        customStyles={searchStyles} 
                        onKeyUp={(e: any) => { onSearchChange(e) }} 
                        width={"250px"} 
                        onChange={() => { submitForm(); }} 
                        onBlur={() => { submitForm(); }}
                      />
                    }       
                    {actions &&              
                      <TableBtns>
                        {actions}
                      </TableBtns>
                    }
                  </StyledDiv>                 
                </TableActions>      
                <TableFilters $active={showFilters}>                                        
                  <FiltersWrap $customStyles={filtersStyles}>
                    {filters?.map((filter, index) => {
                      let thisValue = values[filter.props.name];                      
                      let updateValue: (e?: any) => void;
                      if(Array.isArray(filter.props.name)){                         
                        thisValue = [values[filter.props.name[0]],values[filter.props.name[1]]];  
                        updateValue = (val?: any) => { 
                          thisValue = val;
                          setFieldValue(filter.props.name[0],val[0])
                          setFieldValue(filter.props.name[1],val[1])
                        }
                      } else {
                        updateValue = (val?: any) => { 
                          thisValue = val;
                          setFieldValue(filter.props.name,val);                          
                        }
                      }
                      const Component = filter.component;
                      return (
                        <Component
                          key={filter.key || index}
                          {...filter.props}
                          value={thisValue}
                          onChange={updateValue}
                        />
                      )}
                    )}          
                    <StyledDiv styles={{marginTop: "10px"}}><BasicButton scheme="success" onClick={submitForm} $submitting={loadingData}>Go!</BasicButton></StyledDiv>            
                  </FiltersWrap>
                </TableFilters>                                                              
              </Form>                                                 
            )
          }}
        </Formik> 
        {enablePaging &&
          <Pagination {...{table, pagination, showRecordsOptions, defaultPageSize}} />
        }                     
      </TableTop>
      <TableWrapper $customStyles={customStyles}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th key={header.id} style={{width : `${100 / headerGroup.headers.length}%`}}>
                    {header.isPlaceholder ? null : (
                      <CellInner onClick={header.column.columnDef.enableSorting !== false ? header.column.getToggleSortingHandler() : () => false}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {
                          {
                            asc: <ArrowIcon direction="up" fill={"var(--theme-ui-colors-base_500)"} width="12px" height="auto" ml="10px" />,
                            desc: <ArrowIcon direction="down" fill={"var(--theme-ui-colors-base_500)"} width="12px" height="auto" ml="10px" />,
                          }[header?.column?.getIsSorted() as "asc" | "desc"] ?? (
                            <ArrowIcon fill="white" width="12px" height="auto" ml="10px" />
                          )
                        }
                      </CellInner>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </TableHeader>
          <TableBody>
            {(loadingData) &&
              <tr>
                <td colSpan={table.getAllColumns().length}>
                  <div>
                    <LoadingWheel mr={"auto"} ml={"auto"} height={"25px"} width={"25px"} stroke={"3px"} />
                  </div>
                </td>
              </tr>
            }
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id} style={{...cell?.column?.columnDef?.styles}}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </TableBody>
          {enableFooter && 
            <TableFooter>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header: any) => (
                    <th key={header.id} style={{width : `${100 / headerGroup.headers.length}%`}}>
                      {header.isPlaceholder ? null : (
                        <CellInner onClick={header.column.columnDef.enableSorting !== false ? header.column.getToggleSortingHandler() : () => false}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {
                            {
                              asc: <ArrowIcon direction="up" fill={"var(--theme-ui-colors-base_500)"} width="12px" height="auto" ml="10px" />,
                              desc: <ArrowIcon direction="down" fill={"var(--theme-ui-colors-base_500)"} width="12px" height="auto" ml="10px" />,
                            }[header?.column?.getIsSorted() as "asc" | "desc"] ?? (
                              <ArrowIcon fill="white" width="12px" height="auto" ml="10px" />
                            )
                          }
                        </CellInner>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </TableFooter>
          }
        </Table>
      </TableWrapper>  
      <TableBottom>
        {enablePaging &&
          <Pagination {...{table, pagination, showRecordsOptions, defaultPageSize}} />
        }
      </TableBottom>
    </>
  );
};

export default TableData;


const Pagination = ({ table, pagination, defaultPageSize, showRecordsOptions }: any) => (
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
          value={pagination.pageIndex || 0} 
          onChange={(e: any) => {     
            table.setPageIndex(Number(e))
          }}       
          $customStyles={{padding : 0, margin: 0, minWidth: "auto"}}  
        />                   
    </div>
    <div>
      <span>Per Page &nbsp;</span>
      <SelectInput 
        name="pageSize"
        options={showRecordsOptions}               
        value={pagination.pageSize || defaultPageSize || 15} 
        onChange={(e: any) => { 
          table.setPageIndex(0);            
          table.setPageSize(Number(e));
        }}                    
        $customStyles={{padding : 0, margin: 0, minWidth: "auto"}}  
      />
    </div>
  </TablePagination>
)