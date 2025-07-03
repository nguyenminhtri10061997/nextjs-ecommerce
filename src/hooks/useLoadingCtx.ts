import { LoadingCtx } from "@/contexts/loadingCtx";
import { useContext } from "react";

export const useLoadingCtx = () => {
    const context = useContext(LoadingCtx)
    if (!context) throw new Error('useLoadingCtx must be used within LoadingProvider');
    return context;
}