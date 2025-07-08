import { Brand } from "@prisma/client";
import dayjs from "dayjs";
import React from "react";
import { useForm } from "react-hook-form";

export type TForm = Pick<Brand, "name" | "slug">;

type TProps = {
  setFile?: React.Dispatch<File | null>;
};

export default function useIndex(props: TProps) {
  const form = useForm<TForm>({
    mode: "onBlur",
  });

  const handleChangeFile = (file: File) => {
    const newFileName = `${file.name}-${dayjs().valueOf()}.${file.name.split('.').pop()}`;
    const renamedFile = new File([file], newFileName, { type: file.type })
    props.setFile?.(renamedFile);
  };

  const handleDeleteFile = () => {
    props.setFile?.(null);
  };

  return {
    form,
    handleChangeFile,
    handleDeleteFile,
  };
}
