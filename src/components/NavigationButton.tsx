import { useMemo } from "react";
import {
  ListItemButton,
  ListItemButtonProps,
  ListItemText,
} from "@mui/material";

type NavigationButtonProps = ListItemButtonProps & {
  buttonDescription: string;
};

export const NavigationButton = ({
  buttonDescription,
  selected,
}: NavigationButtonProps) => {
  const color = useMemo(
    () => (selected ? "secondary.main" : "white"),
    [selected]
  );

  return (
    <ListItemButton>
      <ListItemText
        sx={{
          color,
          "& .MuiTypography-root": {
            fontWeight: "bold",
          },
        }}
        primary={buttonDescription}
      />
    </ListItemButton>
  );
};
