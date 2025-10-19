import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  Menu,
  MenuItem,
  Select,
  TextField,
  Toolbar,
  Tooltip,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { DatePicker } from "@mui/x-date-pickers";
import { Dispatch, SetStateAction, useMemo } from "react";
import "react-day-picker/style.css";
import AppDateRangePicker from "../appDateRangePicker";
import {
  TOrderQuery,
  TPaginationParams,
  TPaginationResponse,
} from "@/types/api/common";
import { EFilterList, TColumn, TFilterList, TSearchOpt } from "./types";
import { TSelectedHash } from "@/hooks/useSelectTable";
import useIndex from "./useIndex";

export type TProps<T> = {
  hasSelect?: boolean;
  columns: TColumn<T>[];
  data: T[];
  pagination: TPaginationResponse;
  isStickyHeader?: boolean;
  selectedHash?: { [key: string]: boolean };
  isLoading?: boolean;
  rowsPerPageOptions?: ReadonlyArray<
    | number
    | {
        value: number;
        label: string;
      }
  >;
  orderQuery?: TOrderQuery;
  actions?: React.ReactNode;
  searchOpts?: TSearchOpt<keyof T>[];
  searchKey?: string;
  filterList?: TFilterList[];
  onClickRefresh: () => void;
  setSelectedHash?: Dispatch<SetStateAction<TSelectedHash>>;
  setSearchStr?: Dispatch<SetStateAction<string>>;
  setSearchKey?: Dispatch<SetStateAction<Partial<keyof T>>>;
  setOrderQuery?: Dispatch<SetStateAction<TOrderQuery<keyof T>>>;
  setPagination: Dispatch<SetStateAction<TPaginationParams>>;
};

