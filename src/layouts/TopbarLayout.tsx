import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { Stack } from "@mui/material";
import { NavigationBar } from "src/components/NavigationBar";

export const TopbarLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/home");
  }, []);

  return (
    <Stack spacing={3}>
      <NavigationBar />
      <Outlet />
    </Stack>
  );
};
