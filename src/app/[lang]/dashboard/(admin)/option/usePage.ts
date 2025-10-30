import { useAlertContext } from "@/components/hooks/useAlertContext";
import { TSelectedHash } from "@/components/hooks/useSelectTable";
import { queryClient } from "@/lib/queryClient";
import { optionKeys, deleteOptions } from "@/lib/reactQuery/option";
import { TAppResponseBody } from "@/types/api/common";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { DateRange } from "react-day-picker";

type TProps = {
  setSelectedHash: Dispatch<SetStateAction<TSelectedHash>>;
  setIsOpenConfirm: Dispatch<SetStateAction<boolean>>;
};

export default function usePage(props: TProps) {
  const { setIsOpenConfirm } = props;
  const { showAlert } = useAlertContext();
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const mutation = useMutation({
    mutationFn: deleteOptions,
    onSuccess: async (_, variable) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: optionKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: optionKeys.details() }),
      ]);
      setIsOpenConfirm(false);
      if (variable.length > 1) {
        props.setSelectedHash({});
      }
      showAlert("delete Option success");
    },
    onError: (err: AxiosError<TAppResponseBody>) => {
      const message = err.response?.data.message || err.message;
      setIsOpenConfirm(false);
      showAlert(message, "error");
    },
  });

  return {
    mutation,
    dateRange,
    setDateRange,
  };
}
