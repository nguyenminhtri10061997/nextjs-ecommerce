import { useAlertContext } from "@/hooks/useAlertContext";
import { TSelectedHash } from "@/hooks/useSelectTable";
import { queryClient } from "@/lib/queryClient";
import { languageKeys, deleteLanguages } from "@/lib/reactQuery/language";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction } from "react";

type TProps = {
  setSelectedHash: Dispatch<SetStateAction<TSelectedHash>>;
  setIsOpenConfirm: Dispatch<SetStateAction<boolean>>;
};

export default function usePage(props: TProps) {
  const { setIsOpenConfirm } = props;
  const { showAlert } = useAlertContext();

  const mutation = useMutation({
    mutationFn: deleteLanguages,
    onSuccess: async (_, variable) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: languageKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: languageKeys.details() }),
      ]);
      setIsOpenConfirm(false);
      if (variable.length > 1) {
        props.setSelectedHash({});
      }
      showAlert("Delete success");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      setIsOpenConfirm(false);
      showAlert(message, "error");
    },
  });

  return {
    mutation,
  };
}
