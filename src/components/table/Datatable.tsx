"use client";

import type { ChangeEvent, CSSProperties } from "react";

import { forwardRef, useCallback, useImperativeHandle, useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableRow,
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  TableHead
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "use-debounce";

import CustomTextField from "@/@core/components/mui/TextField";
import axiosInstance from "@/client/axiosInstance";

export interface DatatableRef {
  reload: () => void;
}

export interface DatatableTableHeaders {
  name: string;
  orderable?: boolean;

  /**used for ordering data if this field is undefined, so the order automatically false, event you set as true */
  key?: string;
  style?: CSSProperties;
  className?: string;
  colSpan?: number;
  rowSpan?: number;
}

export interface DatatableProps {
  name: string;

  /** server action : if using server action, url must be undefined */
  action?: (params: any) => Promise<any>;

  /** url : if using url, action must be undefined */
  url?: string;

  /** additional params for server action except [page, limit, search] */
  params?: object;

  /**default [10, 25, 50] */
  rowsPerPages?: number[];
  tableHeaders: DatatableTableHeaders[] | DatatableTableHeaders[][];
  showSearch?: boolean;
  lengthChange?: boolean;
  pagination?: boolean;
  minWidth?: number;
  wrapperStyle?: CSSProperties;
  renderRows: (data: any) => JSX.Element[];
  tableFooter?: (data: any) => JSX.Element;

  /** default "No record found"*/
  noRecordMessage?: string;
}

type OrderBy = {
  key: string;
  order: "asc" | "desc";
};

const calculateColumnLength = (headers: DatatableTableHeaders[][]): number => {
  return Math.max(...headers.map((row) => row.reduce((total, cell) => total + (cell.colSpan || 1), 0)));
};

const Datatable = forwardRef((props: DatatableProps, ref: any) => {
  if (!props.url && !props.action) {
    throw new Error("You must specify either 'url' or 'action'.");
  }

  if (props.url && props.action) {
    throw new Error("You must use either 'url' or 'action', not both.");
  }

  const rowsPerPages = useMemo(() => props.rowsPerPages ?? [10, 25, 50], [props.rowsPerPages]);
  const [ordersBy, setOrdersBy] = useState<OrderBy[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(rowsPerPages[0]);
  const [search, setSearch] = useState("");
  const [columnLength, setColumnLength] = useState(1);
  const [debouncedSearch] = useDebounce(search, 500);

  const { data, isLoading, refetch } = useQuery({
    queryKey: [props.name, page, limit, debouncedSearch, ordersBy, props.params],
    queryFn: () => fetchData(),
    staleTime: 60_000,
    gcTime: 60_000
  });

  useImperativeHandle(ref, () => ({
    reload: refetch
  }));

  const fetchData = async () => {
    const order = ordersBy.map((item) => ({ [item.key]: item.order }));

    const params = {
      limit,
      search: debouncedSearch,
      orderBy: order,
      skip: (page - 1) * limit,
      ...props.params
    };

    if (props.action) {
      return await props.action(params);
    }

    if (props.url) {
      const response = await axiosInstance.get(props.url, { params });

      return response.data.data;
    }
  };

  const handleLimitChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLimit(parseInt(event.target.value, 10));
    setPage(1);
  };

  const rows = useMemo(() => (data ? props.renderRows(data) : [<></>]), [data, props]);
  const footer = useMemo(() => (data && props.tableFooter ? props.tableFooter(data) : <></>), [data, props]);

  const handleHeaderClick = useCallback(
    (header: DatatableTableHeaders) => {
      if (!header.orderable || !header.key) return;

      const existingOrder = ordersBy.find((e) => e.key === header.key);

      if (existingOrder) {
        const newOrder = existingOrder.order === "asc" ? "desc" : existingOrder.order === "desc" ? undefined : "asc";

        setOrdersBy(newOrder ? [{ key: header.key, order: newOrder }] : ordersBy.filter((e) => e.key !== header.key));
      } else {
        setOrdersBy([...ordersBy, { key: header.key, order: "asc" }]);
      }
    },
    [ordersBy]
  );

  const headers = useMemo(() => {
    const headerData = Array.isArray(props.tableHeaders[0])
      ? (props.tableHeaders as DatatableTableHeaders[][])
      : ([props.tableHeaders] as DatatableTableHeaders[][]);

    setColumnLength(calculateColumnLength(headerData));

    return headerData.map((headerRow, rowIndex) => (
      <TableRow key={rowIndex}>
        {headerRow.map((header, index) => {
          let orderByIcon = <></>;

          if (header.orderable && header.key) {
            const orderBy = ordersBy.find((e) => e.key === header.key);

            if (orderBy) {
              orderByIcon =
                orderBy.order === "asc" ? (
                  <i className='tabler-sort-descending-2'></i>
                ) : (
                  <i className='tabler-sort-ascending-2'></i>
                );
            }
          }

          return (
            <TableCell
              key={`header-${index}`}
              colSpan={header.colSpan ?? 1}
              rowSpan={header.rowSpan ?? 1}
              onClick={() => handleHeaderClick(header)}
              className={`${header.className} ${header.orderable ? "cursor-pointer" : ""}`}
              style={header.style}
              component='th'
            >
              <Grid container justifyContent='space-between'>
                <span style={{ flexGrow: 1 }}>{header.name}</span>
                {orderByIcon}
              </Grid>
            </TableCell>
          );
        })}
      </TableRow>
    ));
  }, [props.tableHeaders, ordersBy, handleHeaderClick]);

  return (
    <TableContainer style={props.wrapperStyle}>
      <Grid container className='justify-center sm:justify-between' gap={3} marginBottom={3}>
        {(props.lengthChange ?? true) && (
          <Grid display='flex' gap={2}>
            <div className='pt-2'>
              <span>Show</span>
            </div>
            <div>
              <CustomTextField select fullWidth value={limit} onChange={handleLimitChange}>
                {rowsPerPages.map((e) => (
                  <MenuItem key={`rpp-${e}`} value={e}>
                    {e}
                  </MenuItem>
                ))}
              </CustomTextField>
            </div>
            <div className='pt-2'>
              <span>entries</span>
            </div>
          </Grid>
        )}
        {(props.showSearch ?? true) && (
          <CustomTextField
            type='search'
            placeholder='Search'
            onChange={(e) => setSearch(e.target.value)}
            value={search}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <i className='tabler-search' />
                </InputAdornment>
              )
            }}
          />
        )}
      </Grid>

      <Grid container overflow='auto'>
        <Table sx={{ minWidth: props.minWidth ?? 200 }} aria-label='custom pagination table'>
          <TableHead>{headers}</TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell className='text-center' colSpan={columnLength}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : data && rows.length > 0 ? (
              rows
            ) : (
              <TableRow>
                <TableCell className='text-center' colSpan={columnLength}>
                  {props.noRecordMessage ?? "No record found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {footer && <TableFooter>{footer}</TableFooter>}
        </Table>
      </Grid>

      {(props.pagination ?? true) && (
        <Grid container gap={2} justifyContent='end' alignContent='center' className='my-3'>
          <Button
            className='p-2 min-w-7 w-7 h-7'
            size='small'
            variant='tonal'
            color='secondary'
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <i className='tabler-chevron-left'></i>
          </Button>
          <Button className='p-2 min-w-7 w-7 h-7' size='small' variant='contained' color='primary'>
            {page}
          </Button>
          <Button
            className='p-2 min-w-7 w-7 h-7'
            size='small'
            variant='tonal'
            color='secondary'
            disabled={rows.length < limit}
            onClick={() => setPage(page + 1)}
          >
            <i className='tabler-chevron-right'></i>
          </Button>
        </Grid>
      )}
    </TableContainer>
  );
});

export default Datatable;
