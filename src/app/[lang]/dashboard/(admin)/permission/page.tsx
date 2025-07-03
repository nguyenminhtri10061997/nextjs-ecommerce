"use client";

import AppTable, { EFilterList, TColumn } from "@/components/AppTable";
import { useAlertContext } from "@/hooks/useAlertContext";
import usePaginationAndSort from "@/hooks/usePaginationAndSort";
import { useGetPermissionList } from "@/lib/reactQuery/permission";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { EPermissionAction, EPermissionResource, Permission } from "@prisma/client";
import { useEffect, useMemo } from "react";
import usePage from "./usePage";

export default function User() {
  const { showAlert } = useAlertContext();
  const { pagination, setPagination } =
    usePaginationAndSort<keyof Permission>({
      defaultOrder: {
        orderKey: "createdAt",
        orderType: "desc",
      },
    });

  const {
    action,
    resource,
    handleChangeFilterAction,
    handleChangeFilterResource,
  } = usePage()

  const query = useGetPermissionList({
    pagination: pagination,
    action: action === 'all' ? undefined : action,
    resource: resource === 'all' ? undefined : resource,
  });

  const columns: TColumn<Permission>[] = useMemo(
    () => [
      {
        key: "resource",
        header: "Resource",
      },
      {
        key: "action",
        header: "Action",
      },
    ],
    []
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
        <Typography variant="h4">Permission Page</Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          maxHeight: "75vh",
        }}
      >
        <AppTable
          onClickRefresh={query.refetch}
          isLoading={query.isLoading}
          isStickyHeader
          columns={columns}
          pagination={{
            ...pagination,
            count: query.data?.pagination.count || 0,
          }}
          data={query.data?.data || []}
          setPagination={setPagination}
          filterList={[
            {
              label: 'Resource',
              value: resource,
              type: EFilterList.select,
              options: Object.values(EPermissionResource).map(i => ({
                label: i,
                value: i,
              })),
              defaultShow: true,
              onChange: handleChangeFilterResource
            },
            {
              label: 'Action',
              value: action,
              type: EFilterList.select,
              options: Object.values(EPermissionAction).map(i => ({
                label: i,
                value: i,
              })),
              defaultShow: true,
              onChange: handleChangeFilterAction
            }
          ]}
        />
      </Box>
    </Box>
  );
}
