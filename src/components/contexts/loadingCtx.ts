import { createContext, Dispatch, SetStateAction } from "react";

type TLoadingCtx = {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
} | null;

export const LoadingCtx =
  createContext<TLoadingCtx>(null);
