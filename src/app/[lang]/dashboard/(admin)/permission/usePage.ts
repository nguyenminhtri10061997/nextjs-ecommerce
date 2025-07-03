import { SelectChangeEvent } from "@mui/material";
import { EPermissionAction, EPermissionResource } from "@prisma/client";
import { useState } from "react";

export default function usePage() {
  const [action, setAction] = useState<EPermissionAction | 'all'>('all')
  const [resource, setResource] = useState<EPermissionResource | 'all'>('all')

  const handleChangeFilterAction = (event: SelectChangeEvent) => {
    setAction(event.target.value as EPermissionAction)
  }

  const handleChangeFilterResource = (event: SelectChangeEvent) => {
    setResource(event.target.value as EPermissionResource)
  }

  return {
    action,
    resource,
    handleChangeFilterAction,
    handleChangeFilterResource,
  };
}