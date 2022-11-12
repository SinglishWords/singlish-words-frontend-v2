import { useState } from "react";
import { NavLink } from "react-router-dom";
import { List } from "@mui/icons-material";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Menu,
  Toolbar,
} from "@mui/material";

import { NavigationButton } from "src/components/NavigationButton";
import { NavigationBarRoutes } from "src/routes/nav.routes";

export const NavigationBar = () => {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Phone Navigation Bar */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <List />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {NavigationBarRoutes.map(({ path, label }) => (
                <NavLink
                  key={label}
                  to={path}
                  style={{ textDecoration: "none" }}
                >
                  {({ isActive }) => {
                    return (
                      <NavigationButton
                        selected={isActive}
                        buttonDescription={label}
                      />
                    );
                  }}
                </NavLink>
              ))}
            </Menu>
          </Box>

          {/* Web Navigation Bar */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {NavigationBarRoutes.map(({ path, label }) => (
              <NavLink key={label} to={path} style={{ textDecoration: "none" }}>
                {({ isActive }) => {
                  return (
                    <NavigationButton
                      selected={isActive}
                      buttonDescription={label}
                    />
                  );
                }}
              </NavLink>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
