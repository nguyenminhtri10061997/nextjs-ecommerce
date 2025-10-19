"use client";

import AppConfirmDialog from "@/components/customComponents/appConfirmDialog";
import useAppConfirmDialog from "@/components/customComponents/appConfirmDialog/useAppConfirmDialog";
import AppTable, { TColumn } from "@/components/customComponents/appTable";
import LinkLoadingIndicator from "@/components/LinkLoadingIndicator";
import { useAlertContext } from "@/hooks/useAlertContext";
import usePaginationAndSort from "@/hooks/usePaginationAndSort";
import useSearch from "@/hooks/useSearch";
import useSelectTable from "@/hooks/useSelectTable";
import useTableDeleteRow from "@/hooks/useTableDeleteRow";
import { useGetAttributeListQuery } from "@/lib/reactQuery/attribute";
import { ESearchType } from "@/common/zod/paginationDTO";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Badge } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Attribute } from "@prisma/client";
import { UseMutationResult } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import usePage from "./usePage";

export default function User() {
  const { showAlert } = useAlertContext();
  const { selectedHash, selectedLength, setSelectedHash } = useSelectTable();
  const { pagination, orderQuery, setPagination, setOrderQuery } =
    usePaginationAndSort<keyof Attribute>({
      defaultOrder: {
        orderKey: "createdAt",
        orderType: "desc",
      },
    });
  const { searchKey, searchStr, searchType, setSearchKey, setSearchStr } =
    useSearch<keyof Attribute>({
      defaultSearchKey: "name",
      searchType: ESearchType.contains,
    });

  const { isOpenConfirm, setIsOpenConfirm } = useAppConfirmDialog();

  const { mutation } = usePage({ setSelectedHash, setIsOpenConfirm });
  const {
    isOkMany,
    handleCancelConfirm,
    handleClickDeleteRow,
    handleOkConfirm,
    handleClickDeleteMany,
  } = useTableDeleteRow({
    mutation: mutation as UseMutationResult,
    selectedHash,
    setIsOpenConfirm,
  });

  const query = useGetAttributeListQuery({
    orderQuery: {
      orderKey: orderQuery.orderKey!,
      orderType: orderQuery.orderType!,
    },
    searchQuery: {
      searchKey,
      searchStr,
      searchType,
    },
  });

  const columns: TColumn<Attribute>[] = useMemo(
    () => [
      {
        key: "name",
        header: "Full Name",
      },
      {
        key: "slug",
        header: "Description",
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
              <Link href={`attribute/${row.id}`}>
                <LinkLoadingIndicator />
                <IconButton>
                  <EditIcon color="primary" />
                </IconButton>
              </Link>
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
        height: "100%",
      }}
    >
      <Box sx={{ flexShrink: 0 }}>
        <Typography variant="h4">Attribute Page</Typography>
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
            count: query.data?.length || 0,
          }}
          selectedHash={selectedHash}
          data={query.data || []}
          orderQuery={orderQuery}
          actions={
            <Stack direction="row" alignItems="center" spacing={2}>
              <Link href="attribute/create">
                <LinkLoadingIndicator />
                <Button variant="contained" endIcon={<AddIcon />}>
                  Create
                </Button>
              </Link>

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
              label: "Name",
              value: "name",
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
