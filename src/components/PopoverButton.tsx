import { useState } from "react";

import { Button, Popover, Stack, Typography } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

type PopoverProps = {
  name: string;
  description: string;
};

export const PopoverButton = ({ name, description }: PopoverProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Stack>
      <Button
        variant="outlined"
        onClick={handleClick}
        sx={{ fontWeight: "bold" }}
      >
        {parse(DOMPurify.sanitize(name))}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        disableAutoFocus={true}
      >
        <Typography variant="body2" sx={{ p: 3, maxWidth: 400 }}>
          {parse(DOMPurify.sanitize(description))}
        </Typography>
      </Popover>
    </Stack>
  );
};
