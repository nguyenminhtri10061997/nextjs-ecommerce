import { AlertContext } from "@/contexts/alertContext";
import { useContext } from "react";

export const useAlertContext = () => {
    const context = useContext(AlertContext)
    if (!context) throw new Error('useAlertContext must be used within AlertProvider');
    return context;
}