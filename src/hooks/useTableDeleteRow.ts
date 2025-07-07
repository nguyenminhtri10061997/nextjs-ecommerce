import { TSelectedHash } from "@/hooks/useSelectTable";
import { UseMutationResult } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useCallback, useRef } from "react";

type TProps = {
  selectedHash?: TSelectedHash;
  mutation: UseMutationResult;
  setIsOpenConfirm: Dispatch<SetStateAction<boolean>>;
};

export default function useTableDeleteRow(props: TProps) {
  const { mutation, setIsOpenConfirm } = props;
  const idDeleteOne = useRef<string>("");
  const isOkMany = useRef<boolean>(false);

  const handleClickDeleteRow = useCallback(
    (id: string) => () => {
      isOkMany.current = false;
      idDeleteOne.current = id;
      setIsOpenConfirm(true);
    },
    [setIsOpenConfirm]
  );

  const handleOkConfirm = () => {
    let ids = [];
    if (isOkMany.current) {
      ids = Object.keys(props.selectedHash || {});
    } else {
      ids = [idDeleteOne.current];
    }
    mutation.mutate(ids);
  };

  const handleCancelConfirm = () => {
    setIsOpenConfirm(false);
    idDeleteOne.current = "";
    isOkMany.current = false;
  };

  const handleClickDeleteMany = () => {
    isOkMany.current = true;
    setIsOpenConfirm(true);
  };

  return {
    isOkMany,
    handleClickDeleteRow,
    handleOkConfirm,
    handleCancelConfirm,
    handleClickDeleteMany,
  };
}
