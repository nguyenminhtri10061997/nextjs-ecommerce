import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow } from "@mui/material";

type TProps = {
  id: string | number;
  children: React.ReactNode
};

export default function AppSortableItem(props: TProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  console.log(style, props.id)

  return (
    <TableRow ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {props.children}
    </TableRow>
  );
}
