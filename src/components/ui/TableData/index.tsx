import React, { useCallback, useEffect, useRef, useState } from "react";
import moment from "moment";
import { Formik, Form } from "formik";
import { Box, Button, Flex, IconButton, Spinner } from "theme-ui";

import { flexRender, getCoreRowModel, useReactTable, getSortedRowModel, Row } from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import {
  TableWrapper,
  TableTop,
  TableBottom,
  TableHeader,
  TableBody,
  TableFooter,
  CellInner,
  TableActions,
  TablePagination,
  TableBtns,
  Table,
  TPdiv,
  TPdivMobileHidden,
} from "./styled";

import { ArrowIcon, ChevronIcon, FilterIcon } from "components/svg";

import SearchField from "components/forms/SearchField";
import SelectInput from "components/forms/SelectInput";
import H5 from "components/typography/H5";
import LoadingButton from "components/ui/LoadingButton";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../Modal";
import { findInNestedArray, getNestedValue } from "helpers/default";


interface FilterProps {
  name: string;
  [key: string]: any;
}

interface Filter {
  key?: string;
  props: FilterProps;
  component: React.ComponentType<any>;
  convertValue?: (value: any) => any;
  updateValue?: (value: any) => any;
}

interface RenderFilterParams {
  filter: Filter;
  values: any;
  setFieldValue: (key: string, value: any) => void;
  index: number | string;
}

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
  searchStyles,
  defaultSortBy = "id",
  defaultSortDir = "asc",
  defaultPageSize = 15,
  pageSizes,
  enableSearch = true,
  enablePaging = true,
  enableFooter = false,
  pagingIfPaged = false,
  isFixed = false,
  forceQueryVariables = {},
  returnData,
  returnQuery,
  onRowClick,
}: {
  api?: any;
  apiVariables?: { [key: string]: any };
  title?: any;
  refresh?: boolean;
  columns?: any;
  actions?: any[];
  filters?: any[];
  preFilters?: any;
  filtersStyles?: any;
  searchStyles?: any;
  defaultSortBy?: string;
  defaultSortDir?: string;
  defaultPageSize?: number;
  enableSearch?: boolean;
  enablePaging?: boolean;
  enableFooter?: boolean;
  pagingIfPaged?: boolean;
  isFixed?: boolean;
  pageSizes?: number[];
  forceQueryVariables?: object;
  customStyles?: any;
  returnData?: (e?: any) => void;
  returnQuery?: (e?: any) => void;
  onRowClick?: (e: React.MouseEvent<HTMLTableRowElement>, row: Row<any>) => void;
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
    pageSizes
      ? [...pageSizes.map((p) => ({ value: p, label: p })), { value: 1000, label: "All" }]
      : [
          { value: 15, label: 15 },
          { value: 50, label: 50 },
          { value: 100, label: 100 },
          { value: 1000, label: "All" },
        ]
  );

  const fuzzyFilter = (row: any, columnId: any, value: any, addMeta: any) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
  };

  const saveStateToLocalStorage = () => {
    if (!(pagination.pageIndex >= 0)) return;

    const state = {
      api: api.name || "",
      timestamp: moment().valueOf(),
      sorting,
      pagination,
      columnFilters,
      globalFilter,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  };

  useEffect(() => saveStateToLocalStorage(), [sorting, pagination, columnFilters, globalFilter]);

  const loadStateFromLocalStorage = () => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      const state = JSON.parse(savedState);
      if (state.timestamp && moment(state.timestamp).isBefore(moment().subtract(12, "hours"))) return;
      if (state.api !== api.name) return;

      setSorting(state.sorting || [{ id: defaultSortBy, desc: defaultSortDir?.toLowerCase() === "desc" }]);
      setPagination(state.pagination || { pageIndex: 0, pageSize: defaultPageSize || 15 });
      setColumnFilters(state.columnFilters || preFilters || {});
      setGlobalFilter(state.globalFilter || null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      sorting,
      pagination: {
        pageIndex: pagination?.pageIndex || 0,
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
    if (e) {
      setLoadingData(true);
      const newFilters: any = {};
      for (const [key, val] of Object.entries(e)) {
        let thisval = Array.isArray(val) ? val.join(",") : val ?? "";
        if(!thisval) continue;

        const getFilter = findInNestedArray(filters,'key',key);                
        if(getFilter){
          thisval = (getFilter.condition) ? `${thisval}:${getFilter.condition}` : thisval;
        }
        newFilters[key] = thisval;
      }

      if (JSON.stringify(columnFilters) !== JSON.stringify(newFilters)) {
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
    const code = e.keyCode || e.which;
    if (code === 37 || code === 38 || code === 39 || code === 40) {
      return;
    }

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      table.setPageIndex(0);
      const value = e.target.value;
      if (value.length >= 3 || code === 13) {
        setGlobalFilter(value);
      } else {
        setGlobalFilter(null);
      }
    }, 500);
  };

  const getSortDir = (sort: any, defaultDir: any) => {
    switch (true) {
      case sort?.length > 0 && sort?.[0]?.desc:
        return "desc";
      case sort?.length > 0 && !sort?.[0]?.desc:
        return "asc";
      default:
        return defaultDir;
    }
  };

  const getData = useCallback(async () => {
    if (controller.current) {
      controller.current.abort();
      controller.current = null;
    }
    clearTimeout(loadTimer.current);

    loadTimer.current = setTimeout(async () => {
      setLoadingData(true);
      controller.current = new AbortController();

      const query = {
        filters : {
          ...columnFilters,
          ...(forceQueryVariables || {}),
        },
        search: globalFilter || null,
        sortBy: sorting[0] ? (sorting[0]["id"] ? sorting[0]["id"] : defaultSortBy) : defaultSortBy || "id",
        sortDir: getSortDir(sorting, defaultSortDir),
        pageNum: (pagination.pageIndex || 0) + 1,
        recordsPer: pagination.pageSize || defaultPageSize || 15,
      };

      try {
        const apiCall = callApi.current;
        const res = await apiCall({ ...apiVariables, query, controller: controller.current, excludeInterceptor: true });
        if (res.items) {
          setTableData(res.items ? res.items : []);
          setPageCount(res.pages || 1);
          setShowRecordsOptions((old) => {
            const all = old.find((i) => i.label === "All");
            if (all) {
              all.value = res.total || all.value;
            }
            return old;
          });
        } else {
          if (Array.isArray(res)) {
            setTableData(res);
            setPageCount(1);
            table.setPageIndex(0);
          }
        }

        const returnDataCall = callReturnData.current;
        if (typeof returnDataCall === "function") {
          returnDataCall(res);
        }

        const returnQueryCall = callReturnQuery.current;
        if (typeof returnQueryCall === "function") {
          returnQueryCall(query);
        }
      } catch (e) {}

      setLoadingData(false);
    }, 500);
    return true;
  }, [sorting, pagination.pageIndex, pagination.pageSize, globalFilter, columnFilters]);

  

  const renderFilter = ({ filter, values, setFieldValue, index }: RenderFilterParams) => {
    const getValue = getNestedValue(values, filter.props.name);
    const newValue = filter?.convertValue ? filter.convertValue(getValue) : getValue;
    const updateValue = (val?: any) => {
      const newVal = filter?.updateValue ? filter.updateValue(val) : val;
      setFieldValue(`${filter.props.name}`, newVal);
    };
    
    const Component = filter.component;
    return <Component key={filter.key || index} {...filter.props} value={newValue} onChange={updateValue} />;
  };

  useEffect(() => {
    if (refresh) {
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
      {title && <H5>{title}</H5>}
      <TableTop>        
        {(enablePaging && (!pagingIfPaged || pagingIfPaged && table.getPageCount() > 1)) &&
          <Pagination {...{ table, pagination, showRecordsOptions, defaultPageSize }} />
        }
        <Formik initialValues={{}} onSubmit={onFormChange}>
          {({ values, setFieldValue, submitForm, resetForm }) => {
            return (
              <Form noValidate autoComplete="off" ref={filterFormRef}>
                <TableActions>
                  <Flex
                    sx={{                      
                      flexWrap: "wrap",
                      gap: "10px",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      marginLeft: "auto",
                    }}
                  >
                    {(filters?.length || 0) > 0 && (<>
                      <IconButton type="button" onClick={() => setShowFilters(!showFilters)}>
                        <FilterIcon height={25} />
                      </IconButton>
                      <Modal isOpen={showFilters} toggle={() => setShowFilters(false)}>  
                        <ModalHeader toggle={() => setShowFilters(false)}>Filters</ModalHeader>
                        <ModalBody>
                          {filters?.map((filter, index) => {
                            if(Array.isArray(filter)){
                              return <Flex key={index} sx={{gap : "1rem", flexDirection: ["column", "row"]}}>
                                {filter.map((f, i) => <Box key={i} sx={{width: "100%"}}>{renderFilter({ filter: f, values, setFieldValue, index : `${index}-${i}` })}</Box>)}
                              </Flex>
                            } else {
                              return renderFilter({ filter, values, setFieldValue, index });
                            }
                          })}
                        </ModalBody>
                        <ModalFooter>
                          <Button variant="outline.secondary" type="button" onClick={() => setShowFilters(false)}>Cancel</Button>
                          <Button variant="outline.warning" type="button" onClick={() => resetForm()}>Reset</Button>                    
                          <LoadingButton variant="success" onClick={submitForm} disabled={loadingData} $loading={loadingData}>Go!</LoadingButton>
                        </ModalFooter>
                      </Modal>                    
                    </>)}
                    {enableSearch && (
                      <SearchField
                        name="search"
                        value={globalFilter}
                        customStyles={searchStyles}
                        onKeyUp={(e: any) => onSearchChange(e)}
                        onChange={() => submitForm()}
                        onBlur={() => submitForm()}
                      />
                    )}
                    {actions && <TableBtns>{actions}</TableBtns>}
                  </Flex>
                </TableActions>                
              </Form>
            );
          }}
        </Formik>
      </TableTop>
      <TableWrapper $customStyles={customStyles}>
        <Table $isFixed={isFixed}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header: any) => (
                  <th key={header.id} style={{...header?.column?.columnDef?.meta?.style}}>
                    {header.isPlaceholder ? null : (
                      header.column.columnDef.enableSorting !== false ? 
                        <CellInner
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: (
                              <ArrowIcon
                                direction="up"
                                fill={"var(--theme-ui-colors-base_500)"}
                                width="12px"
                                height="auto"
                                ml="10px"
                              />
                            ),
                            desc: (
                              <ArrowIcon
                                direction="down"
                                fill={"var(--theme-ui-colors-base_500)"}
                                width="12px"
                                height="auto"
                                ml="10px"
                              />
                            ),
                          }[header?.column?.getIsSorted() as "asc" | "desc"] ?? (
                            <ArrowIcon fill="white" width="12px" height="auto" ml="10px" />
                          )}
                        </CellInner>
                      : flexRender(header.column.columnDef.header, header.getContext())                        
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </TableHeader>
          <TableBody>
            {loadingData && (
              <tr>
                <td colSpan={table.getAllColumns().length}>
                  <Box sx={{ textAlign: "center" }}>
                    <Spinner size={25} strokeWidth={3} title="loading" />
                  </Box>
                </td>
              </tr>
            )}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} onClick={onRowClick ? (e) => onRowClick(e, row) : undefined}>
                {row.getVisibleCells().map((cell: any) => (
                  <td key={cell.id} style={{ ...cell?.column?.columnDef?.styles }}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </TableBody>
          {enableFooter && (
            <TableFooter>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header: any) => (
                    <th key={header.id}>                      
                      {header.isPlaceholder ? null : (
                        header.column.columnDef.enableSorting !== false ? 
                          <CellInner
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {{
                              asc: (
                                <ArrowIcon
                                  direction="up"
                                  fill={"var(--theme-ui-colors-base_500)"}
                                  width="12px"
                                  height="auto"
                                  ml="10px"
                                />
                              ),
                              desc: (
                                <ArrowIcon
                                  direction="down"
                                  fill={"var(--theme-ui-colors-base_500)"}
                                  width="12px"
                                  height="auto"
                                  ml="10px"
                                />
                              ),
                            }[header?.column?.getIsSorted() as "asc" | "desc"] ?? (
                              <ArrowIcon fill="white" width="12px" height="auto" ml="10px" />
                            )}
                          </CellInner>
                        : flexRender(header.column.columnDef.header, header.getContext())                        
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </TableFooter>
          )}
        </Table>
      </TableWrapper>
      <TableBottom>
        {(enablePaging && (!pagingIfPaged || pagingIfPaged && table.getPageCount() > 1)) &&
          <Pagination {...{ table, pagination, showRecordsOptions, defaultPageSize }} />
        }
      </TableBottom>
    </>
  );
};

export default TableData;

const Pagination = ({ table, pagination, defaultPageSize, showRecordsOptions }: any) => (
  <TablePagination>
    <TPdiv>
      <button className="btn btn-first" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
        <ChevronIcon />
        <ChevronIcon />
      </button>
      <button
        className="btn btn-prev"
        onClick={() => table.setPageIndex(table.getState().pagination.pageIndex - 1)}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronIcon />
      </button>
      <button
        className="btn btn-next"
        onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 1)}
        disabled={!table.getCanNextPage()}
      >
        <ChevronIcon />
      </button>
      <button
        className="btn btn-last"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <ChevronIcon />
        <ChevronIcon />
      </button>
    </TPdiv>
    <TPdivMobileHidden>
      <div className="page-count">
        Page
        <SelectInput
          name="pageIndex"
          options={Array.from(Array(table.getPageCount() || 1).keys()).map((v) => ({ value: v, label: v + 1 }))}
          value={pagination.pageIndex || 0}
          onChange={(e: any) => {
            table.setPageIndex(Number(e));
          }}
          $customStyles={{ padding: 0, margin: 0, minWidth: "auto" }}
        />
        of {table.getPageCount() || 1}
      </div>
    </TPdivMobileHidden>
    <TPdiv>
      <span>Count &nbsp;</span>
      <SelectInput
        name="pageSize"
        options={showRecordsOptions}
        value={pagination.pageSize || defaultPageSize || 15}
        onChange={(e: any) => {
          table.setPageIndex(0);
          table.setPageSize(Number(e));
        }}
        $customStyles={{ padding: 0, margin: 0, minWidth: "auto" }}
      />
    </TPdiv>
  </TablePagination>
);

