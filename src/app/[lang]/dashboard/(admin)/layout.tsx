"use client"
import { AppAppBar } from "@/components/customComponents/AppBar"
import { AppDrawerHeader } from "@/components/customComponents/AppDrawerHeader"
import AppLinkWithLoading from "@/components/customComponents/AppLinkIndicator"
import DashboardMenu from "@/components/customComponents/DashboardMenu"
import { AppMain } from "@/components/customComponents/Main"
import { useDashboardCtx } from "@/components/hooks/useDashboardCtx"
import { ADMIN_DRAWER_WIDTH } from "@/constants/dashBoardMenu"
import { Logout } from "@mui/icons-material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import LogoDevIcon from "@mui/icons-material/LogoDev"
import MenuIcon from "@mui/icons-material/Menu"
import { Drawer, ListItemIcon } from "@mui/material"
import Avatar from "@mui/material/Avatar"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import CircularProgress from "@mui/material/CircularProgress"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import Toolbar from "@mui/material/Toolbar"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import Link from "next/link"
import { useParams, useSelectedLayoutSegments } from "next/navigation"
import { useMemo } from "react"
import { z } from "zod/v4"
import useLayout from "./useLayout"

export default function Layout({ children }: { children: React.ReactNode }) {
  const params = useParams<{ lang: string }>()
  const segments = useSelectedLayoutSegments()
  const { dict } = useDashboardCtx()
  const {
    anchorElUser,
    isOpenDrawer,
    arrMenuRender,
    query,
    isPending,
    handleClickLogout,
    handleOpenUserMenu,
    handleCloseUserMenu,
    handleClickOpenDrawer,
    handleClickCloseDrawer,
    handleSetMode,
    mode,
  } = useLayout()

  const breadcrumbsRender = useMemo(() => {
    const segmentsLen = segments.length
    if (segmentsLen === 0) {
      return <Typography>DASHBOARD</Typography>
    }
    let segmentPre = `/${params.lang}/dashboard`

    const dashboardBreadcrumb = (
      <AppLinkWithLoading key={segmentPre} href={segmentPre}>
        DASHBOARD
      </AppLinkWithLoading>
    )

    return [dashboardBreadcrumb].concat(
      segments.map((segment, idx) => {
        const href = `${segmentPre}/${segment}`
        segmentPre = href

        const isLast = idx === segmentsLen - 1

        let label = segment.toUpperCase()
        const isUuid = z.uuid().safeParse(segment).success

        // Nếu là ID thì đổi label
        if (isUuid) {
          label = "EDIT"
        }

        if (isLast) {
          return <Typography key={href}>{label}</Typography>
        }
        return (
          <AppLinkWithLoading key={href} href={segmentPre}>
            {segment.toUpperCase()}
          </AppLinkWithLoading>
        )
      })
    )
  }, [segments, params.lang])

  if (query.isLoading) {
    return (
      <Backdrop open={true} sx={{ zIndex: 1600 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
    )
  }

  return (
    <Box sx={{ height: "100vh", display: "flex" }}>
      <AppAppBar position="fixed" open={isOpenDrawer}>
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
                    {isPending && <CircularProgress size={20} />}
                  </MenuItem>
                </Menu>
              </ListItem>
            </Stack>
          </Box>
        </Toolbar>
      </AppAppBar>
      <Drawer
        sx={{
          width: ADMIN_DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: ADMIN_DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={isOpenDrawer}
      >
        <AppDrawerHeader>
          <Link href={"/dashboard"} className="flex items-center grow-1 gap-4">
            <LogoDevIcon fontSize="large" />
            <Box>
              <Typography variant="h6">{dict.AppName}</Typography>
            </Box>
          </Link>
          <IconButton size="large" onClick={handleClickCloseDrawer}>
            <ChevronLeftIcon />
          </IconButton>
        </AppDrawerHeader>

        <DashboardMenu
          arrMenuRender={arrMenuRender}
          handleClickCloseDrawer={handleClickCloseDrawer}
        />
      </Drawer>
      <AppMain open={isOpenDrawer}>
        <AppDrawerHeader />
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbsRender}
        </Breadcrumbs>
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </AppMain>
    </Box>
  )
}
