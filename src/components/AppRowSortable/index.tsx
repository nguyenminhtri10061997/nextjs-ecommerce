import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconButton, TableCell, TableRow } from "@mui/material";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";

type TProps = {
  id: string | number;
  children: React.ReactNode;
};

export default function AppRowSortable(props: TProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <IconButton {...attributes} {...listeners}>
          <DragIndicatorIcon />
        </IconButton>
      </TableCell>
      {props.children}
    </TableRow>
  );
}
