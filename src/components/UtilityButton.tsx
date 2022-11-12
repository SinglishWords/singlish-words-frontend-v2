import { ButtonProps, IconButton, Tooltip } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

type UtilityButtonProps = ButtonProps & {
  title: string;
  Icon: SvgIconComponent;
};

export const UtilityButton = ({ title, Icon, ...rest }: UtilityButtonProps) => {
  return (
    <Tooltip title={title}>
      <IconButton
        {...rest}
        sx={{
          color: "primary.main",
          borderRadius: 0,
          width: "60px",
          "&:hover": { color: "secondary.main" },
        }}
      >
        <Icon />
      </IconButton>
    </Tooltip>
  );
};
