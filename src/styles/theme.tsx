import { createTheme } from "@mui/material";

const colors = {
  blue: "#003D7C",
  orange: "#EF7C00",
};

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: colors.blue,
//     },
//     secondary: {
//       main: colors.orange,
//     },
//   },
//   components: {
//     MuiButtonBase: {
//       defaultProps: {
//         disableRipple: true,
//       },
//     },
//   },
// });

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: colors.blue,
    },
    secondary: {
      main: colors.orange,
    },
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
});

export default theme;
