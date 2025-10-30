"use client";

import AppConfirmDialog from "@/components/customComponents/AppConfirmDialog";
import AppLinkWithLoading from "@/components/customComponents/AppLinkIndicator";
import AppTable from "@/components/customComponents/AppTable";
import { EFilterList, TColumn } from "@/components/customComponents/AppTable/types";
import { useAlertContext } from "@/components/hooks/useAlertContext";
import usePaginationAndSort from "@/components/hooks/usePaginationAndSort";
import useSearch from "@/components/hooks/useSearch";
import useSelectTable from "@/components/hooks/useSelectTable";
import useTableDeleteRow from "@/components/hooks/useTableDeleteRow";
import { useGetUserListQuery } from "@/lib/reactQuery/user";
import { ESearchType } from "@/lib/zod/paginationDTO";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Badge } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { User as UserEntity } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import usePage from "./usePage";

export default function User() {
  const { showAlert } = useAlertContext();
  const { selectedHash, selectedLength, setSelectedHash } = useSelectTable();
  const { pagination, orderQuery, setPagination, setOrderQuery } =
    usePaginationAndSort<keyof UserEntity>({
      defaultOrder: {
        orderKey: "createdAt",
        orderType: "desc",
      },
    });
  const { searchKey, searchStr, searchType, setSearchKey, setSearchStr } =
    useSearch<keyof UserEntity>({
      defaultSearchKey: "fullName",
      searchType: ESearchType.contains,
    });

  const [isOpenConfirm, setIsOpenConfirm] = useState(false);

  const {
    mutation,
    dateRange,
    setDateRange,
  } = usePage({ setSelectedHash, setIsOpenConfirm });

  const {
    isOkMany,
    handleCancelConfirm,
    handleClickDeleteMany,
    handleClickDeleteRow,
    handleOkConfirm,
  } = useTableDeleteRow({
    mutation: mutation as UseMutationResult,
    selectedHash,
    setIsOpenConfirm,
  })

  const query = useGetUserListQuery({
    pagination: pagination,
    orderQuery: {
      orderKey: orderQuery.orderKey!,
      orderType: orderQuery.orderType!,
    },
    searchQuery: {
      searchKey,
      searchStr,
      searchType,
    },
    dateRangeQuery:
      dateRange?.from && dateRange.to
        ? {
          startDate: dateRange.from,
          endDate: dateRange.to,
        }
        : undefined,
  });

  const columns: TColumn<UserEntity>[] = useMemo(
    () => [
      {
        key: "fullName",
        header: "Full Name",
      },
      {
        key: "type",
        header: "Type",
      },
      {
        key: "createdAt",
        header: "Created At",
        canSort: true,
        render: (val) => dayjs(val).format("YYYY/MM/DD hh:mm:ss"),
      },
      {
        key: "updatedAt",
        header: "Updated At",
        canSort: true,
        render: (val) => dayjs(val).format("YYYY/MM/DD hh:mm:ss"),
      },
      {
        key: "actionColumn",
        header: "Action",
        width: 100,
        render: (_, row) => {
          return (
            <Stack direction="row">
              <AppLinkWithLoading href={`user/${row.id}`}>
                <IconButton>
                  <EditIcon color="primary" />
                </IconButton>
              </AppLinkWithLoading>
              <IconButton onClick={handleClickDeleteRow(row.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            </Stack>
          );
        },
      },
    ],
    [handleClickDeleteRow]
  );

  useEffect(() => {
    if (query.isError) {
      showAlert(query.error?.message || "Error get list", "error");
    }
  }, [query.error?.message, query.isError, showAlert]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
        height: '100%',
      }}
    >
      <Box>
        <Typography variant="h4">User Page</Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
        }}
      >
        <AppTable
          hasSelect
          onClickRefresh={query.refetch}
          isLoading={query.isLoading || query.isRefetching}
          isStickyHeader
          columns={columns}
          pagination={{
            ...pagination,
            count: query.data?.pagination.count || 0,
          }}
          selectedHash={selectedHash}
          data={query.data?.data || []}
          orderQuery={orderQuery}
          actions={
            <Stack direction="row" alignItems="center" spacing={2}>
              <AppLinkWithLoading href="user/create">
                <Button variant="contained" endIcon={<AddIcon />}>
                  Create
                </Button>
              </AppLinkWithLoading>
              <Badge badgeContent={selectedLength} color="warning">
                <Button
                  disabled={!selectedLength}
                  color="error"
                  variant="contained"
                  onClick={handleClickDeleteMany}
                >
                  Delete
                </Button>
              </Badge>
            </Stack>
          }
          searchKey={searchKey}
          searchOpts={[
            {
              label: "Fullname",
              value: "fullName",
            },
          ]}
          filterList={[
            {
              type: EFilterList.dateRange,
              label: "Date",
              onChange: (date) => {
                setDateRange(date);
              },
            },
          ]}
          setOrderQuery={setOrderQuery}
          setPagination={setPagination}
          setSearchKey={setSearchKey}
          setSearchStr={setSearchStr}
          setSelectedHash={setSelectedHash}
        />
      </Box>
      <AppConfirmDialog
        isOpen={isOpenConfirm}
        onOk={handleOkConfirm}
        onCancel={handleCancelConfirm}
        isLoading={mutation.isPending}
        isOkMany={isOkMany}
      />
    </Box>
  );
}