const AppTable = <T extends object & { id: string }>(props: TProps<T>) => {
  const theme = useTheme();
  const {
    anchorElFilterList,
    isOpenMenuFilterList,
    filterListActive,
    handleToggleAllClick,
    handleChangeSearchStr,
    handleChangeSearchKey,
    handleChangePage,
    handleChangeRowPerPage,
    handleClickOrder,
    handleClickSelectRow,
    handleClickFilterListBtn,
    handleCloseMenuFilterList,
    handleClickToggleFilterList,
  } = useIndex<T>({
    defaultFilterList: props.filterList || [],
    data: props.data,
    selectedHash: props.selectedHash,
    orderQuery: props.orderQuery,
    pagination: props.pagination,
    setSelectedHash: props.setSelectedHash,
    setSearchStr: props.setSearchStr,
    setSearchKey: props.setSearchKey,
    setOrderQuery: props.setOrderQuery,
    setPagination: props.setPagination,
    isLoading: props.isLoading,
  });
  const {
    selectedHash = {},
    rowsPerPageOptions = [10, 25, 50],
    actions,
    isStickyHeader,
    data,
    columns,
    orderQuery,
    isLoading,
    pagination,
    hasSelect,
    onClickRefresh,
  } = props;

  const hasSearch = useMemo(
    () => !!props.searchOpts?.length,
    [props.searchOpts?.length]
  );

  const numSelected = Object.values(selectedHash).length;
  return (
    <Stack sx={{ height: "100%" }}>
      <Toolbar disableGutters>
        <Stack
          direction="row"
          alignItems="center"
          gap={2}
          flexGrow={1}
          flexWrap={"wrap"}
        >
          {hasSearch && (
            <Stack direction="row" alignItems="center" gap={2}>
              <TextField
                size="small"
                placeholder="Input search"
                sx={{ width: 200 }}
                onChange={handleChangeSearchStr}
              />
              <Select
                size="small"
                sx={{ width: 150 }}
                onChange={handleChangeSearchKey}
                value={props.searchKey}
              >
                {props.searchOpts?.map((s) => (
                  <MenuItem key={String(s.value)} value={String(s.value)}>
                    {s.label}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
          )}
          {props.filterList?.map((fl) => {
            if (!filterListActive.includes(fl.label)) {
              return null;
            }
            switch (fl.type) {
              case EFilterList.date:
                return <DatePicker key={fl.label} {...fl.componentProps} />;
              case EFilterList.dateRange:
                return (
                  <AppDateRangePicker key={fl.label} onChange={fl.onChange} />
                );

              case EFilterList.select:
                return (
                  <FormControl key={fl.label} sx={{ ml: 1 }}>
                    <InputLabel>{fl.label}</InputLabel>
                    <Select
                      value={fl.value}
                      label={fl.label}
                      onChange={fl.onChange}
                    >
                      <MenuItem value={"all"}>All {fl.label}</MenuItem>
                      {fl.options.map((o) => (
                        <MenuItem key={o.label} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                );
            }
          })}
        </Stack>
        <Stack direction="row" gap={1} alignItems="center">
          {actions}
          {onClickRefresh && (
            <Tooltip title="Refresh Table">
              <IconButton onClick={onClickRefresh}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          )}
          {props.filterList?.length && (
            <>
              <Tooltip title="Filter list">
                <IconButton onClick={handleClickFilterListBtn}>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElFilterList}
                open={isOpenMenuFilterList}
                onClose={handleCloseMenuFilterList}
                slotProps={{
                  list: {
                    "aria-labelledby": "basic-button",
                  },
                }}
              >
                {props.filterList.map((i) => (
                  <ListItem
                    key={i.label}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={handleClickToggleFilterList(i.label)}
                        checked={filterListActive.includes(i.label)}
                      />
                    }
                  >
                    {i.label}
                  </ListItem>
                ))}
              </Menu>
            </>
          )}
        </Stack>
      </Toolbar>
      <TableContainer
        sx={{
          flexGrow: 1,
        }}
      >
        <Table stickyHeader={!!isStickyHeader} aria-label="sticky table">
          <TableHead>
            <TableRow>
              {hasSelect && (
                <TableCell padding="checkbox">
                  <Checkbox
                    color="primary"
                    indeterminate={numSelected > 0 && numSelected < data.length}
                    checked={numSelected > 0 && numSelected >= data.length}
                    onClick={handleToggleAllClick}
                  />
                </TableCell>
              )}
              {columns.map((col) => {
                if (col.key === "actionColumn") {
                  return (
                    <TableCell
                      key={String(col.key)}
                      sx={{
                        right: 0,
                        backgroundColor: theme.vars?.palette.background.default,
                        borderLeft: `1px solid ${theme.vars?.palette?.TableCell?.border}`,
                        minWidth: col.minWidth,
                        width: col.width,
                      }}
                    >
                      {col.header}
                    </TableCell>
                  );
                }

                return (
                  <TableCell
                    key={String(col.key)}
                    sx={{
                      minWidth: col.minWidth,
                    }}
                  >
                    {col.canSort ? (
                      <TableSortLabel
                        active={orderQuery?.orderKey === col.key}
                        direction={orderQuery?.orderType}
                        onClick={() => handleClickOrder?.(col.key as keyof T)}
                      >
                        {col.header}
                      </TableSortLabel>
                    ) : (
                      col.header
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 && !isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  No data found
                </TableCell>
              </TableRow>
            )}
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} align="center">
                  <CircularProgress />
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              data.map((row) => {
                const isItemSelected = !!selectedHash[row.id];
                return (
                  <TableRow hover key={row.id} selected={isItemSelected}>
                    {hasSelect && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onClick={handleClickSelectRow(row.id)}
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => {
                      if (col.key === "actionColumn") {
                        return (
                          <TableCell
                            key={String(col.key)}
                            sx={{
                              position: "sticky",
                              right: 0,
                              backgroundColor:
                                theme.vars?.palette.background.default,
                              borderLeft: `1px solid ${theme.vars?.palette?.TableCell?.border}`,
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {col.render?.(row[col.key as keyof T], row)}
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={String(col.key)}>
                          {col.render
                            ? col.render(row[col.key], row)
                            : String(row[col.key] || "")}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        sx={{
          flexShrink: 0,
        }}
        component="div"
        count={pagination.count}
        page={pagination.currentPage}
        rowsPerPageOptions={rowsPerPageOptions}
        rowsPerPage={pagination.pageSize}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowPerPage}
      />
    </Stack>
  );
};

export default AppTable;
