import { Outlet } from "react-router-dom";
import { Stack } from "@mui/material";
import { NavigationBar } from "src/components/NavigationBar";

export const TopbarLayout = () => {
  return (
    <Stack spacing={8}>
      <NavigationBar />
      <Outlet />
    </Stack>
  );
};
