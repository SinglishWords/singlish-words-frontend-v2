import { Outlet } from "react-router-dom";
import { Stack } from "@mui/material";
import { NavigationBar } from "src/components/NavigationBar";

export const TopbarLayout = () => {
  return (
    <Stack spacing={{ xs: 3, sm: 8 }}>
      <NavigationBar />
      <Outlet />
    </Stack>
  );
};
