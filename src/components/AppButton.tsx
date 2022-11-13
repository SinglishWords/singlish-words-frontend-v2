import { Button, ButtonProps } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

type AppButtonProps = ButtonProps & {
  name: string;
  buttonRef?: React.RefObject<HTMLButtonElement>;
};

export const AppButton = ({ name, buttonRef, ...rest }: AppButtonProps) => {
  return (
    <Button
      variant="contained"
      ref={buttonRef}
      sx={{ fontWeight: "bold" }}
      {...rest}
    >
      {parse(DOMPurify.sanitize(name))}
    </Button>
  );
};
