import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, Stack, useTheme } from "@mui/material";
import React from "react";

type TProps = {
  id: string | number;
  children: React.ReactNode;
};

export default function AppSortableItem(props: TProps) {
  const theme = useTheme();
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Stack
      ref={setNodeRef}
      style={style}
      direction="row"
      alignItems={"flex-start"}
      gap={2}
      py={1}
    >
      <Box
        {...attributes}
        {...listeners}
        sx={{
          ":hover": {
            backgroundColor: theme.vars?.palette.Button.inheritContainedHoverBg,
          },
          marginTop: theme.vars?.spacing,
          padding: 1,
          flexShrink: 0,
          cursor: "pointer",
        }}
      >
        <DragIndicatorIcon color="info" />
      </Box>
      {props.children}
    </Stack>
  );
}
