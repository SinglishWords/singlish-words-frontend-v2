import { Button } from "@mui/material";
import DOMPurify from "dompurify";
import parse from "html-react-parser";

type AppButtonProps = {
  name: string;
};

export const AppButton = ({ name }: AppButtonProps) => {
  return (
    <Button variant="outlined" sx={{ fontWeight: "bold" }}>
      {parse(DOMPurify.sanitize(name))}
    </Button>
  );
};
