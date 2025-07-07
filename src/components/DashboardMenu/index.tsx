'use client';
import { TDashBoardMenuItem } from "@/constants/dashBoardMenu";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Collapse from "@mui/material/Collapse";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Link from "next/link";
import React, { useEffect } from "react";
import LinkLoadingIndicator from "../LinkLoadingIndicator";
import { useDashboardMenu } from "./useDashboardMenu";
import { usePathname } from "next/navigation";

type TProps = {
    arrMenuRender: TDashBoardMenuItem[]
}

const DashboardMenu = (props: TProps) => {
    const { arrMenuRender = [] } = props
    const { openMap, toggleSubmenu, } = useDashboardMenu()
    const pathname = usePathname()
    const hasSetDefault = React.useRef(false);

    const pathnameCompare = pathname.substring(6)
    useEffect(() => {
        if (hasSetDefault.current) return;
        const found = arrMenuRender.find(i => i.children?.some(c => c.to === pathnameCompare));
        if (found) {
            toggleSubmenu(found.label);
            hasSetDefault.current = true;
        }

    }, [pathname, arrMenuRender])

    return (
        <List>
            {arrMenuRender.map(m => {
                if (!m.children?.length) {
                    return (
                        <Link key={m.label} href={m.to || ""}>
                            <ListItemButton onClick={() => toggleSubmenu(m.label)}>
                                <ListItemIcon>
                                    {m.icon}
                                </ListItemIcon>
                                <ListItemText primary={m.label} />
                                {m.children ? (openMap[m.label] ? <ExpandLessIcon /> : <ExpandMoreIcon />) : null}
                            </ListItemButton>
                            <LinkLoadingIndicator />
                        </Link>
                    )
                }
                return (
                    <React.Fragment key={m.label}>
                        <ListItemButton onClick={() => toggleSubmenu(m.label)}>
                            <ListItemIcon>
                                {m.icon}
                            </ListItemIcon>
                            <ListItemText primary={m.label} />
                            {m.children ? (openMap[m.label] ? <ExpandLessIcon /> : <ExpandMoreIcon />) : null}
                        </ListItemButton>
                        <Collapse in={!!openMap[m.label]} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding sx={{ ml: 2 }}>
                                {m.children.map(child => (
                                    <Link href={child.to || ""} key={child.label}>
                                        <LinkLoadingIndicator />
                                        <ListItemButton key={child.label} selected={child.to === pathnameCompare}>
                                            <ListItemIcon>
                                                {child.icon}
                                            </ListItemIcon>
                                            <ListItemText primary={child.label} />
                                        </ListItemButton>
                                    </Link>
                                ))}
                            </List>
                        </Collapse>
                    </React.Fragment>
                )
            })}
        </List>
    );
}
export default DashboardMenu