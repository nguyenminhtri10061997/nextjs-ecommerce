"use client";
import { useGetPermissionList } from "@/lib/reactQuery/permission";
import { EPermissionAction, EPermissionResource, Role } from "@prisma/client";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

export type Inputs = Pick<Role, "name" | "description"> & {
  permissionIds: string[];
};

export default function Page() {
  const form = useForm<Inputs>({
    mode: "onBlur",
  });

  const queryPermissions = useGetPermissionList({
    orderQuery: {
      orderKey: "resource",
      orderType: "asc",
    },
  });

  const tableData = useMemo(() => {
    const res: {
      [key in EPermissionResource]?: { [key2 in EPermissionAction]?: string };
    } = {};
    if (queryPermissions.isSuccess) {
      queryPermissions.data.data.forEach((per) => {
        if (!res[per.resource]) {
          res[per.resource] = {};
        }
        res[per.resource]![per.action] = per.id;
      });
    }
    return res;
  }, [queryPermissions.data, queryPermissions.isSuccess]);

  return {
    form,
    queryPermissions,
    tableData,
  };
}
