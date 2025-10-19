import { APIEndpoint } from "@/app/api/apiEndpoint";
import { DASHBOARD_MENU_ITEMS } from "@/constants/dashBoardMenu";
import { useAlertContext } from "@/hooks/useAlertContext";
import { withRequestHandler } from "@/constants/HOF/withRequestHandler";
import { useMeQuery } from "@/lib/reactQuery/me";
import { PaletteMode, useColorScheme } from "@mui/material/styles";
import axios from "axios";
import { redirect } from "next/navigation";
import React, { useMemo, useState } from "react";

export default function useLayout() {
  const { showAlert } = useAlertContext();
  const { mode, setMode } = useColorScheme();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const query = useMeQuery()

  const handleClickLogout = async () => {
    const res = await withRequestHandler(axios.post(APIEndpoint.POST_LOG_OUT));
    if (res.error) {
      showAlert("Đăng xuất thất bại", "error");
    }
    redirect("/dashboard/login");
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleClickOpenDrawer = () => {
    setIsOpenDrawer(true);
  };

  const handleClickCloseDrawer = () => {
    setIsOpenDrawer(false);
  };

  const arrMenuRender = useMemo(() => {
    if (!query.data?.role?.id) {
      return [];
    }

    return DASHBOARD_MENU_ITEMS.filter((m) => {
      if (m.children) {
        return m.children.some(
          (i) =>
            i.perResource &&
            i.perAction &&
            query.data.role.permissions?.[i.perResource]?.includes(i.perAction)
        );
      }
      return (
        m.perResource &&
        m.perAction &&
        query.data.role.permissions?.[m.perResource]?.includes(m.perAction)
      );
    });
  }, [query.data?.role?.id, query.data?.role?.permissions]);

  const handleSetMode = (IMode: PaletteMode) => () => {
    setMode(IMode)
  }

  return {
    anchorElUser,
    isOpenDrawer,
    arrMenuRender,
    query,
    mode,
    handleSetMode,
    handleClickLogout,
    handleOpenUserMenu,
    handleCloseUserMenu,
    handleClickCloseDrawer,
    handleClickOpenDrawer,
  };
}
