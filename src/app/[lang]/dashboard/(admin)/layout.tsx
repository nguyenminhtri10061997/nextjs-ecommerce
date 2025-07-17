"use client";
import DashboardMenu from "@/components/DashboardMenu";
import LinkLoadingIndicator from "@/components/LinkLoadingIndicator";
import { ADMIN_DRAWER_WIDTH } from "@/constants/dashBoardMenu";
import { useDashboardCtx } from "@/hooks/useDashboardCtx";
import { useLoadingCtx } from "@/hooks/useLoadingCtx";
import { Logout } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import LogoDevIcon from "@mui/icons-material/LogoDev";
import MenuIcon from "@mui/icons-material/Menu";
import { ListItemIcon } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import { useEffect, useMemo } from "react";
import useLayout from "./useLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { breadcrumbs } = useDashboardCtx();
  const { dict } = useDashboardCtx();

  const theme = useTheme();
  const {
    anchorElUser,
    isOpenDrawer,
    arrMenuRender,
    query,
    handleClickLogout,
    handleOpenUserMenu,
    handleCloseUserMenu,
    handleClickOpenDrawer,
    handleClickCloseDrawer,
    handleSetMode,
    mode,
  } = useLayout();
  const { loading, setLoading } = useLoadingCtx();

  const breadcrumbsRender = useMemo(() => {
    return breadcrumbs?.map((segment, idx) => {
      const href = "/" + breadcrumbs.slice(0, idx + 1).join("/");

      if (idx === breadcrumbs.length - 1) {
        return <Typography key={href}>{segment.toUpperCase()}</Typography>;
      }

      return (
        <Link key={href} href={href}>
          <LinkLoadingIndicator />
          {segment.toUpperCase()}
        </Link>
      );
    });
  }, [breadcrumbs]);

  useEffect(() => {
    if (loading !== query.isLoading) {
      setLoading(query.isLoading);
    }
  }, [query.isLoading, loading, setLoading]);

  return (
    <Box sx={{ height: "100vh" }}>
      <Drawer variant="persistent" anchor="left" open={isOpenDrawer}>
        <Box sx={{ width: 250 }}>
          <Toolbar sx={{ gap: 2 }}>
            <Link
              href={"/dashboard"}
              className="flex items-center grow-1 gap-4"
            >
              <LinkLoadingIndicator />
              <LogoDevIcon fontSize="large" />
              <Box>
                <Typography variant="h6">{dict.AppName}</Typography>
              </Box>
            </Link>
            <IconButton size="large" onClick={handleClickCloseDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          ></Box>
          <Divider />
          <DashboardMenu arrMenuRender={arrMenuRender} />
        </Box>
      </Drawer>
      <Box
        sx={[
          {
            width: isOpenDrawer
              ? `calc(100% - ${ADMIN_DRAWER_WIDTH}px)`
              : "100%",
            transition: theme.transitions.create("width", {
              duration: theme.transitions.duration.standard,
              easing: theme.transitions.easing.easeInOut,
            }),
            display: "flex",
            flexDirection: "column",
            float: "right",
            height: "100%",
          },
        ]}
      >
        <AppBar position="sticky">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleClickOpenDrawer}
              edge="start"
              sx={[isOpenDrawer && { display: "none" }]}
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                flexGrow: 1,
              }}
            ></Box>
            <Box>
              <Stack direction="row">
                <ListItem>
                  {mode === "light" ? (
                    <ListItemButton onClick={handleSetMode("dark")}>
                      <DarkModeIcon />
                    </ListItemButton>
                  ) : (
                    <ListItemButton onClick={handleSetMode("light")}>
                      <LightModeIcon />
                    </ListItemButton>
                  )}
                </ListItem>
                <ListItem>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                      <Avatar
                        alt={query.data?.account.username}
                        src="/static/images/avatar/2.jpg"
                      />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorElUser}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                  >
                    <MenuItem onClick={handleClickLogout}>
                      <ListItemIcon>
                        <Logout fontSize="small" />
                      </ListItemIcon>
                      Logout
                    </MenuItem>
                  </Menu>
                </ListItem>
              </Stack>
            </Box>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{ m: 2, flexGrow: 1, display: "flex", flexDirection: "column" }}
        >
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {breadcrumbsRender}
          </Breadcrumbs>
          <Box sx={{ flexGrow: 1 }}>{children}</Box>
        </Box>
      </Box>
      {query.isPending && !loading && (
        <Backdrop open sx={{ zIndex: 1600 }}>
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Box>
  );
}
