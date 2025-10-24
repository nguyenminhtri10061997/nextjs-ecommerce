'use client';
import { useState } from "react";

export function useDashboardMenu() {
    const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

    const toggleSubmenu = (id: string) => {
        setOpenMap((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    return {
        openMap,
        toggleSubmenu
    }
}