"use client"
import AppLinkWithLoading from "@/components/customComponents/AppLinkIndicator"
import DashboardMenu from "@/components/customComponents/DashboardMenu"
import { useDashboardCtx } from "@/components/hooks/useDashboardCtx"
import { ADMIN_DRAWER_WIDTH } from "@/constants/dashBoardMenu"
import { Logout } from "@mui/icons-material"
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LightModeIcon from "@mui/icons-material/LightMode"
import LogoDevIcon from "@mui/icons-material/LogoDev"
import MenuIcon from "@mui/icons-material/Menu"
import { ListItemIcon } from "@mui/material"
import AppBar from "@mui/material/AppBar"
import Avatar from "@mui/material/Avatar"
import Backdrop from "@mui/material/Backdrop"
import Box from "@mui/material/Box"
import Breadcrumbs from "@mui/material/Breadcrumbs"
import CircularProgress from "@mui/material/CircularProgress"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import Stack from "@mui/material/Stack"
import { useTheme } from "@mui/material/styles"
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

  const theme = useTheme()
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
    <Box sx={{ height: "100vh" }}>
      <Drawer variant="persistent" anchor="left" open={isOpenDrawer}>
        <Box sx={{ width: 250 }}>
          <Toolbar sx={{ gap: 2 }}>
            <Link
              href={"/dashboard"}
              className="flex items-center grow-1 gap-4"
            >
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
          <DashboardMenu
            arrMenuRender={arrMenuRender}
            handleClickCloseDrawer={handleClickCloseDrawer}
          />
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
                      {isPending && <CircularProgress size={20} />}
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
    </Box>
  )
}
