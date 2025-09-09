import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import moment from "moment";
import { Formik, Form } from "formik";
import { Box, Button, Flex, Heading, IconButton, Spinner } from "theme-ui";

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
} from "./styled";

import SearchField from "@/components/forms/SearchField";
import SelectInput from "@/components/forms/SelectInput";
import LoadingButton from "@/components/ui/LoadingButton";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "../Modal";
import { findInNestedArray, getNestedValue } from "@/helpers/default";

import { TiArrowSortedUp, TiArrowSortedDown, TiFilter } from "react-icons/ti";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";


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
  sx,
  searchStyles,
  defaultSortBy = "id",
  defaultSortDir = "asc",
  defaultPageSize = 15,
  pageSizes,
  enableSearch = true,
  enablePaging = true,
  enableFooter = false,
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
  isFixed?: boolean;
  pageSizes?: number[];
  forceQueryVariables?: object;
  sx?: any;
  returnData?: (e?: any) => void;
  returnQuery?: (e?: any) => void;
  onRowClick?: (e: React.MouseEvent<HTMLTableRowElement>, row: Row<any>) => void;
  endpoint?: string; // Add endpoint as a prop
}) => {
  const callApi = useRef(api);
  const callReturnData = useRef(returnData);
  const callReturnQuery = useRef(returnQuery);

  const loadTimer = useRef<any>(false);
  const filterFormRef = useRef<any>(false);
  const controller = useRef<any>(false);

  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [tableData, setTableData] = useState<any[]>([]);
  const [sorting, setSorting] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({ from: null, next: null, limit: defaultPageSize || 15});

  const [columnFilters, setColumnFilters] = useState<any>(preFilters || {});
  const [globalFilter, setGlobalFilter] = useState<any>(null);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const showRecordsOptions = useMemo(() =>
    pageSizes
      ? [...pageSizes.map((p) => ({ value: p, label: p })), { value: 1000, label: "All" }]
      : [
          { value: 1, label: 1 },
          { value: 15, label: 15 },
          { value: 50, label: 50 },
          { value: 100, label: 100 },
          { value: 1000, label: 1000 },
        ]
  ,[]);

  const fuzzyFilter = (row: any, columnId: any, value: any, addMeta: any) => {
    const itemRank = rankItem(row.getValue(columnId), value);
    addMeta({ itemRank });
    return itemRank.passed;
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
      globalFilter,
    },
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

      const key = pagination.from ? Object.keys(pagination.from)?.[0] : null;
      const from = pagination?.from?.[key ?? ""] || null;

      const query = {
        filters : {
          ...columnFilters,
          ...(forceQueryVariables || {}),
        },
        search: globalFilter || null,
        sortBy: sorting[0] ? (sorting[0]["id"] ? sorting[0]["id"] : defaultSortBy) : defaultSortBy || "id",
        sortDir: getSortDir(sorting, defaultSortDir),
        from: from ?? undefined,
        key: key ?? undefined,
        limit: pagination.limit || defaultPageSize || 15,
      };

      try {
        const apiCall = callApi.current;
        const res = await apiCall({ ...apiVariables, query, controller: controller.current, excludeInterceptor: true });
        if (res.items) {
          setTableData(res.items ? res.items : []);          
          setPagination((old: any) => ({...old, next: res.lastKey}));
        } else {
          if (Array.isArray(res)) {
            setTableData(res);
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
  }, [sorting, pagination.from, pagination.limit, globalFilter, columnFilters]);

  

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

  return (
    <>
      {title && <Heading as="h2" sx={{ marginBottom: "0" }}>{title}</Heading>}
      <TableTop>        
        {enablePaging &&
          <Pagination {...{ pagination, setPagination, showRecordsOptions }} />
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
                        <TiFilter fontSize={25} />
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
                        sx={{margin: "0!important",...searchStyles}}
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
      <TableWrapper sx={sx}>
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
                              <TiArrowSortedUp
                                color={"var(--theme-ui-colors-base_500)"}
                                fontSize="12px"                                
                              />
                            ),
                            desc: (
                              <TiArrowSortedDown
                                color={"var(--theme-ui-colors-base_500)"}
                                fontSize="12px"                                
                              />
                            ),
                          }[header?.column?.getIsSorted() as "asc" | "desc"] ?? (
                            <TiArrowSortedUp
                                color={"transparent"}
                                fontSize="12px"                                
                              />
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
                                <TiArrowSortedUp
                                  color={"var(--theme-ui-colors-base_500)"}
                                  fontSize="12px"                                
                                />
                              ),
                              desc: (
                                <TiArrowSortedDown
                                  color={"var(--theme-ui-colors-base_500)"}
                                  fontSize="12px"                                
                                />
                              ),
                            }[header?.column?.getIsSorted() as "asc" | "desc"] ?? (
                              <TiArrowSortedUp
                                color={"transparent"}
                                fontSize="12px"                                
                              />
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
        {enablePaging &&
          <Pagination {...{ pagination, setPagination, showRecordsOptions }} />
        }
      </TableBottom>
    </>
  );
};

export default TableData;

const Pagination = ({ pagination, setPagination, showRecordsOptions }: any) => {
  const [pageStack, setPageStack] = useState<any[]>([]);

  const goNext = () => {
    if (pagination.next) {
      setPageStack((prev: any) => [...prev, pagination.from]);
      setPagination((old: any) => ({...old, from: pagination.next }))
    }
  };

  const goPrevious = () => {
    if (pageStack.length > 0) {
      const prevStack = [...pageStack];
      const prevKey = prevStack.pop();
      setPageStack(prevStack);
      setPagination((old: any) => ({...old, from: prevKey }));
    }
  };

  return (
    <TablePagination>
      <TPdiv>
        <SelectInput
          name="pageSize"
          options={showRecordsOptions}
          value={pagination.limit || 15}
          onChange={(e: any) => setPagination((old: any) => ({...old, from: null, limit: e }))}
          sx={{ padding: 0, margin: "0!important", minWidth: "auto" }}
        />
      </TPdiv>
      <TPdiv>      
        <Button
          variant="white"
          onClick={goPrevious}
          disabled={!(pageStack.length > 0)}
        >
          <MdChevronLeft />
        </Button>
        <Button
          variant="white"
          onClick={goNext}
          disabled={!pagination.next}
        >
          <MdChevronRight />
        </Button>
      </TPdiv>    
    </TablePagination>
  )
};

