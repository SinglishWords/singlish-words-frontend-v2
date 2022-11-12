import { Button } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

type AppButtonProps = {
  name: string;
  buttonRef?: React.RefObject<HTMLButtonElement>;
};

export const AppButton = ({ name, buttonRef }: AppButtonProps) => {
  return (
    <Button variant="outlined" ref={buttonRef} sx={{ fontWeight: "bold" }}>
      {parse(DOMPurify.sanitize(name))}
    </Button>
  );
};
